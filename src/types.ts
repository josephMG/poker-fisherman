export type Avatar = {
  id: string;
  emoji: string;
  name: string;
};

export type Player = {
  id: 1 | 2;
  avatar: Avatar | null;
  score: number;
};

export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type Level = "BEGINNER" | "ADVANCED";

export type CardData = {
  id: string; // unique 
  rank: string;
  suit: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
  matchedBy?: 1 | 2;
};
