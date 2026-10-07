import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AiAssistant } from './components/AiAssistant';
import { AnalyticsModule } from './components/AnalyticsModule';
import { TaskManager } from './components/TaskManager';
import { CloudVault } from './components/CloudVault';
import { CodeStudio } from './components/CodeStudio';
import { CommunityHub } from './components/CommunityHub';
import { SettingsModule } from './components/SettingsModule';
import type { TabId, ThemeMode } from './types';
import { CheckCircle2, X } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('ai');
  const [theme, setTheme] = useState<ThemeMode>('purple');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard navigation for 1-7 keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const keyTabMap: Record<string, TabId> = {
        '1': 'ai',
        '2': 'analytics',
        '3': 'tasks',
        '4': 'vault',
        '5': 'studio',
        '6': 'community',
        '7': 'settings'
      };
      if (keyTabMap[e.key]) {
        setActiveTab(keyTabMap[e.key]);
        triggerToast(`Modul ${e.key} tanlandi`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'ai': return <AiAssistant />;
      case 'analytics': return <AnalyticsModule />;
      case 'tasks': return <TaskManager />;
      case 'vault': return <CloudVault />;
      case 'studio': return <CodeStudio />;
      case 'community': return <CommunityHub />;
      case 'settings': return <SettingsModule currentTheme={theme} onThemeChange={setTheme} onTriggerNotification={triggerToast} />;
      default: return <AiAssistant />;
    }
  };

  return (
    <div className="app-container">
      {/* Background Animated Glow Mesh */}
      <div className="app-bg-glow" />
      <div className="app-grid-overlay" />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTriggerAction={triggerToast}
      />

      {/* Main Workspace Body */}
      <div className="main-layout">
        <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

        <main className="main-content">
          {renderActiveModule()}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--accent-purple)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 9999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: '8px' }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
