import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from 'lucide-react';

interface AIProgressProps {
  message: string;
  durationMs?: number;
  onDone?: () => void;
}

/** Never a blank wait: a named task, a friendly line, and visible progress. */
export function AIProgress({ message, durationMs = 1800, onDone }: AIProgressProps) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const started = Date.now();
    const tick = window.setInterval(() => {
      const pct = Math.min(100, (Date.now() - started) / durationMs * 100);
      setProgress(Math.max(8, pct));
    }, 80);
    const finish = window.setTimeout(() => onDone?.(), durationMs);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(finish);
    };
  }, [durationMs, onDone]);

  return (
    <div
      className="rounded-card border border-sand-300 bg-white p-5 shadow-card"
      role="status"
      aria-live="polite">
      
      <div className="flex items-center gap-3">
        <motion.span
          animate={{ rotate: [0, 12, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-clay-50 text-clay-600">
          
          <SparklesIcon className="h-6 w-6" aria-hidden="true" />
        </motion.span>
        <p className="text-artisan-body font-semibold text-ink-900">{message}</p>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-sand-200">
        <div
          className="h-full rounded-full bg-clay-500 transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }} />
        
      </div>
    </div>);

}