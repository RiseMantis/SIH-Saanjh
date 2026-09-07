import { useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';

/**
 * Plays a screen's ambient voice prompt exactly once per visit, never on repeat.
 * Returns the prompt text so screens can also expose it as a visible "help" line.
 */
export function useAmbientPrompt(prompt: string, enabled = true) {
  const { speak } = useApp();
  const played = useRef(false);

  useEffect(() => {
    if (!enabled || played.current) return;
    played.current = true;
    const id = window.setTimeout(() => speak(prompt), 350);
    return () => window.clearTimeout(id);
  }, [enabled, prompt, speak]);

  return prompt;
}