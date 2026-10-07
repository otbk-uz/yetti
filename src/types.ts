export type TabId = 'ai' | 'analytics' | 'tasks' | 'vault' | 'studio' | 'community' | 'settings';

export type ThemeMode = 'purple' | 'cyan' | 'rose' | 'emerald';

export interface ModuleItem {
  id: TabId;
  number: number;
  name: string;
  subtitle: string;
  icon: string;
  badge?: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  category: 'Frontend' | 'Backend' | 'AI / ML' | 'Design' | 'DevOps';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  assignedTo: string;
}

export interface AiMessage {
  id: string;
  sender: 'user' | 'yetti-ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface VaultFile {
  id: string;
  name: string;
  category: 'document' | 'media' | 'code' | 'archive';
  size: string;
  updatedAt: string;
  iconName: string;
  starred: boolean;
}

export interface CodeSnippet {
  id: string;
  title: string;
  language: 'typescript' | 'python' | 'html' | 'css';
  code: string;
  description: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  avatar: string;
  lastActive: string;
  contributions: number;
}
