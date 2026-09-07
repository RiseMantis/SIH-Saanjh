import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAmbientPrompt } from '../hooks/useAmbientPrompt';
import { LanguageGrid } from '../components/shared/LanguageGrid';
import { VoiceCaption } from '../components/shared/VoiceCaption';
import { languages } from '../data/languages';

export function LanguageSelect() {
  const { mode, languageId, setLanguageId, speak } = useApp();
  const navigate = useNavigate();
  const artisan = mode === 'artisan';

  useAmbientPrompt(
    'Choose the language you speak. Tap any name and I will say it out loud.'
  );

  const handleSelect = (id: string) => {
    setLanguageId(id);
    const lang = languages.find((l) => l.id === id);
    if (lang) speak(`${lang.sampleGreeting} — ${lang.latinName}`);
  };

  return (
    <div className="relative flex h-full flex-col bg-sand-100 font-sans">
      <header className="flex items-center gap-3 border-b border-sand-300 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Go back"
          className="flex h-[56px] w-[56px] items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          
          <ArrowLeftIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-[22px] font-bold leading-tight text-ink-900">
            Your language
          </h1>
          <p className="text-base text-ink-600">Step 1 of 3</p>
        </div>
      </header>

      <div className="screen-scroll flex-1 px-4 py-5">
        <LanguageGrid
          selectedId={languageId}
          onSelect={handleSelect}
          density={artisan ? 'artisan' : 'buyer'} />
        
        <p className="mt-5 text-base leading-6 text-ink-500">
          Everything after this — buttons, the assistant’s voice and product
          descriptions — will be in the language you pick.
        </p>
      </div>

      <div className="border-t border-sand-300 bg-white p-4">
        <button
          type="button"
          onClick={() =>
          navigate(artisan ? '/artisan/signup' : '/buyer/signup')
          }
          className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300">
          
          Continue
          <ArrowRightIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <VoiceCaption offset="none" />
    </div>);

}