import React, { useState } from 'react';
import { FolderLock, FileText, Database, Image, FileCode, UploadCloud, Star, Download, HardDrive } from 'lucide-react';
import type { VaultFile } from '../types';
import { INITIAL_VAULT_FILES } from '../data/mockData';

export const CloudVault: React.FC = () => {
  const [files, setFiles] = useState<VaultFile[]>(INITIAL_VAULT_FILES);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const renderFileIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText size={20} color="#38bdf8" />;
      case 'Database': return <Database size={20} color="#f59e0b" />;
      case 'Image': return <Image size={20} color="#ec4899" />;
      case 'FileCode': return <FileCode size={20} color="#10b981" />;
      default: return <FileText size={20} color="#8b5cf6" />;
    }
  };

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          const newFile: VaultFile = {
            id: `f-${Date.now()}`,
            name: `yetti_dump_${Math.floor(Math.random() * 900 + 100)}.json`,
            category: 'code',
            size: '1.4 MB',
            updatedAt: 'Hozir',
            iconName: 'FileCode',
            starred: true
          };

          setFiles(f => [newFile, ...f]);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const toggleStar = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, starred: !f.starred } : f));
  };

  const filteredFiles = files.filter(f => {
    if (activeCategory === 'starred') return f.starred;
    if (activeCategory !== 'all') return f.category === activeCategory;
    return true;
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
          }}>
            <FolderLock size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Modul 4: Cloud Vault</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Xavfsiz Kvant Darajasidagi Bulutli Xotira</p>
          </div>
        </div>

        <button className="btn-primary" onClick={handleSimulateUpload} disabled={isUploading}>
          <UploadCloud size={18} /> {isUploading ? `Yuklanmoqda (${uploadProgress}%)` : 'Fayl Yuklash'}
        </button>
      </div>

      {/* Storage Capacity Overview */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HardDrive size={22} color="#f59e0b" />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Bulutli Xotira Bandligi: 1.2 GB / 10 GB</span>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>12% ishlatildi (Enkripsiya: AES-256 GCM)</span>
          </div>
        </div>
        <div style={{ width: '200px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: '12%', height: '100%', background: 'var(--accent-amber)' }} />
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {[
          { id: 'all', label: 'Barchasi' },
          { id: 'starred', label: 'Saralangan ⭐' },
          { id: 'code', label: 'Kod fayllari' },
          { id: 'document', label: 'Hujjatlar' },
          { id: 'archive', label: 'Arxivlar' }
        ].map(cat => (
          <button
            key={cat.id}
            className={`btn-glass ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              fontSize: '0.8rem',
              background: activeCategory === cat.id ? 'var(--accent-amber)' : undefined,
              color: activeCategory === cat.id ? '#fff' : undefined
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* File List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {filteredFiles.map(file => (
          <div key={file.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ padding: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px' }}>
                  {renderFileIcon(file.iconName)}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600, margin: 0, wordBreak: 'break-all' }}>{file.name}</h4>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{file.size} • {file.updatedAt}</span>
                </div>
              </div>

              <button
                onClick={() => toggleStar(file.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: file.starred ? '#f59e0b' : '#64748b' }}
              >
                <Star size={18} fill={file.starred ? '#f59e0b' : 'none'} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button className="btn-glass" style={{ fontSize: '0.72rem', padding: '4px 8px' }}>
                <Download size={14} /> Yuklab olish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
