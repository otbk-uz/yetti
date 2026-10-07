import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, Zap, Server, Globe, Shield, ArrowUpRight } from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  const [metrics, setMetrics] = useState({
    cpu: 18,
    ram: 42,
    latency: 14,
    requests: 2840,
    uptime: '99.99%',
    vaultSync: 100,
    activeSockets: 94
  });

  const [refreshInterval, setRefreshInterval] = useState<number>(2000);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(15 + Math.random() * 20),
        ram: Math.floor(40 + Math.random() * 5),
        latency: Math.floor(10 + Math.random() * 8),
        requests: prev.requests + Math.floor(Math.random() * 12),
        activeSockets: Math.floor(90 + Math.random() * 10)
      }));
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  const cards = [
    { title: '1. CPU Yuklamasi', value: `${metrics.cpu}%`, icon: Cpu, color: '#8b5cf6', sub: '8 Cores Active' },
    { title: '2. Operativ Xotira (RAM)', value: `${metrics.ram}%`, icon: HardDrive, color: '#06b6d4', sub: '3.4 / 8.0 GB' },
    { title: '3. Javob Tezligi (Latency)', value: `${metrics.latency} ms`, icon: Zap, color: '#10b981', sub: 'Ultra Fast' },
    { title: "4. API So'rovlar (Bugun)", value: metrics.requests.toLocaleString(), icon: Server, color: '#f59e0b', sub: '+14% soatlik' },
    { title: '5. Tizim Barqarorligi', value: metrics.uptime, icon: Shield, color: '#ec4899', sub: 'SLA Guaranteed' },
    { title: '6. Bulut Sinxronizatsiyasi', value: `${metrics.vaultSync}%`, icon: Globe, color: '#3b82f6', sub: 'Real-time Encrypted' },
    { title: '7. Faol Sockets / Foydalanuvchilar', value: metrics.activeSockets.toString(), icon: Activity, color: '#a78bfa', sub: 'Live connections' }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <Activity size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Modul 2: 7-Metrics Analytics</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Real-vaqt Tizim Metrikalari va Tezlik Monitoringi</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Yangilanish:</span>
          {[1000, 2000, 5000].map(speed => (
            <button
              key={speed}
              className={`btn-glass ${refreshInterval === speed ? 'active' : ''}`}
              onClick={() => setRefreshInterval(speed)}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                background: refreshInterval === speed ? 'var(--accent-cyan)' : undefined,
                color: refreshInterval === speed ? '#fff' : undefined
              }}
            >
              {speed / 1000}s
            </button>
          ))}
        </div>
      </div>

      {/* 7 Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {cards.map((card, idx) => {
          const IconComponent = card.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{card.title}</span>
                <div style={{
                  padding: '6px',
                  borderRadius: '8px',
                  background: `${card.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <IconComponent size={18} color={card.color} />
                </div>
              </div>

              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' }}>
                {card.value}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                <span>{card.sub}</span>
                <ArrowUpRight size={14} color={card.color} />
              </div>

              {/* Progress bar visualizer */}
              <div style={{
                height: '4px',
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '999px',
                marginTop: '0.75rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: card.value.includes('%') ? card.value : '75%',
                  background: card.color,
                  borderRadius: '999px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Live Chart Graph */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Canli Tizim Trafik va Yuklama Grafigi</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>So'nggi 60 soniyadagi ma'lumotlar oqimi</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#10b981' }}>
            <span className="pulse-indicator"></span> Real-Time Stream Active
          </div>
        </div>

        {/* Animated Wave Chart */}
        <div style={{ height: '180px', width: '100%', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M0,80 Q50,30 100,70 T200,50 T300,90 T400,40 T500,60 L500,150 L0,150 Z"
              fill="url(#chartGradient)"
            />
            <path
              d="M0,80 Q50,30 100,70 T200,50 T300,90 T400,40 T500,60"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
