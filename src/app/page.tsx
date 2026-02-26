import { getAllPolicies, getSiteStats, getCityStats } from '@/lib/data';
import { PolicyCard } from '@/components/PolicyCard';
import { ChinaMapSection } from '@/components/ChinaMapSection';
import Link from 'next/link';
import { ArrowRight, TrendingUp, MapPin } from 'lucide-react';

export default async function HomePage() {
  const stats = getSiteStats();
  const recentPolicies = getAllPolicies().slice(0, 6);
  const cityStats = getCityStats();

  const statCards = [
    { label: '收录政策', value: stats.totalPolicies, icon: '📋', color: '#6366f1' },
    { label: '覆盖城市', value: stats.totalCities, icon: '🏙️', color: '#10b981' },
    { label: '有效政策', value: stats.activePolicies, icon: '✅', color: '#f59e0b' },
    { label: '收录园区', value: stats.totalParks || '持续添加', icon: '🏢', color: '#a78bfa' },
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm mb-6 fade-up">
            <TrendingUp className="w-4 h-4" />
            <span>全国 OPC 政策持续更新中 · 欢迎社区贡献</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 fade-up">
            <span className="gradient-text">中国 OPC 政策地图</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed fade-up">
            汇总全国各城市<strong className="text-slate-300">一人企业（OPC）</strong>优惠政策与配套园区，
            帮助独立开发者、自由职业者快速查询、对比、申请各地政策。
            <br />社区共建 · 开源 · 持续更新
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 fade-up">
            <Link href="/policies"
              className="btn-primary flex items-center gap-2 px-6 py-3 text-sm rounded-xl">
              浏览所有政策
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/compare"
              className="btn-outline flex items-center gap-2 px-6 py-3 text-sm rounded-xl">
              城市政策对比
            </Link>
            <a href="https://github.com/dwgeneral/opc_policy_map/issues/new?template=new-policy.md"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline flex items-center gap-2 px-6 py-3 text-sm rounded-xl">
              ➕ 贡献政策
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="glass-card p-5 text-center">
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Map ──────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" />
                政策分布地图
              </h2>
              <p className="text-sm text-slate-500 mt-1">点击城市查看该城市的 OPC 政策详情</p>
            </div>
          </div>
          <div className="glass-card p-4" style={{ minHeight: 480 }}>
            <ChinaMapSection cityStats={cityStats} />
          </div>
        </div>
      </section>

      {/* ── Recent Policies ──────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                最新收录政策
              </h2>
              <p className="text-sm text-slate-500 mt-1">按发布时间排序，持续更新</p>
            </div>
            <Link href="/policies"
              className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPolicies.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Entry ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/parks" className="glass-card p-6 flex items-start gap-4 hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-xl shrink-0">🏢</div>
            <div>
              <h3 className="font-semibold text-slate-200 mb-1">园区信息</h3>
              <p className="text-xs text-slate-500 leading-relaxed">查看各地 OPC 配套园区，了解入驻条件与费用</p>
            </div>
          </Link>

          <Link href="/compare" className="glass-card p-6 flex items-start gap-4 hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-xl shrink-0">⚖️</div>
            <div>
              <h3 className="font-semibold text-slate-200 mb-1">政策对比</h3>
              <p className="text-xs text-slate-500 leading-relaxed">横向对比多个城市政策差异，找到最适合你的城市</p>
            </div>
          </Link>

          <Link href="/guides" className="glass-card p-6 flex items-start gap-4 hover:border-indigo-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-xl shrink-0">📖</div>
            <div>
              <h3 className="font-semibold text-slate-200 mb-1">申请指南</h3>
              <p className="text-xs text-slate-500 leading-relaxed">手把手教程，申请材料清单，避坑经验分享</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Contribute CTA ───────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto glass-card p-8 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(167,139,250,0.08))' }}>
          <h2 className="text-2xl font-bold text-slate-100 mb-3">帮助完善政策数据</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            你是否了解你所在城市的 OPC 政策？欢迎通过 GitHub 提交政策信息，
            或者在 Issue 里分享你的申请经验。每一份贡献都让这个平台更完善！
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://github.com/dwgeneral/opc_policy_map/issues/new?template=new-policy.md"
              target="_blank" rel="noopener noreferrer"
              className="btn-primary px-5 py-2.5 text-sm rounded-xl">
              📋 提交新政策
            </a>
            <a href="https://github.com/dwgeneral/opc_policy_map"
              target="_blank" rel="noopener noreferrer"
              className="btn-outline px-5 py-2.5 text-sm rounded-xl">
              ⭐ GitHub Star
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
