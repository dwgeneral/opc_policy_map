import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] mt-20"
      style={{ background: 'rgba(15,15,26,0.95)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🗺️</span>
              <span className="font-bold gradient-text">OPC 政策地图</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              社区驱动的中国一人企业政策信息开源平台
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com/dwgeneral/opc_policy_map"
                target="_blank" rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">功能</h4>
            <ul className="space-y-2">
              {[
                ['/', '首页地图'],
                ['/policies', '政策库'],
                ['/parks', '园区汇总'],
                ['/compare', '政策对比'],
                ['/guides', '申请指南'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">参与贡献</h4>
            <ul className="space-y-2">
              {[
                ['https://github.com/dwgeneral/opc_policy_map', '⭐ Star 项目'],
                ['https://github.com/dwgeneral/opc_policy_map/issues/new?template=new-policy.md', '📋 提交政策'],
                ['https://github.com/dwgeneral/opc_policy_map/blob/main/CONTRIBUTING.md', '📖 贡献指南'],
                ['https://github.com/dwgeneral/opc_policy_map/discussions', '💬 社区讨论'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-3">关于</h4>
            <ul className="space-y-2">
              {[
                ['https://github.com/dwgeneral/opc_policy_map/blob/main/README.md', '项目介绍'],
                ['https://github.com/dwgeneral/opc_policy_map/blob/main/LICENSE', '开源协议'],
                ['https://github.com/dwgeneral/opc_policy_map/blob/main/CODE_OF_CONDUCT.md', '行为准则'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            代码协议 MIT · 数据协议 CC BY 4.0 · 政策信息仅供参考，以官方为准
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by the community
          </p>
        </div>
      </div>
    </footer>
  );
}
