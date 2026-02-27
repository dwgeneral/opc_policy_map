#!/usr/bin/env node
/**
 * 政策有效期检查脚本
 * 用途：
 *   - 找出已过期的政策（status=active 但 expiry_date 已过）
 *   - 找出即将在 60 天内到期的政策
 *   - 找出超过 180 天未验证的政策（meta.last_verified 过旧）
 *
 * 运行：node scripts/check-policy-expiry.js
 * GitHub Actions 中会将结果写入 /tmp/expiry-report.md，
 * 并通过 GITHUB_OUTPUT 输出 has_issues 标志。
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_DIR = path.join(__dirname, '..', 'data', 'policies');
const WARNING_DAYS = 60;   // 即将到期预警天数
const STALE_DAYS = 180;    // 未验证超过此天数视为过旧

const today = new Date();
today.setHours(0, 0, 0, 0);

function daysDiff(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
}

const expired = [];
const expiringSoon = [];
const stale = [];
const missingExpiry = [];

// 遍历所有城市目录下的 YAML 文件
const cities = fs.readdirSync(DATA_DIR).filter(name =>
  fs.statSync(path.join(DATA_DIR, name)).isDirectory()
);

for (const city of cities) {
  const cityDir = path.join(DATA_DIR, city);
  const files = fs.readdirSync(cityDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));

  for (const file of files) {
    const filePath = path.join(cityDir, file);
    let policy;
    try {
      policy = yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch {
      continue;
    }
    if (!policy || !policy.id) continue;

    const label = `**${policy.city}${policy.district ? `·${policy.district}` : ''}** - ${policy.name}`;
    const fileRef = `\`data/policies/${city}/${file}\``;

    // 1. 检查是否已过期（active 状态但到期日已过）
    if (policy.status === 'active' && policy.expiry_date) {
      const diff = daysDiff(policy.expiry_date);
      if (diff < 0) {
        expired.push({ label, fileRef, expiry_date: policy.expiry_date, daysAgo: -diff });
      } else if (diff <= WARNING_DAYS) {
        expiringSoon.push({ label, fileRef, expiry_date: policy.expiry_date, daysLeft: diff });
      }
    }

    // 2. 无到期日的 active 政策（提醒维护者手动核查）
    if (policy.status === 'active' && !policy.expiry_date) {
      missingExpiry.push({ label, fileRef });
    }

    // 3. 长时间未验证的政策
    const lastVerified = policy.meta?.last_verified;
    if (lastVerified) {
      const staleDiff = -daysDiff(lastVerified); // 过去的天数
      if (staleDiff > STALE_DAYS) {
        stale.push({ label, fileRef, last_verified: lastVerified, daysAgo: staleDiff });
      }
    }
  }
}

// 生成 Markdown 报告
let report = `# 📋 OPC 政策有效期月度检查报告\n\n`;
report += `> 检查日期：${today.toISOString().slice(0, 10)}  \n`;
report += `> 预警窗口：${WARNING_DAYS} 天 | 过旧阈值：${STALE_DAYS} 天\n\n`;

const hasIssues = expired.length > 0 || expiringSoon.length > 0 || stale.length > 0;

if (!hasIssues && missingExpiry.length === 0) {
  report += `✅ **所有政策均在有效期内，无需处理。**\n`;
} else {
  if (expired.length > 0) {
    report += `## ❌ 已过期政策（${expired.length} 条）\n\n`;
    report += `请将以下政策的 \`status\` 改为 \`expired\`：\n\n`;
    for (const p of expired) {
      report += `- ${p.label}  \n  ${p.fileRef}  \n  到期日：${p.expiry_date}（已过 ${p.daysAgo} 天）\n\n`;
    }
  }

  if (expiringSoon.length > 0) {
    report += `## ⚠️ 即将到期政策（${expiringSoon.length} 条）\n\n`;
    report += `请核查以下政策是否续期或即将失效：\n\n`;
    for (const p of expiringSoon) {
      report += `- ${p.label}  \n  ${p.fileRef}  \n  到期日：${p.expiry_date}（还剩 ${p.daysLeft} 天）\n\n`;
    }
  }

  if (stale.length > 0) {
    report += `## 🕰️ 长时间未验证政策（${stale.length} 条）\n\n`;
    report += `以下政策超过 ${STALE_DAYS} 天未核实，请访问原始来源确认是否仍有效：\n\n`;
    for (const p of stale) {
      report += `- ${p.label}  \n  ${p.fileRef}  \n  最后验证：${p.last_verified}（已过 ${p.daysAgo} 天）\n\n`;
    }
  }

  if (missingExpiry.length > 0) {
    report += `## 📌 无到期日政策（${missingExpiry.length} 条，供参考）\n\n`;
    report += `以下政策未设置 \`expiry_date\`，建议在确认后补充：\n\n`;
    for (const p of missingExpiry) {
      report += `- ${p.label}  \n  ${p.fileRef}\n\n`;
    }
  }
}

report += `---\n\n*此 Issue 由 GitHub Actions 自动创建，请维护者处理后关闭。*\n`;

// 输出报告文件（供 CI 使用）
const reportPath = process.env.CI ? '/tmp/expiry-report.md' : path.join(__dirname, '..', 'expiry-report.md');
fs.writeFileSync(reportPath, report);

// 控制台摘要
console.log('\n=== 政策有效期检查结果 ===');
console.log(`• 已过期：${expired.length} 条`);
console.log(`• 即将到期（${WARNING_DAYS} 天内）：${expiringSoon.length} 条`);
console.log(`• 长时间未验证（超过 ${STALE_DAYS} 天）：${stale.length} 条`);
console.log(`• 无到期日：${missingExpiry.length} 条`);
console.log(`\n报告已写入：${reportPath}`);

// 向 GitHub Actions 输出 has_issues 标志
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `has_issues=${hasIssues}\n`);
}

// 本地运行时，若有问题则非零退出码
if (hasIssues) {
  process.exit(0); // CI 中用 continue-on-error，本地也不报错，仅供参考
}
