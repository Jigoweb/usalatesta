declare module 'generate-maze' {
  export interface MazeCell {
    x: number;
    y: number;
    top: boolean;
    left: boolean;
    bottom: boolean;
    right: boolean;
    set: number;
  }

  export default function generateMaze(
    width?: number,
    height?: number,
    closed?: boolean,
    seed?: number
  ): MazeCell[][];
}
