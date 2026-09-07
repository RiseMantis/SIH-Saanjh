import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CameraIcon,
  CheckIcon,
  HandIcon,
  MicIcon,
  RotateCcwIcon,
  Volume2Icon } from
'lucide-react';

interface Turn {
  who: 'assistant' | 'artisan' | 'system';
  text: string;
}

interface Node {
  id: string;
  step: string;
  title: string;
  Icon: typeof MicIcon;
  turns: Turn[];
  fallback: string;
}

const mainPath: Node[] = [
{
  id: '1',
  step: 'Step 1',
  title: 'Photo',
  Icon: CameraIcon,
  turns: [
  {
    who: 'assistant',
    text: 'Point your phone at what you made and press the big button. I will clean up the photo for you.'
  },
  { who: 'artisan', text: '(taps the camera button)' },
  { who: 'system', text: 'Cleaning up your photo… → before/after slider shown' },
  { who: 'assistant', text: 'Do you like it? Say yes, or take it again.' }],

  fallback: 'Take again · Add another · Keep this photo — all tappable'
},
{
  id: '2',
  step: 'Step 2',
  title: 'Describe',
  Icon: MicIcon,
  turns: [
  { who: 'assistant', text: 'Tell me about what you made, in your own words.' },
  {
    who: 'artisan',
    text: '“लाल और सुनहरी हाथ से बुनी सूती साड़ी, नौ दिन में बनी।”'
  },
  { who: 'system', text: 'Writing your listing… → 3 lines generated' },
  {
    who: 'assistant',
    text: 'I heard: hand-woven cotton saree, red and gold. Shall I read what I wrote?'
  }],

  fallback: 'Play it back · tap any single line to re-record just that line'
},
{
  id: '3',
  step: 'Step 3',
  title: 'Price',
  Icon: Volume2Icon,
  turns: [
  {
    who: 'assistant',
    text: 'A fair price is one thousand eight hundred rupees, based on similar handwoven sarees nearby.'
  },
  { who: 'artisan', text: '“Why so much?”' },
  {
    who: 'assistant',
    text: 'Eleven sarees like yours sold between fifteen hundred and twenty-two hundred this month.'
  }],

  fallback: '+ / − ₹100 steppers · “Explain this price to me”'
},
{
  id: '4',
  step: 'Step 4',
  title: 'Confirm and publish',
  Icon: CheckIcon,
  turns: [
  {
    who: 'assistant',
    text: 'I heard: hand-woven cotton saree, red and gold. Price suggestion ₹1,800. Should I publish this?'
  },
  { who: 'artisan', text: '“हाँ” / (taps Yes)' },
  { who: 'system', text: 'Published → “Your product is live!”' }],

  fallback: 'Large Yes / No buttons appear with the spoken question'
}];


const errorBranch: Turn[] = [
{ who: 'system', text: 'Speech not understood (noise, dialect, or silence)' },
{
  who: 'assistant',
  text: 'I did not catch that. It may be noisy where you are. We can try again, or you can tap to choose words instead.'
},
{ who: 'artisan', text: '(chooses “Let me speak again”)' },
{ who: 'assistant', text: 'Listening…' },
{
  who: 'system',
  text: 'Second failure → offer tap-to-choose word chips, never a raw error'
}];


const whoStyle = {
  assistant: {
    label: 'Assistant says',
    className: 'border-clay-200 bg-clay-50 text-ink-900'
  },
  artisan: {
    label: 'Artisan says',
    className: 'border-ink-200 bg-white text-ink-900'
  },
  system: {
    label: 'System / AI',
    className: 'border-sand-400 bg-sand-200 text-ink-700'
  }
};

