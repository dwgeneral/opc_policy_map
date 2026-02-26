'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CITY_COORDINATES } from '@/lib/mapData';

interface ChinaMapSectionProps {
  cityStats: Record<string, { total: number; active: number }>;
}

interface ScatterDataItem {
  name: string;
  value: [number, number, number];
  active: number;
  total: number;
}

export function ChinaMapSection({ cityStats }: ChinaMapSectionProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!chartRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chart: any = null;

    async function initChart() {
      const echarts = await import('echarts');
      let chinaGeoJson = null;
      try {
        const resp = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json');
        chinaGeoJson = await resp.json();
      } catch {
        console.warn('Failed to load China GeoJSON');
      }

      if (!chinaGeoJson || !chartRef.current) return;

      echarts.registerMap('china', chinaGeoJson);
      chart = echarts.init(chartRef.current, null, { renderer: 'canvas' });

      const scatterData: ScatterDataItem[] = Object.entries(cityStats)
        .filter(([city]) => CITY_COORDINATES[city])
        .map(([city, stats]) => ({
          name: city,
          value: [CITY_COORDINATES[city][0], CITY_COORDINATES[city][1], stats.total],
          active: stats.active,
          total: stats.total,
        }));

      chart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(15,15,26,0.95)',
          borderColor: 'rgba(99,102,241,0.3)',
          borderWidth: 1,
          textStyle: { color: '#f1f5f9', fontSize: 13 },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter: (params: any) => {
            if (!params.data) return '';
            const { name, total, active } = params.data as ScatterDataItem;
            return `<div style="padding:4px 2px">
              <div style="font-weight:700;font-size:15px;margin-bottom:6px">📍 ${name}</div>
              <div style="color:#94a3b8">收录政策：<span style="color:#6366f1;font-weight:600">${total} 个</span></div>
              <div style="color:#94a3b8">有效政策：<span style="color:#10b981;font-weight:600">${active} 个</span></div>
              <div style="color:#64748b;font-size:11px;margin-top:4px">点击查看该城市政策</div>
            </div>`;
          },
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: { min: 0.8, max: 4 },
          label: { show: false },
          itemStyle: {
            areaColor: 'rgba(26,26,46,0.8)',
            borderColor: 'rgba(99,102,241,0.2)',
            borderWidth: 1,
          },
          emphasis: {
            label: { show: false },
            itemStyle: {
              areaColor: 'rgba(99,102,241,0.15)',
              borderColor: 'rgba(99,102,241,0.5)',
            },
          },
          select: { disabled: true },
        },
        series: [
          {
            name: 'OPC政策',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: scatterData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            symbolSize: (val: any[]) => Math.max(16, Math.min(40, 14 + (val[2] || 1) * 6)),
            itemStyle: {
              color: '#6366f1',
              opacity: 0.9,
              shadowBlur: 20,
              shadowColor: 'rgba(99,102,241,0.5)',
            },
            emphasis: {
              scale: true,
              itemStyle: {
                color: '#a78bfa',
                shadowBlur: 30,
                shadowColor: 'rgba(167,139,250,0.6)',
              },
            },
            label: {
              show: true,
              formatter: '{b}',
              position: 'bottom',
              color: '#94a3b8',
              fontSize: 11,
              distance: 4,
            },
          },
        ],
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chart.on('click', (params: any) => {
        const d = params.data as ScatterDataItem | undefined;
        if (d?.name) {
          router.push(`/policies?city=${encodeURIComponent(d.name)}`);
        }
      });
    }

    initChart();

    const resizeObserver = new ResizeObserver(() => {
      chart?.resize();
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart?.dispose();
    };
  }, [cityStats, router]);

  return (
    <div className="relative w-full" style={{ height: 480 }}>
      <div ref={chartRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-4 text-xs text-slate-600 flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
          有 OPC 政策的城市
        </span>
        <span className="text-slate-700">（点击城市查看详情，可拖拽缩放）</span>
      </div>
    </div>
  );
}
