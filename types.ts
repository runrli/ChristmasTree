
export enum TreeMorphState {
  TREE = 'TREE',
  SCATTER = 'SCATTER',
  LOVE = 'LOVE'
}

export interface HandData {
  x: number;
  y: number;
  gesture: 'pinch' | 'open' | 'fist' | 'none';
  detected: boolean;
}
