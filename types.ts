export interface CardOption {
  label: string;
  value: string;
}

export enum CardType {
  TEXT_INPUT = 'TEXT_INPUT',
  TEXT_AREA = 'TEXT_AREA',
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  SLIDER = 'SLIDER',
  SORTABLE = 'SORTABLE',
}

export interface CardDefinition {
  id: number;
  module: string;
  question: string;
  type: CardType;
  options?: CardOption[]; // For select types
  minLabel?: string; // For slider
  maxLabel?: string; // For slider
  maxSelections?: number; // For multi-select
  placeholder?: string;
}

export interface UserAnswer {
  cardId: number;
  value: any; // string, string[], number (0-1), or sorted array
  processedData?: any; // Simulating the edge function processing result
}

export interface PersonalityProfile {
  name: string;
  coreIdentities: string[];
  traits: Record<string, number>; // e.g., rational_vs_emotional: 0.7
  values: string[];
  communicationStyle: {
    ticks: string[];
    tone: string;
  };
  memories: {
    longTerm: string[]; // Milestones
    shortTerm: string[]; // Recent chat
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  feedback?: 'like' | 'dislike';
}

export interface DailyMilestone {
  date: string;
  content: string;
  mood: string;
}