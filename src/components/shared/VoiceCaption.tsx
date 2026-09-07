import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2Icon, XIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

/**
 * Visible transcript of whatever the assistant is saying out loud.
 * Voice is never the only channel — the same sentence is always readable.
 */
export function VoiceCaption({ offset = 'tabs' }: {offset?: 'tabs' | 'none';}) {
  const { caption, stopSpeaking } = useApp();

  return (
    <div
      className={
      'pointer-events-none absolute inset-x-0 z-40 flex justify-center px-3 ' + (
      offset === 'tabs' ? 'bottom-[104px]' : 'bottom-5')
      }
      aria-live="polite">
      
      <AnimatePresence>
        {caption &&
        <motion.div
          key={caption.id}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="pointer-events-auto flex w-full max-w-[340px] items-start gap-3 rounded-card bg-ink-900/95 px-4 py-3 text-white shadow-lift">
          
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-clay-500">
              <Volume2Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="flex-1 text-[15px] leading-snug">{caption.text}</p>
            <button
            type="button"
            onClick={stopSpeaking}
            aria-label="Stop the assistant"
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 ease-out hover:bg-white/20">
            
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}