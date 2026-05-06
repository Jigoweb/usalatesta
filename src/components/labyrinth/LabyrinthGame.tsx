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

  const isMobile = windowDimensions.height < 700;
  
  const [showTooltip, setShowTooltip] = useState(true);

  // Top offset to clear the "X" button (header area)
  const topOffset = 80; 

  // 1. Calculate how many rows and cols we WANT based on a theoretical cell size
  const baseCellSize = 50; 
  const cols = Math.floor(windowDimensions.width / baseCellSize);
  const rows = Math.floor((windowDimensions.height - topOffset) / baseCellSize);

  // 2. NOW we force the cell size to be EXACTLY the available space divided by the rows/cols
  // This will result in rectangular cells (slightly wider or taller) instead of perfect squares
  // but guarantees 0 pixels of gap left over anywhere on the screen.
  const cellWidth = windowDimensions.width / cols;
  const cellHeight = (windowDimensions.height - topOffset) / rows;

  const actualCols = cols;
  const exactHeight = rows * cellHeight; 
  const yOffsetAdjustment = 0;
  
  const { maze, ballPos, targetPos, phase } = useLabyrinthGame({ 
    onComplete, 
    width: Math.max(1, actualCols), 
    height: Math.max(1, rows) 
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
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // Increased opacity for better contrast over gradients
    ctx.lineCap = 'round';

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < actualCols; x++) {
        const cell = maze[y][x];
        const cx = x * cellWidth;
        const cy = y * cellHeight;

        if (cell.top) {
          ctx.beginPath();
          // Thicker and solid white top border for the first row
          ctx.lineWidth = y === 0 ? 5 : 2.5;
          ctx.strokeStyle = y === 0 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)';
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + cellWidth, cy);
          ctx.stroke();
        }
        if (cell.right && x !== actualCols - 1) { // Skip rightmost border
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          // Estendi i bordi verticali fino in fondo se è l'ultima riga
          const bottomY = y === rows - 1 ? exactHeight : cy + cellHeight;
          ctx.moveTo(cx + cellWidth, cy);
          ctx.lineTo(cx + cellWidth, bottomY);
          ctx.stroke();
        }
        if (cell.bottom) {
          ctx.beginPath();
          // Thicker and solid white bottom border for the last row
          ctx.lineWidth = y === rows - 1 ? 5 : 2.5;
          ctx.strokeStyle = y === rows - 1 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.7)';
          // Se è l'ultima riga, disegna il bordo inferiore esattamente sul fondo effettivo del canvas
          const bottomY = y === rows - 1 ? exactHeight : cy + cellHeight;
          ctx.moveTo(cx, bottomY);
          ctx.lineTo(cx + cellWidth, bottomY);
          ctx.stroke();
        }
        if (cell.left && x !== 0) { // Skip leftmost border
          ctx.beginPath();
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          // Estendi i bordi verticali fino in fondo se è l'ultima riga
          const bottomY = y === rows - 1 ? exactHeight : cy + cellHeight;
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx, bottomY);
          ctx.stroke();
        }
      }
    }
  }, [maze, actualCols, rows, cellWidth, cellHeight, exactHeight]);

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-start w-full h-full relative"
      style={{ background: 'linear-gradient(160deg, #0B2A57 0%, #1a1a2e 50%, #4195A4 100%)' }}
    >
      
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/20 blur-3xl rounded-full z-0 pointer-events-none" />

      {/* Instruction banner */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute left-0 right-0 px-6 z-20 pb-safe"
            style={{ bottom: '30px' }} // Positioned at the bottom
          >
            <div className="bg-white rounded-2xl px-5 py-3.5 flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/50 border-t-4 border-slate-200/50 w-full max-w-sm mx-auto">
              <div className="bg-teal-100 rounded-full p-1.5 flex-shrink-0">
                <Info className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-slate-800 text-[15px] font-bold leading-snug">
                Inclina il telefono per guidare la sfera all'uscita
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Container */}
      <div 
        className="relative z-10 rounded-none overflow-hidden"
        style={{
          width: actualCols * cellWidth,
          height: exactHeight, // Force exact pixel height to touch the bottom
          marginTop: `${topOffset}px` // Static margin, doesn't move
        }}
      >
        {/* Canvas for static maze walls */}
        <canvas
          ref={canvasRef}
          width={actualCols * cellWidth}
          height={exactHeight} // Match exact height
          className="absolute inset-0 z-10 pointer-events-none"
        />

        {/* Target Indicator */}
        <div 
          className="absolute z-20 flex items-center justify-center"
          style={{
            width: cellWidth,
            height: cellHeight, 
            left: targetPos.x * cellWidth,
            top: targetPos.y * cellHeight
          }}
        >
          {/* Use Math.min to ensure the indicator is always a perfect circle, even in rectangular cells */}
          <div 
            className="absolute bg-white/20 rounded-full blur-sm" 
            style={{ width: Math.min(cellWidth, cellHeight) * 0.75, height: Math.min(cellWidth, cellHeight) * 0.75 }}
          />
          <div 
            className="absolute border-2 border-dashed border-white rounded-full animate-[spin_4s_linear_infinite]" 
            style={{ width: Math.min(cellWidth, cellHeight) * 0.75, height: Math.min(cellWidth, cellHeight) * 0.75 }}
          />
          <Check className="absolute w-4 h-4 text-white" />
        </div>

        {/* The Ball */}
        <motion.div
          className="absolute z-30 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md shadow-red-500/50"
          style={{
            // Ball width is relative to cell size
            width: Math.min(cellWidth, cellHeight) * 0.6,
            height: Math.min(cellWidth, cellHeight) * 0.6,
            // Convert physics coordinates to pixel coordinates
            // Ball position is the center of the ball
            x: (ballPos.x * cellWidth) - (Math.min(cellWidth, cellHeight) * 0.3), // half ball width
            y: (ballPos.y * cellHeight) - (Math.min(cellWidth, cellHeight) * 0.3),
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
