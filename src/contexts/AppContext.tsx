import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState } from
'react';
import type { AppMode, BuyerAccountType } from '../types';

export interface ProductDraft {
  photo: string | null;
  enhancedPhoto: string | null;
  transcript: string;
  title: string;
  description: string;
  description_hi?: string;
  category?: string;
  tags?: string[];
  price: number;
  price_min?: number;
  price_max?: number;
  price_explanation?: string;
  photoCount: number;
  listing_id?: string;
}

export const emptyDraft: ProductDraft = {
  photo: null,
  enhancedPhoto: null,
  transcript: '',
  title: '',
  description: '',
  description_hi: '',
  category: 'Textiles',
  tags: [],
  price: 1800,
  price_min: 1500,
  price_max: 2200,
  price_explanation: '',
  photoCount: 0,
  listing_id: undefined
};

interface Caption {
  id: number;
  text: string;
}

interface AppContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  languageId: string;
  setLanguageId: (id: string) => void;
  buyerAccountType: BuyerAccountType;
  setBuyerAccountType: (type: BuyerAccountType) => void;
  online: boolean;
  setOnline: (online: boolean) => void;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
  caption: Caption | null;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  draft: ProductDraft;
  updateDraft: (patch: Partial<ProductDraft>) => void;
  resetDraft: () => void;
  saved: string[];
  toggleSaved: (id: string) => void;
  cart: string[];
  addToCart: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: {children: React.ReactNode;}) {
  const [mode, setMode] = useState<AppMode>('artisan');
  const [languageId, setLanguageId] = useState('hi');
  const [buyerAccountType, setBuyerAccountType] =
  useState<BuyerAccountType>('business');
  const [online, setOnline] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const [caption, setCaption] = useState<Caption | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [saved, setSaved] = useState<string[]>(['p5']);
  const [cart, setCart] = useState<string[]>([]);
  const timer = useRef<number | null>(null);
  const counter = useRef(0);

  const stopSpeaking = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCaption(null);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (timer.current) window.clearTimeout(timer.current);
      counter.current += 1;
      setCaption({ id: counter.current, text });
      if (soundOn && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
      const duration = Math.min(12000, 2600 + text.length * 55);
      timer.current = window.setTimeout(() => setCaption(null), duration);
    },
    [soundOn]
  );

  const updateDraft = useCallback((patch: Partial<ProductDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetDraft = useCallback(() => setDraft(emptyDraft), []);

  const toggleSaved = useCallback((id: string) => {
    setSaved((prev) =>
    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const addToCart = useCallback((id: string) => {
    setCart((prev) => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      mode,
      setMode,
      languageId,
      setLanguageId,
      buyerAccountType,
      setBuyerAccountType,
      online,
      setOnline,
      soundOn,
      setSoundOn,
      caption,
      speak,
      stopSpeaking,
      draft,
      updateDraft,
      resetDraft,
      saved,
      toggleSaved,
      cart,
      addToCart
    }),
    [
    mode,
    languageId,
    buyerAccountType,
    online,
    soundOn,
    caption,
    speak,
    stopSpeaking,
    draft,
    updateDraft,
    resetDraft,
    saved,
    toggleSaved,
    cart,
    addToCart]

  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}