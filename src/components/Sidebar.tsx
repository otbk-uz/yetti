import React from 'react';
import { 
  Bot, 
  Activity, 
  CheckSquare, 
  FolderLock, 
  Code2, 
  Users, 
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { YETTI_MODULES } from '../data/mockData';
import type { TabId } from '../types';

interface SidebarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const renderIcon = (iconName: string, color: string) => {
    const props = { size: 18, color };
    switch (iconName) {
      case 'Bot': return <Bot {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'CheckSquare': return <CheckSquare {...props} />;
      case 'FolderLock': return <FolderLock {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Sliders': return <Sliders {...props} />;
      default: return <Bot {...props} />;
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <span>YETTI 7 Ekosistema</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {YETTI_MODULES.map((mod) => {
          const isActive = activeTab === mod.id;
          return (
            <div
              key={mod.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(mod.id)}
            >
              <div className="nav-item-left">
                <div className="nav-item-num">{mod.number}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {renderIcon(mod.icon, isActive ? '#ffffff' : mod.color)}
                    <span style={{ fontSize: '0.9rem' }}>{mod.name}</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: isActive ? '#cbd5e1' : 'var(--text-dim)' }}>
                    {mod.subtitle}
                  </div>
                </div>
              </div>

              {mod.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#fff' : mod.color,
                  fontWeight: 600
                }}>
                  {mod.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div className="glass-panel" style={{ padding: '0.85rem', background: 'rgba(139, 92, 246, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <ShieldAlert size={16} color="#06b6d4" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0' }}>System Status</span>
          </div>
          <p style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
            Barcha 7 modul sinxronlangan. Git repository: <code style={{ color: '#38bdf8' }}>d:\project\yetti</code>
          </p>
        </div>
      </div>
    </aside>
  );
};
