import React, { useState } from 'react';
import { CheckIcon, Edit3Icon, MicIcon, Volume2Icon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { AIProgress } from '../../shared/AIProgress';
import { MicButton, Waveform } from '../../shared/MicButton';
import { generateCatalog } from '../../../services/api';

type Phase = 'idle' | 'listening' | 'processing' | 'review' | 'error' | 'typing';

const generatedLines = [
  'Hand-woven cotton saree in deep red with a golden zari border.',
  'Woven on my pit loom over nine days, with butti motifs placed by hand.',
  '5.5 metres long, with a matching blouse piece.'
];

export function StepDescribe({ onNext }: {onNext: () => void;}) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [lines, setLines] = useState(generatedLines);
  const [customText, setCustomText] = useState('');
  const [reRecording, setReRecording] = useState<number | null>(null);
  const { updateDraft, speak } = useApp();

  const startListening = () => {
    setPhase('listening');
    speak('Listening…');
    window.setTimeout(() => setPhase('processing'), 3200);
  };

  const handleGenerateCatalog = async () => {
    const textToProcess = customText.trim() || lines.join(' ');
    try {
      const res = await generateCatalog(textToProcess);
      if (res && res.title) {
        updateDraft({
          transcript: textToProcess,
          title: res.title,
          description: res.description_en,
          description_hi: res.description_hi,
          category: res.category,
          tags: res.tags,
        });
        setLines([
          res.description_en,
          res.description_hi ? `हिंदी: ${res.description_hi}` : `Tags: ${res.tags.join(', ')}`
        ]);
        setPhase('review');
        speak(`I created a listing for: ${res.title}. Here is what I wrote.`);
        return;
      }
    } catch (err) {
      console.warn('Backend catalog generation offline or failed, using structured template:', err);
    }

    const fullText = lines.join(' ');
    updateDraft({
      transcript: fullText,
      title: 'Hand-woven cotton saree, red and gold',
      description: fullText,
      description_hi: 'हाथ से बुनी सूती साड़ी, लाल और सुनहरा ज़री किनारा',
      category: 'Textiles',
      tags: ['handwoven', 'cotton', 'zari', 'saree'],
    });
    setPhase('review');
    speak('I heard: hand-woven cotton saree, red and gold. Here is what I wrote. Shall I read it out?');
  };

  const fullText = lines.join(' ');

  return (
    <div className="px-4 pb-40 pt-4">
      {(phase === 'idle' || phase === 'listening') &&
      <div className="flex flex-col items-center pt-2 text-center">
          <h2 className="text-[26px] font-bold leading-9 text-ink-900">
            Tell me about what you made, in your own words
          </h2>
          <p className="mt-3 text-artisan-body text-ink-600">
            Speak in your language. Say what it is, what it is made of, and how
            long it took.
          </p>

          <div className="mt-8">
            <MicButton
            listening={phase === 'listening'}
            onToggle={() =>
            phase === 'listening' ? setPhase('processing') : startListening()
            }
            size="xl"
            label="Press and speak" />
          
          </div>

          <p className="mt-6 text-artisan-label font-bold text-ink-900">
            {phase === 'listening' ? 'I am listening…' : 'Press and speak'}
          </p>

          {phase === 'listening' &&
        <div className="mt-4 flex h-16 items-center justify-center rounded-card bg-white px-6 shadow-card">
              <div className="scale-75">
                <Waveform bars={11} />
              </div>
            </div>
        }

          <button
          type="button"
          onClick={() => setPhase('typing')}
          className="mt-8 min-h-[56px] rounded-full px-5 text-lg font-semibold text-ink-500 underline">
            I would rather type it
          </button>
        </div>
      }

      {phase === 'typing' &&
        <div className="pt-2">
          <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
            Type your product description
          </h2>
          <p className="mt-1 text-artisan-body text-ink-600">
            Describe the craft, material, dimensions, or time taken.
          </p>
          <textarea
            rows={4}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="e.g. Pure silk Chanderi scarf, hand block printed with natural indigo dye, 2 meters..."
            className="mt-4 w-full rounded-card border-2 border-sand-400 p-4 text-lg text-ink-900 focus:border-clay-500 focus:outline-none"
          />
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => setPhase('processing')}
              className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white shadow-lift hover:bg-clay-600">
              <Edit3Icon className="h-6 w-6" aria-hidden="true" />
              Generate AI Listing
            </button>
            <button
              type="button"
              onClick={() => setPhase('idle')}
              className="min-h-[56px] w-full rounded-full border-2 border-ink-900 text-lg font-bold text-ink-900">
              Back to voice
            </button>
          </div>
        </div>
      }

      {phase === 'processing' &&
      <div className="pt-6">
          <AIProgress
          message="Writing bilingual e-commerce listing with AI…"
          durationMs={2100}
          onDone={handleGenerateCatalog} />
        
        </div>
      }

      {phase === 'error' &&
      <div className="rounded-card border-2 border-gold-100 bg-gold-50 p-5">
          <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
            I did not catch that
          </h2>
          <p className="mt-2 text-artisan-body leading-7 text-ink-700">
            It may be noisy where you are. We can try speaking again, or you can
            tap to choose words instead.
          </p>
          <div className="mt-5 space-y-3">
            <button
            type="button"
            onClick={startListening}
            className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
            
              <MicIcon className="h-7 w-7" aria-hidden="true" />
              Let me speak again
            </button>
            <button
            type="button"
            onClick={() => setPhase('typing')}
            className="min-h-[64px] w-full rounded-full border-2 border-ink-900 text-artisan-label font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-white">
            
              Type description instead
            </button>
          </div>
        </div>
      }

      {phase === 'review' &&
      <>
          <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
            This is what I wrote for you
          </h2>
          <p className="mt-2 text-artisan-body text-ink-600">
            Tap any line to say it again. Nothing is final.
          </p>

          <button
          type="button"
          onClick={() => speak(fullText)}
          className="mt-4 flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-ink-900 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-ink-800">
          
            <Volume2Icon className="h-7 w-7" aria-hidden="true" />
            Play it back to me
          </button>

          <ul className="mt-4 space-y-3">
            {lines.map((line, i) =>
          <li key={i}>
                <button
              type="button"
              onClick={() => {
                setReRecording(i);
                speak('Say this line again.');
                window.setTimeout(() => {
                  setReRecording(null);
                  setLines((prev) =>
                  prev.map((l, idx) =>
                  idx === i ?
                  l.replace('deep red', 'bright red').replace('nine', 'ten') :
                  l
                  )
                  );
                }, 2200);
              }}
              className={
              'flex w-full items-start gap-3 rounded-card border-2 bg-white p-4 text-left transition-[border-color] duration-150 ease-out ' + (
              reRecording === i ?
              'border-clay-500' :
              'border-sand-300 hover:border-clay-300')
              }>
              
                  <span
                className={
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-full ' + (
                reRecording === i ?
                'bg-clay-500 text-white' :
                'bg-sand-200 text-clay-600')
                }>
                
                    <MicIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="flex-1 text-artisan-body leading-7 text-ink-900">
                    {reRecording === i ? 'Listening for this line…' : line}
                  </span>
                </button>
              </li>
          )}
          </ul>

          <button
          type="button"
          onClick={onNext}
          className="mt-5 flex min-h-[72px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
          
            <CheckIcon className="h-7 w-7" aria-hidden="true" />
            This is right
          </button>
        </>
      }
    </div>);

}