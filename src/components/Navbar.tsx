import React, { useState, useEffect } from 'react';
import { Zap, Search, Bell, GitBranch } from 'lucide-react';
import type { TabId } from '../types';

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onTriggerAction: (msg: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectTab, onTriggerAction }) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [notificationsCount, setNotificationsCount] = useState<number>(3);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onTriggerAction(`Qidiruv: "${searchQuery}" natijalari yuklandi.`);
      setSearchQuery('');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-logo" onClick={() => onSelectTab('ai')}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
        }}>
          <Zap size={22} color="#ffffff" />
        </div>
        <div>
          <span style={{ color: '#fff' }}>YETTI</span>
          <span className="text-gradient" style={{ marginLeft: '4px' }}>7</span>
        </div>
        <span className="logo-badge">REPO: v7.0</span>
      </div>

      <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '340px' }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          className="glass-input"
          placeholder="Modul, topshiriq yoki kod qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', paddingLeft: '38px', fontSize: '0.85rem' }}
        />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Git status widget */}
        <div 
          onClick={() => onSelectTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            padding: '4px 10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#94a3b8'
          }}
          title="Git repository joylashuvi: d:\project\yetti"
        >
          <GitBranch size={14} color="#06b6d4" />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>d:\project\yetti</span>
        </div>

        {/* System Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span className="pulse-indicator"></span>
          <span>Online (7/7 Core)</span>
        </div>

        {/* Live Clock */}
        <div style={{ 
          fontFamily: 'monospace', 
          fontSize: '0.85rem', 
          background: 'rgba(15, 23, 42, 0.8)', 
          padding: '4px 10px', 
          borderRadius: '6px',
          border: '1px solid rgba(255,255,255,0.06)',
          color: '#38bdf8' 
        }}>
          {timeStr || '02:11:51'}
        </div>

        {/* Notifications Icon */}
        <button 
          className="btn-glass"
          style={{ padding: '8px', position: 'relative' }}
          onClick={() => {
            setNotificationsCount(0);
            onTriggerAction('Bildirishnomalar: 7 ta modul barqaror ishlamoqda.');
          }}
        >
          <Bell size={18} color="#cbd5e1" />
          {notificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ec4899',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {notificationsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
