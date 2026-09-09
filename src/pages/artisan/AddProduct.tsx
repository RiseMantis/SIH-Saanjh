import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAmbientPrompt } from '../../hooks/useAmbientPrompt';
import { StepPhoto } from '../../components/artisan/addProduct/StepPhoto';
import { StepDescribe } from '../../components/artisan/addProduct/StepDescribe';
import { StepPrice } from '../../components/artisan/addProduct/StepPrice';
import { StepConfirm } from '../../components/artisan/addProduct/StepConfirm';
import { StepSuccess } from '../../components/artisan/addProduct/StepSuccess';

const steps = [
{ label: 'Photo', prompt: 'Point your phone at what you made and press the big button. I will clean up the photo for you.' },
{ label: 'Describe', prompt: 'Now tell me about what you made, in your own words.' },
{ label: 'Price', prompt: 'Here is a fair price. Use plus or minus to change it, or ask me why.' },
{ label: 'Publish', prompt: 'This is exactly what buyers will see. I will read it out before you publish.' }];


export function AddProduct() {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const { speak, resetDraft } = useApp();
  const navigate = useNavigate();
  useAmbientPrompt(steps[0].prompt);

  const go = (next: number) => {
    setStep(next);
    speak(steps[next].prompt);
  };

  if (published) {
    return (
      <StepSuccess
        onAddAnother={() => {
          resetDraft();
          setPublished(false);
          go(0);
        }} />);


  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 lg:px-8 lg:py-8">
      <header className="sticky top-0 z-20 border-b border-sand-300 bg-white px-3 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => step === 0 ? navigate('/artisan/home') : go(step - 1)}
            aria-label="Go back one step"
            className="flex h-[56px] w-[56px] items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
            
            <ArrowLeftIcon className="h-7 w-7" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold leading-tight text-ink-900">
              {steps[step].label}
            </h1>
            <p className="text-base text-ink-600">
              Step {step + 1} of {steps.length}
            </p>
          </div>
        </div>
        <ol className="mt-2.5 flex gap-1.5" aria-hidden="true">
          {steps.map((s, i) =>
          <li
            key={s.label}
            className={
            'h-2.5 flex-1 rounded-full ' + (
            i <= step ? 'bg-clay-500' : 'bg-sand-300')
            } />

          )}
        </ol>
      </header>

      {step === 0 && <StepPhoto onNext={() => go(1)} />}
      {step === 1 && <StepDescribe onNext={() => go(2)} />}
      {step === 2 && <StepPrice onNext={() => go(3)} />}
      {step === 3 &&
      <StepConfirm
        onPublish={() => {
          setPublished(true);
          speak('Your product is live! Shall I share it on WhatsApp?');
        }} />

      }
    </div>);

}