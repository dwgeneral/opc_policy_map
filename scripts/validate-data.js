#!/usr/bin/env node
/**
 * 数据校验脚本：验证 data/ 目录下所有 YAML 数据文件格式是否正确
 * 运行方式：npm run validate-data
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_DIR = path.join(__dirname, '..', 'data');
let errorCount = 0;
let warnCount = 0;
let successCount = 0;

const REQUIRED_FIELDS_POLICY = ['id', 'city', 'name', 'issuer', 'publish_date', 'status', 'source_url'];
const VALID_STATUSES = ['active', 'expired', 'upcoming', 'unknown'];

function error(file, msg) {
  console.error(`  ❌ ERROR [${file}]: ${msg}`);
  errorCount++;
}

function warn(file, msg) {
  console.warn(`  ⚠️  WARN  [${file}]: ${msg}`);
  warnCount++;
}

function validatePolicy(data, file) {
  // Required fields
  for (const field of REQUIRED_FIELDS_POLICY) {
    if (!data[field]) {
      error(file, `缺少必填字段: "${field}"`);
    }
  }

  // Status
  if (data.status && !VALID_STATUSES.includes(data.status)) {
    error(file, `status 值无效: "${data.status}"，应为 ${VALID_STATUSES.join(' | ')}`);
  }

  // Source URL
  if (data.source_url && !data.source_url.startsWith('http')) {
    error(file, `source_url 必须以 http 开头`);
  }

  // Date format
  const dateFields = ['publish_date', 'effective_date', 'expiry_date'];
  for (const df of dateFields) {
    if (data[df]) {
      const dateStr = String(data[df]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        warn(file, `${df} 格式建议为 YYYY-MM-DD，当前值: "${dateStr}"`);
      }
    }
  }

  // Warn if no benefits
  if (!data.benefits || Object.keys(data.benefits).length === 0) {
    warn(file, '未填写 benefits 字段，建议补充优惠内容');
  }

  // Warn if no meta.last_verified
  if (!data.meta?.last_verified) {
    warn(file, '未填写 meta.last_verified，建议添加最后核实日期');
  }
}

function validateYamlFile(filePath) {
  const relPath = path.relative(path.join(__dirname, '..'), filePath);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(content);

    if (!data || typeof data !== 'object') {
      error(relPath, 'YAML 文件内容为空或格式错误');
      return;
    }

    if (filePath.includes('/policies/') && !filePath.includes('_schema')) {
      validatePolicy(data, relPath);
    }

    successCount++;
  } catch (e) {
    error(relPath, `YAML 解析失败: ${e.message}`);
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) {
      validateYamlFile(fullPath);
    }
  }
}

console.log('\n📊 OPC Policy Map - 数据校验\n');
console.log('扫描目录:', DATA_DIR);
console.log('─'.repeat(50));

scanDir(DATA_DIR);

console.log('\n─'.repeat(50));
console.log(`✅ 通过: ${successCount} 个文件`);
if (warnCount > 0) console.log(`⚠️  警告: ${warnCount} 个`);
if (errorCount > 0) {
  console.log(`❌ 错误: ${errorCount} 个\n`);
  process.exit(1);
} else {
  console.log('\n🎉 所有数据文件校验通过！\n');
}
