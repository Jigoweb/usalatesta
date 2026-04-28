export type LabyrinthPhase = 'intro' | 'playing' | 'finished' | 'distraction' | 'estimation' | 'reveal';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  phase: LabyrinthPhase;
  actualTimeMs: number | null;
  estimatedTimeMs: number | null;
  hasGyroscopePermission: boolean;
  level: number;
}
