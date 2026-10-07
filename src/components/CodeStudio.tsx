import React, { useState } from 'react';
import { Code2, Play, Copy, Check, Terminal, FileCode } from 'lucide-react';
import { MOCK_CODE_SNIPPETS } from '../data/mockData';

export const CodeStudio: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState(MOCK_CODE_SNIPPETS[0]);
  const [codeVal, setCodeVal] = useState(selectedSnippet.code);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleSelectSnippet = (snippet: typeof MOCK_CODE_SNIPPETS[0]) => {
    setSelectedSnippet(snippet);
    setCodeVal(snippet.code);
    setConsoleOutput([]);
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(["[YETTI IDE] Compiling script...", "[YETTI IDE] Running environment..."]);

    setTimeout(() => {
      if (selectedSnippet.language === 'typescript') {
        setConsoleOutput([
          "[YETTI IDE] Compiling TS...",
          "⚡ [YETTI 7 Engine] Boot sequence initiated!",
          "✔ Module 1 (AI Agent): READY",
          "✔ Module 2 (Analytics): 99.99% SLA",
          "✔ Module 3 (Task Matrix): SYNCED",
          "✔ Module 4 (Cloud Vault): ENCRYPTED",
          "✔ Module 5 (Code Studio): RUNNING",
          "✔ Module 6 (Cyber Hub): CONNECTED",
          "✔ Module 7 (Git Repo): d:\\project\\yetti [CLEAN]",
          "✨ System status: 7/7 modules operational!"
        ]);
      } else {
        setConsoleOutput([
          "[Python 3.11] Initializing FastAPI server...",
          "INFO:     Started server process [PID 4812]",
          "INFO:     Waiting for application startup.",
          "INFO:     Application startup complete.",
          "INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)"
        ]);
      }
      setIsRunning(false);
    }, 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeVal);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'
          }}>
            <Code2 size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Modul 5: Code Studio</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Interaktiv Kod Sandbox va Kompilyatsiya Terminali</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-glass" onClick={handleCopyCode}>
            {isCopied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {isCopied ? 'Nusxalandi' : 'Kod Nusxasi'}
          </button>
          <button className="btn-primary" onClick={handleRunCode} disabled={isRunning}>
            <Play size={16} /> {isRunning ? 'Ishlamoqda...' : 'Kodni Bajarish (Run)'}
          </button>
        </div>
      </div>

      {/* Snippet Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {MOCK_CODE_SNIPPETS.map(snippet => (
          <button
            key={snippet.id}
            className={`btn-glass ${selectedSnippet.id === snippet.id ? 'active' : ''}`}
            onClick={() => handleSelectSnippet(snippet)}
            style={{
              fontSize: '0.8rem',
              background: selectedSnippet.id === snippet.id ? 'var(--accent-pink)' : undefined,
              color: selectedSnippet.id === snippet.id ? '#fff' : undefined
            }}
          >
            <FileCode size={14} /> {snippet.title}
          </button>
        ))}
      </div>

      {/* Code Editor and Terminal split screen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', minHeight: '340px' }}>
        {/* Editor Box */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            background: '#070b16',
            padding: '8px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.78rem',
            color: '#94a3b8',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>EDITOR ({selectedSnippet.language.toUpperCase()})</span>
            <span style={{ color: '#ec4899', fontSize: '0.7rem' }}>d:\project\yetti\src</span>
          </div>

          <textarea
            value={codeVal}
            onChange={(e) => setCodeVal(e.target.value)}
            style={{
              flex: 1,
              width: '100%',
              background: '#040711',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              padding: '1rem',
              border: 'none',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.6
            }}
          />
        </div>

        {/* Terminal Console Box */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{
            background: '#070b16',
            padding: '8px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.78rem',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Terminal size={14} />
            <span>OUTPUT CONSOLE</span>
          </div>

          <div style={{
            flex: 1,
            background: '#020409',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: '#e2e8f0',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {consoleOutput.length === 0 ? (
              <span style={{ color: '#64748b' }}>Kodni ishga tushirish uchun "Kodni Bajarish (Run)" tugmasini bosing...</span>
            ) : (
              consoleOutput.map((line, idx) => (
                <div key={idx} style={{ color: line.includes('✔') || line.includes('⚡') ? '#34d399' : '#cbd5e1' }}>
                  {line}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
