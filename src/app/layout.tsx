import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: 'OPC 政策地图 - 中国一人企业政策信息开源平台',
    template: '%s | OPC 政策地图',
  },
  description:
    '汇总全国各城市一人企业（OPC）优惠政策与配套园区，帮助独立开发者、自由职业者快速查询、对比、申请各地 OPC 政策。社区共建，持续更新。',
  keywords: ['OPC', '一人企业', '一人有限公司', '独立开发者', '自由职业', '创业政策', '税收优惠', '创业补贴'],
  authors: [{ name: 'OPC Policy Map Contributors' }],
  openGraph: {
    title: 'OPC 政策地图 - 中国一人企业政策信息开源平台',
    description: '汇总全国各城市一人企业优惠政策与配套园区，社区共建，持续更新。',
    type: 'website',
    locale: 'zh_CN',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col relative">
        {/* Background ambient orbs */}
        <div
          className="bg-orb w-96 h-96 opacity-20 top-[-80px] left-[-80px]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
        <div
          className="bg-orb w-80 h-80 opacity-10 bottom-[20%] right-[-60px]"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }}
        />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