export function VoiceFlow() {
  return (
    <div className="min-h-full w-full overflow-y-auto bg-sand-200 paper-grain font-sans">
      <div className="mx-auto max-w-[1180px] px-6 py-10">
        <Link
          to="/artisan/add"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-600 hover:text-ink-900">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to the add-product flow
        </Link>
        <h1 className="mt-3 text-[34px] font-bold leading-tight text-ink-900">
          Add product — voice interaction flow
        </h1>
        <p className="mt-1 max-w-[680px] text-[15px] leading-7 text-ink-600">
          End to end, with the error-recovery branch. Every spoken turn has a
          visible, tappable equivalent — voice-first, never voice-only.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <ol className="space-y-4">
            {mainPath.map((node, i) =>
            <li key={node.id}>
                <article className="rounded-card border border-sand-300 bg-white p-5 shadow-card">
                  <header className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white">
                      <node.Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-clay-600">
                        {node.step}
                      </p>
                      <h2 className="text-[18px] font-bold leading-tight text-ink-900">
                        {node.title}
                      </h2>
                    </div>
                  </header>

                  <ul className="mt-4 space-y-2">
                    {node.turns.map((turn, idx) =>
                  <li
                    key={idx}
                    className={
                    'rounded-xl border px-3.5 py-2.5 ' +
                    whoStyle[turn.who].className
                    }>
                    
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
                          {whoStyle[turn.who].label}
                        </p>
                        <p className="mt-0.5 text-[14px] leading-6">{turn.text}</p>
                      </li>
                  )}
                  </ul>

                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-leaf-50 px-3 py-2.5 text-[12px] font-semibold leading-5 text-leaf-700">
                    <HandIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Visible fallback: {node.fallback}
                  </p>

                  {node.id === '2' &&
                <p className="mt-3 flex items-center gap-2 text-[12px] font-bold text-gold-700">
                      <RotateCcwIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      If speech fails here → error-recovery branch (right)
                    </p>
                }
                </article>

                {i < mainPath.length - 1 &&
              <div className="flex justify-center py-1.5" aria-hidden="true">
                    <ArrowRightIcon className="h-5 w-5 rotate-90 text-ink-400" />
                  </div>
              }
              </li>
            )}

            <li>
              <div className="rounded-card border-2 border-leaf-500 bg-leaf-50 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-leaf-700">
                  Success
                </p>
                <h2 className="mt-1 text-[18px] font-bold text-ink-900">
                  “Your product is live!”
                </h2>
                <p className="mt-1 text-[14px] leading-6 text-ink-700">
                  Spoken plus a full-screen confirmation, then one obvious next
                  action: share on WhatsApp, or add another product.
                </p>
              </div>
            </li>
          </ol>

          <aside className="lg:sticky lg:top-10 lg:self-start">
            <div className="rounded-card border-2 border-dashed border-gold-500 bg-gold-50 p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold-700">
                Error-recovery branch
              </p>
              <h2 className="mt-1 text-[18px] font-bold leading-tight text-ink-900">
                When speech isn’t understood
              </h2>
              <ol className="mt-4 space-y-2">
                {errorBranch.map((turn, i) =>
                <li
                  key={i}
                  className={
                  'rounded-xl border px-3.5 py-2.5 ' + whoStyle[turn.who].className
                  }>
                  
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
                      {whoStyle[turn.who].label}
                    </p>
                    <p className="mt-0.5 text-[13px] leading-5">{turn.text}</p>
                  </li>
                )}
              </ol>
              <p className="mt-4 text-[12px] leading-5 text-gold-700">
                The branch always rejoins step 2 with the artisan’s progress
                intact. No dead ends, no technical error text, no silent
                failure.
              </p>
            </div>

            <div className="mt-4 rounded-card border border-sand-300 bg-white p-5">
              <h3 className="text-[14px] font-bold text-ink-900">
                Rules applied at every turn
              </h3>
              <ul className="mt-2 space-y-2 text-[12px] leading-5 text-ink-600">
                {[
                'Ambient prompt plays once per screen visit, never repeatedly',
                'Assistant reads back anything irreversible before it happens',
                'Yes / No appear as large buttons at the same moment they are spoken',
                '“Help me” on every screen re-explains the current step',
                'Any AI output can be redone: retake, re-record one line, adjust price'].
                map((rule) =>
                <li key={rule} className="flex gap-2">
                    <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf-500" aria-hidden="true" />
                    {rule}
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>);

}