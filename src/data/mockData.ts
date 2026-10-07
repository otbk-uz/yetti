import type { ModuleItem, Task, AiMessage, VaultFile, CodeSnippet, CommunityMember } from '../types';

export const YETTI_MODULES: ModuleItem[] = [
  {
    id: 'ai',
    number: 1,
    name: 'YETTI AI Agent',
    subtitle: 'Neyron Intellekt Yordamchisi',
    icon: 'Bot',
    badge: 'v7.2',
    color: '#8b5cf6'
  },
  {
    id: 'analytics',
    number: 2,
    name: '7-Metrics Analytics',
    subtitle: 'Real-vaqt Tizim Metrikalari',
    icon: 'Activity',
    badge: 'Live',
    color: '#06b6d4'
  },
  {
    id: 'tasks',
    number: 3,
    name: 'Task Matrix',
    subtitle: 'Intellektual Vazifalar Oqimi',
    icon: 'CheckSquare',
    badge: '12 Active',
    color: '#10b981'
  },
  {
    id: 'vault',
    number: 4,
    name: 'Cloud Vault',
    subtitle: 'Xavfsiz Bulutli Xotira',
    icon: 'FolderLock',
    badge: '1.2 GB',
    color: '#f59e0b'
  },
  {
    id: 'studio',
    number: 5,
    name: 'Code Studio',
    subtitle: 'Interaktiv Kod Ishxonasi',
    icon: 'Code2',
    badge: 'IDE',
    color: '#ec4899'
  },
  {
    id: 'community',
    number: 6,
    name: 'Cyber Hub',
    subtitle: 'Jamoaviy Ekosistema',
    icon: 'Users',
    badge: '94 Online',
    color: '#3b82f6'
  },
  {
    id: 'settings',
    number: 7,
    name: 'System Control',
    subtitle: 'Konfiguratsiya va Git Repo',
    icon: 'Sliders',
    badge: 'Git',
    color: '#64748b'
  }
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'YETTI 7 Core Dashboard UI Dizaynini Yaxshilash',
    category: 'Frontend',
    priority: 'urgent',
    status: 'in-progress',
    dueDate: 'Bugun, 18:00',
    assignedTo: 'Sardor A.'
  },
  {
    id: 'task-2',
    title: 'Neyron AI Agent Response Latency Minimallashtirish',
    category: 'AI / ML',
    priority: 'high',
    status: 'in-progress',
    dueDate: 'Ertaga, 12:00',
    assignedTo: 'YETTI Neural Core'
  },
  {
    id: 'task-3',
    title: 'Real-vaqt Cloud Vault Enkripsiyasini Sinovdan O\'tkazish',
    category: 'DevOps',
    priority: 'medium',
    status: 'todo',
    dueDate: '10-Oktyabr',
    assignedTo: 'Malika K.'
  },
  {
    id: 'task-4',
    title: 'Git Repository Hub Integratsiyasini Yakunlash',
    category: 'Backend',
    priority: 'urgent',
    status: 'completed',
    dueDate: 'Kecha',
    assignedTo: 'Jamshid R.'
  },
  {
    id: 'task-5',
    title: 'Code Studio Interaktiv Sandbox Autocompletion funksiyasi',
    category: 'Frontend',
    priority: 'medium',
    status: 'todo',
    dueDate: '12-Oktyabr',
    assignedTo: 'Nodira B.'
  }
];

export const INITIAL_AI_MESSAGES: AiMessage[] = [
  {
    id: 'msg-1',
    sender: 'yetti-ai',
    text: 'Salom! Men YETTI v7 Intellektual Assistantman. Sizga loyihangizni rivojlantirish, kodingizni optimallashtirish va tizim tahlillarida yordam berishga tayyorman!',
    timestamp: '02:11'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'YETTI loyihasining asosiy afzalliklarini sanab ber.',
    timestamp: '02:12'
  },
  {
    id: 'msg-3',
    sender: 'yetti-ai',
    text: 'YETTI loyihasining 7 ta asosiy moduli:',
    timestamp: '02:12',
    codeSnippet: `1. YETTI AI Agent (Neyron AI yordamchisi)
2. 7-Metrics Analytics (Real-time vizual ko'rsatkichlar)
3. Task Matrix (Smart kanban va topshiriqlar oqimi)
4. Cloud Vault (Shifrlangan bulut ombori)
5. Code Studio (Ko'p tilli kod muhiti)
6. Cyber Hub (Dasturchilar hamjamiyati)
7. System Control (Git repo va mavzu sozlamalari)`
  }
];

export const INITIAL_VAULT_FILES: VaultFile[] = [
  {
    id: 'f-1',
    name: 'yetti_architecture_v7.pdf',
    category: 'document',
    size: '4.8 MB',
    updatedAt: '2 soat oldin',
    iconName: 'FileText',
    starred: true
  },
  {
    id: 'f-2',
    name: 'neural_weights_matrix.bin',
    category: 'archive',
    size: '412 MB',
    updatedAt: 'Kecha',
    iconName: 'Database',
    starred: true
  },
  {
    id: 'f-3',
    name: 'ui_dark_glassmorphism.fig',
    category: 'media',
    size: '18.4 MB',
    updatedAt: '3 kun oldin',
    iconName: 'Image',
    starred: false
  },
  {
    id: 'f-4',
    name: 'yetti_core_engine.ts',
    category: 'code',
    size: '64 KB',
    updatedAt: 'Bugun, 01:45',
    iconName: 'FileCode',
    starred: true
  }
];

export const MOCK_CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'cs-1',
    title: 'YETTI Matrix Neural Engine Initializer',
    language: 'typescript',
    description: 'Neyron tarmoq modullarini parallel ishga tushirish funksiyasi.',
    code: `import { YettiCore } from '@yetti/neural';

export async function initializeYettiSystem(modules = 7) {
  console.log(\`[YETTI 7] Booting \${modules} core modules...\`);
  
  const system = new YettiCore({
    mode: 'hyper-performance',
    security: 'quantum-grade',
    gitSync: true
  });

  const status = await system.bootSequence();
  return { status, ready: true, modulesActive: 7 };
}`
  },
  {
    id: 'cs-2',
    title: 'Fast API Stream Generator',
    language: 'python',
    description: 'Python Async stream orqali analitika va AI ma\'lumotlarini uzatish.',
    code: `import asyncio
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI(title="YETTI Core API")

async def yetti_stream():
    for step in range(1, 8):
        await asyncio.sleep(0.5)
        yield f"data: {{\"module\": {step}, \"status\": \"ACTIVE\"}}\\n\\n"

@app.get("/api/v7/stream")
async def get_stream():
    return StreamingResponse(yetti_stream(), media_type="text/event-stream")`
  }
];

export const COMMUNITY_MEMBERS: CommunityMember[] = [
  {
    id: 'm-1',
    name: 'Sherzod Tursunov',
    role: 'Lead Architect',
    status: 'online',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastActive: 'Hozir',
    contributions: 342
  },
  {
    id: 'm-2',
    name: 'Dina YETTI AI',
    role: 'Autonomous Core',
    status: 'online',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    lastActive: 'Hozir',
    contributions: 1209
  },
  {
    id: 'm-3',
    name: 'Azizjon Karimov',
    role: 'Security Engineer',
    status: 'busy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastActive: '15 daqiqa oldin',
    contributions: 189
  },
  {
    id: 'm-4',
    name: 'Elena Rostova',
    role: 'UI/UX Visionary',
    status: 'offline',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lastActive: '2 soat oldin',
    contributions: 275
  }
];
