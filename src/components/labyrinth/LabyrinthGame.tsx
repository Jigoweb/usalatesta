import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabyrinthGame } from '../../hooks/useLabyrinthGame';
import { Check, Info } from 'lucide-react';

interface LabyrinthGameProps {
  onComplete: (realTimeMs: number) => void;
}

export default function LabyrinthGame({ onComplete }: LabyrinthGameProps) {
  // Dimension configuration
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cols = 10;
  // Calculate dynamic rows based on screen height, keeping cell size proportional
  // We leave some padding for top/bottom margins
  // On mobile (smaller height), we reduce padding to maximize maze size
  const isMobile = windowDimensions.height < 700;
  const paddingY = isMobile ? 80 : 120; // safe area
  const paddingX = isMobile ? 20 : 40;
  
  // Calculate max possible cell size
  const maxCellWidth = (windowDimensions.width - paddingX) / cols;
  
  // Choose cell size, capped at a sensible max to avoid being too large on tablets
  const cellSize = Math.min(Math.floor(maxCellWidth), 45); 
  
  // Calculate rows to fill remaining vertical space
  const rows = Math.max(10, Math.floor((windowDimensions.height - paddingY) / cellSize));
  
  
  const [showTooltip, setShowTooltip] = useState(true);

  const { maze, ballPos, targetPos, phase } = useLabyrinthGame({ 
    onComplete, 
    width: cols, 
    height: rows 
  });

  // Hide tooltip after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw maze on canvas (more performant than DOM elements for complex mazes)
  useEffect(() => {
    if (!canvasRef.current || maze.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw walls
    ctx.strokeStyle = '#0B2A57'; // Deep blue
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = maze[y][x];
        const cx = x * cellSize;
        const cy = y * cellSize;

        ctx.beginPath();
        if (cell.top) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cellSize, cy);
        }
        if (cell.right) {
          ctx.moveTo(cx + cellSize, cy);
          ctx.lineTo(cx + cellSize, cy + cellSize);
        }
        if (cell.bottom) {
          ctx.moveTo(cx, cy + cellSize);
          ctx.lineTo(cx + cellSize, cy + cellSize);
        }
        if (cell.left) {
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, cy + cellSize);
        }
        ctx.stroke();
      }
    }
  }, [maze, cols, rows, cellSize]);

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center w-full h-full relative"
      style={{ background: 'linear-gradient(160deg, #0B2A57 0%, #1a1a2e 50%, #4195A4 100%)' }}
    >
      
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/20 blur-3xl rounded-full z-0 pointer-events-none" />

      {/* Instruction banner */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="absolute top-6 left-0 right-0 px-6 z-10"
          >
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 flex items-center justify-center gap-3 shadow-sm border border-slate-100">
              <Info className="w-5 h-5 text-teal-600" />
              <p className="text-slate-700 text-sm font-medium">Inclina il telefono per guidare la sfera all&apos;uscita</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Container */}
      <div 
        className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/50"
        style={{
          width: cols * cellSize,
          height: rows * cellSize,
          marginTop: isMobile ? '20px' : '0'
        }}
      >
        {/* Canvas for static maze walls */}
        <canvas
          ref={canvasRef}
          width={cols * cellSize}
          height={rows * cellSize}
          className="absolute inset-0 z-10 pointer-events-none"
        />

        {/* Target Indicator */}
        <div 
          className="absolute z-20 flex items-center justify-center"
          style={{
            width: cellSize,
            height: cellSize,
            left: targetPos.x * cellSize,
            top: targetPos.y * cellSize
          }}
        >
          <div className="w-3/4 h-3/4 border-2 border-dashed border-teal-500 rounded-full animate-[spin_4s_linear_infinite]" />
          <Check className="absolute w-4 h-4 text-teal-600" />
        </div>

        {/* The Ball */}
        <motion.div
          className="absolute z-30 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md shadow-red-500/50"
          style={{
            // Ball width is relative to cell size
            width: cellSize * 0.6,
            height: cellSize * 0.6,
            // Convert physics coordinates to pixel coordinates
            // Ball position is the center of the ball
            x: (ballPos.x * cellSize) - (cellSize * 0.3), // half ball width
            y: (ballPos.y * cellSize) - (cellSize * 0.3),
          }}
          transition={{ type: 'tween', ease: 'linear', duration: 0.016 }} // approx 60fps
        >
          {/* Inner highlight for 3D effect */}
          <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/40 rounded-full" />
        </motion.div>
        
        {/* Completion Overlay */}
        {phase === 'completed' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-40 bg-white/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="bg-teal-500 text-white rounded-full p-4 shadow-lg"
            >
              <Check className="w-8 h-8" />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
