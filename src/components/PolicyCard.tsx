import Link from 'next/link';
import { MapPin, Calendar, ExternalLink, Tag } from 'lucide-react';
import { Policy, STATUS_LABELS, BENEFIT_LABELS } from '@/types';

interface PolicyCardProps {
  policy: Policy;
}

const STATUS_CLASS: Record<string, string> = {
  active: 'badge-active',
  expired: 'badge-expired',
  upcoming: 'badge-upcoming',
  unknown: 'badge-expired',
};

export function PolicyCard({ policy }: PolicyCardProps) {
  const benefitKeys = policy.benefits ? Object.keys(policy.benefits) : [];

  return (
    <Link href={`/policies/${policy.id}`} className="block">
      <div className="glass-card p-5 h-full flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-100 text-sm leading-snug line-clamp-2 flex-1">
            {policy.name}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${STATUS_CLASS[policy.status]}`}>
            {STATUS_LABELS[policy.status]}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {policy.city}{policy.district ? ` · ${policy.district}` : ''}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {policy.publish_date}
          </span>
        </div>

        {/* Summary */}
        {policy.summary && (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {policy.summary}
          </p>
        )}

        {/* Benefits */}
        {benefitKeys.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {benefitKeys.slice(0, 4).map((key) => (
              <span key={key} className="tag text-[11px] py-0">
                {BENEFIT_LABELS[key] ?? key}
              </span>
            ))}
            {benefitKeys.length > 4 && (
              <span className="tag text-[11px] py-0 opacity-60">+{benefitKeys.length - 4}</span>
            )}
          </div>
        )}

        {/* Tags */}
        {policy.tags && policy.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {policy.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="flex items-center gap-0.5 text-[11px] text-slate-500">
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
          <span className="text-xs text-slate-600 truncate">
            {policy.issuer}
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        </div>
      </div>
    </Link>
  );
}
