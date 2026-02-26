'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, Filter } from 'lucide-react';
import Fuse from 'fuse.js';
import { Policy } from '@/types';
import { PolicyCard } from '@/components/PolicyCard';

interface PoliciesClientProps {
  policies: Policy[];
  cities: string[];
}

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'active', label: '✅ 有效' },
  { value: 'upcoming', label: '🔜 即将生效' },
  { value: 'expired', label: '⏱️ 已过期' },
];

const BENEFIT_OPTIONS = [
  { value: '', label: '全部类型' },
  { value: 'tax', label: '税收优惠' },
  { value: 'subsidy', label: '创业补贴' },
  { value: 'workspace', label: '场地支持' },
  { value: 'social_security', label: '社保补贴' },
  { value: 'finance', label: '金融支持' },
  { value: 'compute', label: '算力支持' },
  { value: 'residence', label: '落户支持' },
];

export function PoliciesClient({ policies, cities }: PoliciesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [city, setCity] = useState(searchParams.get('city') ?? '');
  const [status, setStatus] = useState(searchParams.get('status') ?? '');
  const [benefit, setBenefit] = useState(searchParams.get('benefit') ?? '');

  // Fuse.js for fuzzy search
  const fuse = useMemo(() => new Fuse(policies, {
    keys: ['name', 'summary', 'city', 'district', 'issuer', 'tags'],
    threshold: 0.4,
    includeScore: true,
  }), [policies]);

  const filtered = useMemo(() => {
    let result = policies;

    // Full-text search
    if (query.trim()) {
      result = fuse.search(query).map((r) => r.item);
    }

    // City filter
    if (city) {
      result = result.filter((p) => p.city === city);
    }

    // Status filter
    if (status) {
      result = result.filter((p) => p.status === status);
    }

    // Benefit type filter
    if (benefit) {
      result = result.filter((p) => p.benefits && benefit in p.benefits);
    }

    return result;
  }, [policies, fuse, query, city, status, benefit]);

  const hasFilters = query || city || status || benefit;

  function clearFilters() {
    setQuery('');
    setCity('');
    setStatus('');
    setBenefit('');
  }

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (city) params.set('city', city);
    if (status) params.set('status', status);
    if (benefit) params.set('benefit', benefit);
    const newUrl = params.toString() ? `/policies?${params}` : '/policies';
    router.replace(newUrl, { scroll: false });
  }, [query, city, status, benefit, router]);

  return (
    <div>
      {/* ── Filter Bar ─────────────────────────────────── */}
      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="搜索政策名称、城市、机构..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all"
          />
        </div>

        {/* City */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all min-w-[120px]"
        >
          <option value="">全部城市</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all min-w-[120px]"
        >
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Benefit type */}
        <select
          value={benefit}
          onChange={(e) => setBenefit(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all min-w-[130px]"
        >
          {BENEFIT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Clear */}
        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-400 hover:text-slate-200 border border-white/10 rounded-lg hover:border-white/20 transition-all whitespace-nowrap">
            <X className="w-4 h-4" />
            清除
          </button>
        )}
      </div>

      {/* ── Results count ───────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {hasFilters
            ? <>找到 <span className="text-indigo-400 font-semibold">{filtered.length}</span> 个结果</>
            : <>全部 <span className="text-indigo-400 font-semibold">{filtered.length}</span> 个政策</>
          }
        </p>
        {hasFilters && (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3 h-3" />
            已筛选
          </div>
        )}
      </div>

      {/* ── Policy Grid ─────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      ) : (
        <div className="glass-card p-16 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-slate-400 font-medium mb-2">没有找到匹配的政策</p>
          <p className="text-sm text-slate-600">试试调整搜索词或筛选条件</p>
          <button onClick={clearFilters}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
            清除所有筛选
          </button>
        </div>
      )}
    </div>
  );
}
