export interface UserProfile {
  xp: number;
  level: number;
  answers: string[];
  psychProfile: string;
  isElite: boolean;
  classification?: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  responses: string[];
}