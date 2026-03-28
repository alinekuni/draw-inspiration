// Core domain types for Draw Inspiration Generator

export interface PromptBreakdown {
  subject?: string;
  environment?: string;
  mood?: string;
  lighting?: string;
  twist?: string;
  constraint?: string;
}

export interface GeneratedPrompt {
  id: string;
  title: string;
  prompt: string;
  chips: string[];
  breakdown: PromptBreakdown;
  createdAt: number;
}

export interface BuildState {
  subject: string[];
  mood: string[];
  style: string[];
  constraint: string[];
  twist: string[];
  lockedSections: Set<string>;
}

export interface StyleBoard {
  id: string;
  name: string;
  chips: string[];
  description: string;
}
