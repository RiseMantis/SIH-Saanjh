import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { MicButton } from '../shared/MicButton';
import { useApp } from '../../contexts/AppContext';
import { noteForPath } from '../../data/screenNotes';

/**
 * Persistent tap-to-talk assistant. Always visible in artisan mode, never in a menu.
 * Includes an explicit help trigger that re-explains the current screen.
 */
export function FloatingAssistant() {
  const [listening, setListening] = useState(false);
  const {
    speak
  } = useApp();
  const {
    pathname
  } = useLocation();
  const note = noteForPath(pathname);
  const handleToggle = () => {
    if (listening) {
      setListening(false);
      speak("I didn't catch that. Say it again, or tap the buttons on the screen — both work.");
      return;
    }
    setListening(true);
    speak('Listening…');
    window.setTimeout(() => setListening(false), 2600);
  };
  return <div className="pointer-events-none absolute bottom-[112px] right-4 z-40 flex flex-col items-end gap-3">
      <button type="button" onClick={() => speak(note.voicePrompt || 'This screen shows your information. Tell me what you want to do.')} className="pointer-events-auto flex min-h-[56px] items-center gap-2 rounded-full border-2 border-ink-900 bg-white px-4 text-base font-bold text-ink-900 shadow-card transition-colors duration-150 ease-out hover:bg-sand-100">
        <div className="h-6 w-6" aria-hidden="true" />
        Help me
      </button>

      <div className="pointer-events-auto flex items-center gap-2">
        <AnimatePresence>
          {listening && <motion.span initial={{
          opacity: 0,
          x: 8
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: 8
        }} transition={{
          duration: 0.18,
          ease: [0.23, 1, 0.32, 1]
        }} className="rounded-full bg-ink-900 px-3 py-1.5 text-sm font-semibold text-white">
              Listening…
            </motion.span>}
        </AnimatePresence>
        <MicButton listening={listening} onToggle={handleToggle} size="md" label="Press and speak" />
      </div>
      <p className="pointer-events-none rounded-full bg-white/90 px-2.5 py-1 text-[13px] font-bold text-ink-900 shadow-card">
        Speak
      </p>
    </div>;
}