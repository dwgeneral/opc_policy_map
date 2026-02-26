import { getAllPolicies, getPolicyById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, MapPin, Calendar, Building, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { BENEFIT_LABELS, STATUS_LABELS } from '@/types';
import type { Metadata } from 'next';

interface Props { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return getAllPolicies().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const policy = getPolicyById(id);
  if (!policy) return {};
  return {
    title: policy.name,
    description: policy.summary ?? `${policy.city}${policy.district ? '·' + policy.district : ''} OPC政策详情`,
  };
}

const STATUS_ICON = {
  active: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  expired: <AlertCircle className="w-4 h-4 text-slate-400" />,
  upcoming: <Clock className="w-4 h-4 text-amber-400" />,
  unknown: <AlertCircle className="w-4 h-4 text-slate-400" />,
};

export default async function PolicyDetailPage({ params }: Props) {
  const { id } = await params;
  const policy = getPolicyById(id);
  if (!policy) notFound();

  const benefitEntries = policy.benefits ? Object.entries(policy.benefits) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link href="/policies"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        返回政策库
      </Link>

      {/* Header Card */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex-1">{policy.name}</h1>
          <div className={`flex items-center gap-1.5 text-sm px-3 py-1 rounded-full ${
            policy.status === 'active' ? 'badge-active' : policy.status === 'upcoming' ? 'badge-upcoming' : 'badge-expired'
          }`}>
            {STATUS_ICON[policy.status]}
            {STATUS_LABELS[policy.status]}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-5">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-400" />
            {policy.city}{policy.district ? ` · ${policy.district}` : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-400" />
            {policy.issuer}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-400" />
            发布于 {policy.publish_date}
          </span>
          {policy.policy_number && (
            <span className="text-slate-600">文号：{policy.policy_number}</span>
          )}
        </div>

        {policy.summary && (
          <p className="text-slate-300 leading-relaxed text-sm bg-white/[0.03] rounded-lg p-4 border border-white/5">
            {policy.summary}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Targets */}
          {policy.targets && policy.targets.length > 0 && (
            <div className="glass-card p-5">
              <h2 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
                🎯 适用对象
              </h2>
              <ul className="space-y-1.5">
                {policy.targets.map((t, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {benefitEntries.length > 0 && (
            <div className="glass-card p-5">
              <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                💰 优惠内容
              </h2>
              <div className="space-y-4">
                {benefitEntries.map(([key, benefit]) => (
                  <div key={key} className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="tag text-xs">{BENEFIT_LABELS[key] ?? key}</span>
                      <span className="font-medium text-sm text-slate-200">{benefit?.description}</span>
                    </div>
                    {benefit?.details && (
                      <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{benefit.details}</p>
                    )}
                    {benefit?.amount && (
                      <p className="text-sm font-semibold text-amber-400 mt-1">💵 {benefit.amount}</p>
                    )}
                    {benefit?.conditions && (
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line">条件：{benefit.conditions}</p>
                    )}
                    {benefit?.duration && (
                      <p className="text-xs text-slate-500 mt-1">期限：{benefit.duration}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {policy.requirements && policy.requirements.length > 0 && (
            <div className="glass-card p-5">
              <h2 className="font-bold text-slate-200 mb-3 flex items-center gap-2">
                📋 申请条件
              </h2>
              <ul className="space-y-2">
                {policy.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application */}
          {policy.application && (
            <div className="glass-card p-5">
              <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                📝 申请流程与材料
              </h2>
              {policy.application.process && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">申请步骤</h3>
                  <ol className="space-y-2">
                    {policy.application.process.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {policy.application.materials && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">所需材料</h3>
                  <ul className="space-y-1.5">
                    {policy.application.materials.map((m, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {policy.application.contact && (
                <div className="border-t border-white/5 pt-3 mt-3">
                  <h3 className="text-sm font-semibold text-slate-400 mb-2">联系方式</h3>
                  <div className="space-y-1 text-sm text-slate-400">
                    {policy.application.contact.phone && <p>📞 {policy.application.contact.phone}</p>}
                    {policy.application.contact.email && <p>📧 {policy.application.contact.email}</p>}
                    {policy.application.contact.address && <p>📍 {policy.application.contact.address}</p>}
                    {policy.application.contact.website && (
                      <p>🌐 <a href={policy.application.contact.website} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors">{policy.application.contact.website}</a></p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Source Link */}
          <div className="glass-card p-5">
            <h3 className="font-bold text-slate-200 mb-3">🔗 政策来源</h3>
            <a href={policy.source_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors break-all">
              <ExternalLink className="w-4 h-4 shrink-0" />
              查看政策原文
            </a>
            <p className="text-xs text-slate-600 mt-2">⚠️ 请以官方发布为准</p>
          </div>

          {/* Tags */}
          {policy.tags && policy.tags.length > 0 && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-200 mb-3">🏷️ 标签</h3>
              <div className="flex flex-wrap gap-1.5">
                {policy.tags.map((tag) => (
                  <Link key={tag} href={`/policies?q=${encodeURIComponent(tag)}`}>
                    <span className="tag cursor-pointer hover:bg-indigo-500/20 transition-colors">{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="glass-card p-5 space-y-2">
            <h3 className="font-bold text-slate-200 mb-3">📅 时间信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">发布日期</span>
                <span className="text-slate-300">{policy.publish_date}</span>
              </div>
              {policy.effective_date && (
                <div className="flex justify-between">
                  <span className="text-slate-500">生效日期</span>
                  <span className="text-slate-300">{policy.effective_date}</span>
                </div>
              )}
              {policy.expiry_date && (
                <div className="flex justify-between">
                  <span className="text-slate-500">截止日期</span>
                  <span className={policy.status === 'expired' ? 'text-slate-500 line-through' : 'text-slate-300'}>
                    {policy.expiry_date}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Meta */}
          {policy.meta && (
            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-200 mb-3">🔍 数据信息</h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                {policy.meta.contributor && <p>贡献者：{policy.meta.contributor}</p>}
                {policy.meta.last_verified && <p>最后核实：{policy.meta.last_verified}</p>}
                {policy.meta.verified && <p className="text-emerald-600">✅ 已人工核实</p>}
                {policy.meta.notes && <p className="text-slate-500 mt-2 leading-relaxed">{policy.meta.notes}</p>}
              </div>
              <a href={`https://github.com/dwgeneral/opc_policy_map/blob/main/data/policies`}
                target="_blank" rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:text-indigo-400 mt-3 inline-flex items-center gap-1 transition-colors">
                <ExternalLink className="w-3 h-3" />
                在 GitHub 上查看/修改数据
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
