import { getAllPolicies, getAllCities } from '@/lib/data';
import { PoliciesClient } from './PoliciesClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '政策库',
  description: '浏览全国各城市一人企业（OPC）优惠政策，支持多维度筛选和全文搜索。',
};

export default async function PoliciesPage() {
  const policies = getAllPolicies();
  const cities = getAllCities();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black gradient-text mb-2">政策库</h1>
        <p className="text-slate-400">共收录 <span className="text-indigo-400 font-semibold">{policies.length}</span> 个政策，覆盖 <span className="text-indigo-400 font-semibold">{cities.length}</span> 个城市</p>
      </div>
      <PoliciesClient policies={policies} cities={cities} />
    </div>
  );
}
