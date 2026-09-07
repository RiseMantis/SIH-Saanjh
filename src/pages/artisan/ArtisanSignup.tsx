import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BadgeCheckIcon,
  PhoneIcon,
  ShieldCheckIcon,
  Volume2Icon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAmbientPrompt } from '../../hooks/useAmbientPrompt';
import { MicButton } from '../../components/shared/MicButton';
import { VoiceCaption } from '../../components/shared/VoiceCaption';

type Step = 'phone' | 'otp' | 'digilocker';

const stepPrompt: Record<Step, string> = {
  phone: 'Tell me your phone number, or type it here. I will read each number back to you.',
  otp: 'I sent you a six digit code by message. Say the numbers out loud, or type them.',
  digilocker:
  'This helps us verify you instead of asking for paper documents. You can say no and still sell.'
};

export function ArtisanSignup() {
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [listening, setListening] = useState(false);
  const { speak } = useApp();
  const navigate = useNavigate();
  useAmbientPrompt(stepPrompt.phone);

  const goTo = (next: Step) => {
    setStep(next);
    speak(stepPrompt[next]);
  };

  const dictate = () => {
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);
    speak('Listening…');
    window.setTimeout(() => {
      setListening(false);
      if (step === 'phone') {
        setPhone('98765 43210');
        speak('I heard nine eight seven six five, four three two one zero. Is that right?');
      } else {
        setOtp('418302');
        speak('I heard four one eight three zero two. Checking it now.');
      }
    }, 1900);
  };

  return (
    <div className="relative flex h-full flex-col bg-sand-100 font-sans">
      <header className="flex items-center gap-3 border-b border-sand-300 bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => step === 'phone' ? navigate('/language') : goTo('phone')}
          aria-label="Go back"
          className="flex h-[56px] w-[56px] items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          
          <ArrowLeftIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-[22px] font-bold leading-tight text-ink-900">
            {step === 'digilocker' ? 'Verify yourself' : 'Your phone number'}
          </h1>
          <p className="text-base text-ink-600">
            Step {step === 'phone' ? 2 : step === 'otp' ? 2 : 3} of 3
          </p>
        </div>
      </header>

      <div className="screen-scroll flex-1 px-5 py-6">
        {step !== 'digilocker' &&
        <>
            <label
            htmlFor="signup-field"
            className="block text-artisan-label font-bold leading-8 text-ink-900">
            
              {step === 'phone' ?
            'What is your phone number?' :
            'Type the six numbers we sent you'}
            </label>
            <p className="mt-2 text-artisan-body text-ink-600">
              {step === 'phone' ?
            'Only this one thing on this screen. Nothing else is needed yet.' :
            'Sent by message to +91 98765 43210.'}
            </p>

            <input
            id="signup-field"
            inputMode="numeric"
            value={step === 'phone' ? phone : otp}
            onChange={(e) =>
            step === 'phone' ? setPhone(e.target.value) : setOtp(e.target.value)
            }
            placeholder={step === 'phone' ? '98765 43210' : '4 1 8 3 0 2'}
            className="mt-5 h-[76px] w-full rounded-card border-2 border-sand-400 bg-white px-4 text-[28px] font-bold tracking-wide text-ink-900 placeholder:text-ink-300 focus:border-clay-500 focus:outline-none" />
          

            <div className="mt-6 flex flex-col items-center gap-3">
              <MicButton
              listening={listening}
              onToggle={dictate}
              size="md"
              label="Say it instead of typing" />
            
              <p className="text-artisan-body font-semibold text-ink-800">
                Or press and say the numbers
              </p>
            </div>
          </>
        }

        {step === 'digilocker' &&
        <div className="space-y-5">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-ink-900 text-white">
              <ShieldCheckIcon className="h-12 w-12" aria-hidden="true" />
            </span>
            <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
              May we check your ID from DigiLocker?
            </h2>
            <p className="text-artisan-body leading-7 text-ink-700">
              This helps us verify you instead of asking for paper documents.
              Buyers trust verified sellers more, so you get better orders.
            </p>
            <button
            type="button"
            onClick={() => speak(stepPrompt.digilocker)}
            className="inline-flex min-h-[56px] items-center gap-2 rounded-full border-2 border-ink-900 px-5 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
            
              <Volume2Icon className="h-6 w-6" aria-hidden="true" />
              Explain this to me
            </button>
            <div className="flex items-start gap-3 rounded-card border border-leaf-100 bg-leaf-50 p-4">
              <BadgeCheckIcon
              className="mt-0.5 h-6 w-6 shrink-0 text-leaf-600"
              aria-hidden="true" />
            
              <p className="text-base leading-6 text-leaf-700">
                You can say no and still sell. You can add this later from your
                account.
              </p>
            </div>
          </div>
        }
      </div>

      <div className="space-y-2 border-t border-sand-300 bg-white p-4">
        {step === 'phone' &&
        <PrimaryButton
          onClick={() => goTo('otp')}
          disabled={phone.length < 5}
          label="Send me the code"
          Icon={PhoneIcon} />

        }
        {step === 'otp' &&
        <PrimaryButton
          onClick={() => goTo('digilocker')}
          disabled={otp.length < 4}
          label="Check the code" />

        }
        {step === 'digilocker' &&
        <>
            <PrimaryButton
            onClick={() => {
              speak('You are all set. This is your home.');
              navigate('/artisan/home');
            }}
            label="Yes, verify me" />
          
            <button
            type="button"
            onClick={() => navigate('/artisan/home')}
            className="min-h-[56px] w-full rounded-full text-lg font-bold text-ink-700 transition-colors duration-150 ease-out hover:bg-sand-100">
            
              Not now
            </button>
          </>
        }
      </div>
      <VoiceCaption offset="none" />
    </div>);

}

function PrimaryButton({
  onClick,
  label,
  disabled = false,
  Icon





}: {onClick: () => void;label: string;disabled?: boolean;Icon?: typeof PhoneIcon;}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600 disabled:bg-sand-300 disabled:text-ink-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300">
      
      {Icon && <Icon className="h-6 w-6" aria-hidden="true" />}
      {label}
      {!Icon && <ArrowRightIcon className="h-6 w-6" aria-hidden="true" />}
    </button>);

}