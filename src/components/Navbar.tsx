'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, FileText, Building2, Scale, BookOpen, Github } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: '首页', icon: Map },
  { href: '/policies', label: '政策库', icon: FileText },
  { href: '/parks', label: '园区', icon: Building2 },
  { href: '/compare', label: '对比', icon: Scale },
  { href: '/guides', label: '申请指南', icon: BookOpen },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06]"
      style={{ background: 'rgba(15,15,26,0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
              🗺
            </div>
            <div>
              <div className="font-bold text-sm leading-tight gradient-text">OPC 政策地图</div>
              <div className="text-[10px] text-slate-500 leading-tight">中国一人企业政策开源平台</div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/contribute"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 transition-all"
            >
              贡献政策
            </Link>
            <a
              href="https://github.com/dwgeneral/opc_policy_map"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden gap-1 pb-2 overflow-x-auto">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
