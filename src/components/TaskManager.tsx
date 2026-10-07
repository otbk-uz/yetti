import React, { useState } from 'react';
import { CheckSquare, Plus, CheckCircle2, User, Calendar, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task } from '../types';
import { INITIAL_TASKS } from '../data/mockData';

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'urgent' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<Task['category']>('Frontend');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newAssignee, setNewAssignee] = useState<string>('Dasturchi');

  const handleToggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        if (nextStatus === 'completed') {
          confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
        }
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      priority: newPriority,
      status: 'todo',
      dueDate: 'Yangi vazifa',
      assignedTo: newAssignee
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'in-progress') return t.status === 'in-progress';
    if (filter === 'urgent') return t.priority === 'urgent' || t.priority === 'high';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return <span style={{ background: '#ef444420', color: '#f87171', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>Shoshilinch</span>;
      case 'high': return <span style={{ background: '#f59e0b20', color: '#fbbf24', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>Yuqori</span>;
      case 'medium': return <span style={{ background: '#3b82f620', color: '#60a5fa', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>O'rta</span>;
      default: return <span style={{ background: '#10b98120', color: '#34d399', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>Oddiy</span>;
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <CheckSquare size={26} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Modul 3: Task Matrix</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>Intellektual Topshiriqlar va Loyiha Taym-layni</p>
          </div>
        </div>

        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Yangi Vazifa
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {[
          { id: 'all', label: 'Barcha Vazifalar' },
          { id: 'in-progress', label: 'Jarayonda' },
          { id: 'urgent', label: 'Muhim / Shoshilinch' },
          { id: 'completed', label: 'Bajarilgan' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn-glass ${filter === tab.id ? 'active' : ''}`}
            onClick={() => setFilter(tab.id as any)}
            style={{
              fontSize: '0.8rem',
              background: filter === tab.id ? 'var(--accent-emerald)' : undefined,
              color: filter === tab.id ? '#fff' : undefined
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredTasks.map(t => (
          <div
            key={t.id}
            className="glass-panel"
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: t.status === 'completed' ? 0.6 : 1,
              borderLeft: t.priority === 'urgent' ? '4px solid #ef4444' : '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => handleToggleStatus(t.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: t.status === 'completed' ? '#10b981' : '#64748b'
                }}
              >
                <CheckCircle2 size={24} />
              </button>

              <div>
                <h4 style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  margin: 0,
                  textDecoration: t.status === 'completed' ? 'line-through' : 'none',
                  color: t.status === 'completed' ? '#94a3b8' : '#fff'
                }}>
                  {t.title}
                </h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                  <span style={{ color: '#38bdf8' }}>#{t.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {t.dueDate}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} /> {t.assignedTo}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {getPriorityBadge(t.priority)}

              <button
                onClick={() => handleDeleteTask(t.id)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                title="O'chirish"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <form onSubmit={handleAddTask} className="glass-panel" style={{ width: '420px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Yangi Vazifa Qo'shish</h3>

            <input
              type="text"
              className="glass-input"
              placeholder="Vazifa nomini kiriting..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Kategoriya</label>
                <select
                  className="glass-input"
                  style={{ width: '100%', marginTop: '4px' }}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI / ML">AI / ML</option>
                  <option value="Design">Design</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Muhimlik</label>
                <select
                  className="glass-input"
                  style={{ width: '100%', marginTop: '4px' }}
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                >
                  <option value="low">Oddiy</option>
                  <option value="medium">O'rta</option>
                  <option value="high">Yuqori</option>
                  <option value="urgent">Shoshilinch</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Mas'ul shaxs</label>
              <input
                type="text"
                className="glass-input"
                style={{ width: '100%', marginTop: '4px' }}
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn-glass" onClick={() => setShowAddModal(false)}>
                Bekor qilish
              </button>
              <button type="submit" className="btn-primary">
                Qo'shish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
