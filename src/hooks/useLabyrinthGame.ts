import { useState, useEffect, useRef, useCallback } from 'react';
import generateMaze from 'generate-maze';
import { Position } from '../types/labyrinth';

type GamePhase = 'playing' | 'completed';

interface UseLabyrinthGameProps {
  onComplete: (realTimeMs: number) => void;
  width?: number;
  height?: number;
}

export function useLabyrinthGame({ onComplete, width = 10, height = 15 }: UseLabyrinthGameProps) {
  const [phase, setPhase] = useState<GamePhase>('playing');
  const [maze, setMaze] = useState<any[][]>([]);
  
  // Game logic state
  const [ballPos, setBallPos] = useState<Position>({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState<Position>({ x: width - 1, y: height - 1 });
  
  // Physics refs to avoid rapid re-renders during calculation
  const posRef = useRef<Position>({ x: 0, y: 0 });
  const velRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });
  const timerRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  
  // Tilt values
  const tiltRef = useRef<{ beta: number, gamma: number }>({ beta: 0, gamma: 0 });
  const keysRef = useRef<{ up: boolean, down: boolean, left: boolean, right: boolean }>({
    up: false, down: false, left: false, right: false
  });

  // Initialize Maze
  const initGame = useCallback(() => {
    // Generate a new maze with a random seed
    const newMaze = generateMaze(width, height, true, Math.floor(Math.random() * 100000));
    setMaze(newMaze);
    
    // Set start and end
    const start = { x: 0.5, y: 0.5 };
    const end = { x: width - 1, y: height - 1 };
    
    setBallPos(start);
    posRef.current = start;
    velRef.current = { x: 0, y: 0 };
    setTargetPos(end);
    
    startTimeRef.current = performance.now();
    setPhase('playing');
  }, [width, height]);

  // Handle device orientation
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // beta is front-to-back tilt in degrees, where front is positive (-180 to 180)
      // gamma is left-to-right tilt in degrees, where right is positive (-90 to 90)
      
      let beta = event.beta || 0;
      let gamma = event.gamma || 0;
      
      // Clamp values to prevent extreme speeds
      beta = Math.max(-45, Math.min(45, beta));
      gamma = Math.max(-45, Math.min(45, gamma));
      
      tiltRef.current = { beta, gamma };
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': keysRef.current.up = true; break;
        case 'ArrowDown': keysRef.current.down = true; break;
        case 'ArrowLeft': keysRef.current.left = true; break;
        case 'ArrowRight': keysRef.current.right = true; break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': keysRef.current.up = false; break;
        case 'ArrowDown': keysRef.current.down = false; break;
        case 'ArrowLeft': keysRef.current.left = false; break;
        case 'ArrowRight': keysRef.current.right = false; break;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Physics Loop
  useEffect(() => {
    if (phase !== 'playing' || maze.length === 0) return;

    const friction = 0.85; // Air friction / rolling resistance
    const gravity = 0.003; // Tilt sensitivity
    const bounce = -0.4; // Bounciness off walls
    const ballRadius = 0.3; // Relative to cell size (1)

    const updatePhysics = () => {
      const { beta, gamma } = tiltRef.current;
      const keys = keysRef.current;
      
      // Keyboard fallback (simulates tilt)
      let appliedBeta = beta;
      let appliedGamma = gamma;
      
      if (keys.up) appliedBeta = -20;
      if (keys.down) appliedBeta = 20;
      if (keys.left) appliedGamma = -20;
      if (keys.right) appliedGamma = 20;

      // Apply acceleration based on tilt
      velRef.current.x += appliedGamma * gravity;
      velRef.current.y += appliedBeta * gravity; // Note: beta positive means tilted forward (away from user), so ball should go "down" screen (+y)

      // Apply friction
      velRef.current.x *= friction;
      velRef.current.y *= friction;

      // Predict next position
      let nextX = posRef.current.x + velRef.current.x;
      let nextY = posRef.current.y + velRef.current.y;

      // Collision detection with maze walls
      // Ball is currently in cell (currentCellX, currentCellY)
      const currentCellX = Math.floor(posRef.current.x);
      const currentCellY = Math.floor(posRef.current.y);

      // We only check walls of the cell the ball is currently in
      // Cell top-left is at integer coordinates (0,0), (1,0) etc.
      // So boundaries of cell (x,y) are x to x+1, y to y+1
      
      if (maze[currentCellY] && maze[currentCellY][currentCellX]) {
        const cell = maze[currentCellY][currentCellX];
        
        // Left wall
        if (cell.left && nextX - ballRadius < currentCellX) {
          nextX = currentCellX + ballRadius;
          velRef.current.x *= bounce;
          vibrate();
        }
        // Right wall
        if (cell.right && nextX + ballRadius > currentCellX + 1) {
          nextX = currentCellX + 1 - ballRadius;
          velRef.current.x *= bounce;
          vibrate();
        }
        // Top wall
        if (cell.top && nextY - ballRadius < currentCellY) {
          nextY = currentCellY + ballRadius;
          velRef.current.y *= bounce;
          vibrate();
        }
        // Bottom wall
        if (cell.bottom && nextY + ballRadius > currentCellY + 1) {
          nextY = currentCellY + 1 - ballRadius;
          velRef.current.y *= bounce;
          vibrate();
        }
      }

      // Update position
      posRef.current = { x: nextX, y: nextY };
      
      // We throttle state updates to React to maintain smooth 60fps visually
      // without overloading React reconciler
      setBallPos({ ...posRef.current });

      // Check win condition
      // Ball must be in target cell
      if (
        Math.floor(posRef.current.x) === targetPos.x &&
        Math.floor(posRef.current.y) === targetPos.y
      ) {
        // Win!
        const endTime = performance.now();
        const totalTime = endTime - startTimeRef.current;
        setPhase('completed');
        onComplete(totalTime);
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100, 50, 200]);
        return; // Stop loop
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [phase, maze, targetPos, onComplete]);

  // Vibrate helper (debounced slightly to avoid buzzing)
  const lastVibrateRef = useRef(0);
  const vibrate = () => {
    const now = performance.now();
    if (now - lastVibrateRef.current > 100 && 'vibrate' in navigator) {
      navigator.vibrate(15);
      lastVibrateRef.current = now;
    }
  };

  useEffect(() => {
    initGame();
  }, [initGame]);

  return {
    maze,
    ballPos,
    targetPos,
    phase
  };
}
