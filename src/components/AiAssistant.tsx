import React, { useState } from 'react';
import { Bot, Send, Sparkles, Cpu, Copy, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { AiMessage } from '../types';
import { INITIAL_AI_MESSAGES } from '../data/mockData';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AiMessage[]>(INITIAL_AI_MESSAGES);
  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const promptSuggestions = [
    "🚀 YETTI 7 loyihasining arxitekturasini tushuntir",
    "⚡ Vite + React + TypeScript loyihasida Git repositoryni boshqarish",
    "🧠 Neyron AI modelining 7 ta asosiy parametri nimada?",
    "🛠️ Tailwind va Vanilla CSS taqqoslashi"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: AiMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let aiText = `YETTI Neyron Agent: "${query}" bo'yicha tahlil yakunlandi. Barcha 7 modul faol holatda.`;
      let codeSnippet: string | undefined = undefined;

      if (query.toLowerCase().includes('arxitektura') || query.toLowerCase().includes('yetti')) {
        aiText = `YETTI 7 - bu zamonaviy 7 in 1 raqamli ekosistema bo'lib, quyidagi modullarni o'z ichiga oladi:`;
        codeSnippet = `// YETTI Core System Architecture
const YettiArchitecture = {
  version: "7.0.0",
  repository: "d:\\project\\yetti",
  modules: [
    "1. YETTI AI Agent (Neyron AI)",
    "2. 7-Metrics Analytics (Real-time stats)",
    "3. Task Matrix (Kanban & Flow)",
    "4. Cloud Vault (Shifrlangan ombor)",
    "5. Code Studio (Interactive IDE)",
    "6. Cyber Hub (Jamoaviy chat)",
    "7. System Control (Git & Themes)"
  ]
};`;
      } else if (query.toLowerCase().includes('git')) {
        aiText = `Git repository muvaffaqiyatli ishga tushirilgan. Loyiha papkasi: d:\\project\\yetti`;
        codeSnippet = `git status
git add .
git commit -m "feat: YETTI 7 core module implementation"
git branch -M main`;
      }

      const aiMsg: AiMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'yetti-ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        codeSnippet
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
    }, 1000);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
          }}>
            <Bot size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Modul 1: YETTI AI Agent</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Neyron Intellekt Yordamchisi va Kod Assistent</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="glass-panel" style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Cpu size={14} color="#06b6d4" />
            <span>Model: YETTI-Neural-v7</span>
          </div>
          <button className="btn-glass" onClick={() => setMessages(INITIAL_AI_MESSAGES)} style={{ fontSize: '0.8rem' }}>
            <RefreshCw size={14} /> Clear Chat
          </button>
        </div>
      </div>

      {/* Suggestion Prompt Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            className="btn-glass"
            onClick={() => handleSend(prompt)}
            style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', borderRadius: '20px', padding: '6px 14px' }}
          >
            <Sparkles size={12} color="#a78bfa" />
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="glass-panel" style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '380px' }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '0.85rem 1.15rem',
                borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.sender === 'user'
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(30, 41, 59, 0.75)',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.9rem',
                boxShadow: msg.sender === 'user' ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.7rem', opacity: 0.7, fontWeight: 700 }}>
                  {msg.sender === 'user' ? 'Siz' : '🤖 YETTI AI'}
                </span>
                <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{msg.timestamp}</span>
              </div>
              <div>{msg.text}</div>

              {msg.codeSnippet && (
                <div style={{ marginTop: '0.75rem', position: 'relative' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#090d16',
                    padding: '4px 10px',
                    borderRadius: '6px 6px 0 0',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.7rem',
                    color: '#94a3b8'
                  }}>
                    <span>KOD / KONFIGURATSIYA</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                      {copiedId === msg.id ? 'Nusxalandi' : 'Nusxalash'}
                    </button>
                  </div>
                  <pre style={{
                    background: '#040711',
                    padding: '0.85rem',
                    borderRadius: '0 0 6px 6px',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#38bdf8',
                    overflowX: 'auto',
                    margin: 0
                  }}>
                    {msg.codeSnippet}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}>
            <Bot size={16} className="pulse-indicator" />
            <span>YETTI AI javob tayyorlamoqda...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          className="glass-input"
          placeholder="YETTI AI ga savol bering yoki topshiriq bering..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, padding: '0.85rem 1.2rem', fontSize: '0.9rem' }}
        />
        <button className="btn-primary" onClick={() => handleSend()}>
          <Send size={18} /> Jo'natish
        </button>
      </div>
    </div>
  );
};
