import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  ChromeIcon,
  MailIcon,
  UserIcon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { VoiceCaption } from '../../components/shared/VoiceCaption';

export function BuyerSignup() {
  const [stage, setStage] = useState<'auth' | 'type'>('auth');
  const { buyerAccountType, setBuyerAccountType } = useApp();
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto flex h-full max-w-xl flex-col bg-sand-100 font-sans lg:py-6">
      <header className="flex items-center gap-2 border-b border-sand-300 bg-white px-3 py-3">
        <button
          type="button"
          onClick={() => stage === 'auth' ? navigate('/language') : setStage('auth')}
          aria-label="Go back"
          className="flex h-12 w-12 items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-lg font-bold leading-tight text-ink-900">
            {stage === 'auth' ? 'Create your account' : 'How will you buy?'}
          </h1>
          <p className="text-xs text-ink-500">Step {stage === 'auth' ? 2 : 3} of 3</p>
        </div>
      </header>

      <div className="screen-scroll flex-1 px-5 py-6">
        {stage === 'auth' ?
        <>
            <label
            htmlFor="buyer-phone"
            className="block text-sm font-semibold text-ink-800">
            
              Phone number
            </label>
            <input
            id="buyer-phone"
            inputMode="tel"
            placeholder="+91 98765 43210"
            className="mt-1.5 h-12 w-full rounded-xl border border-sand-400 bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-300 focus:border-clay-500 focus:outline-none" />
          
            <label
            htmlFor="buyer-email"
            className="mt-4 block text-sm font-semibold text-ink-800">
            
              Work email <span className="font-normal text-ink-400">(optional)</span>
            </label>
            <input
            id="buyer-email"
            type="email"
            placeholder="you@company.com"
            className="mt-1.5 h-12 w-full rounded-xl border border-sand-400 bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-300 focus:border-clay-500 focus:outline-none" />
          

            <button
            type="button"
            onClick={() => setStage('type')}
            className="mt-6 min-h-[48px] w-full rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
            
              Continue
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-sand-300" />
              <span className="text-xs text-ink-400">or</span>
              <span className="h-px flex-1 bg-sand-300" />
            </div>

            <div className="space-y-2.5">
              <SocialButton Icon={ChromeIcon} label="Continue with Google" />
              <SocialButton Icon={MailIcon} label="Continue with email link" />
            </div>
          </> :

        <>
            <p className="text-sm leading-6 text-ink-600">
              This decides what you see. You can change it any time in your
              account.
            </p>
            <div className="mt-4 space-y-3">
              <TypeCard
              Icon={UserIcon}
              title="For myself"
              body="Browse the feed, order single pieces, message artisans directly."
              active={buyerAccountType === 'individual'}
              onSelect={() => setBuyerAccountType('individual')} />
            
              <TypeCard
              Icon={BriefcaseIcon}
              title="For a business"
              body="Adds bulk requests, artisan clusters, invoice financing terms and ESG sourcing reports."
              active={buyerAccountType === 'business'}
              onSelect={() => setBuyerAccountType('business')} />
            
            </div>
            <button
            type="button"
            onClick={() => navigate('/buyer/discover')}
            className="mt-6 min-h-[48px] w-full rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
            
              Start browsing
            </button>
          </>
        }
      </div>
      <VoiceCaption offset="none" />
    </div>);

}

function SocialButton({
  Icon,
  label



}: {Icon: typeof MailIcon;label: string;}) {
  return (
    <button
      type="button"
      className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-ink-200 bg-white text-[15px] font-semibold text-ink-800 transition-colors duration-150 ease-out hover:bg-sand-100">
      
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>);

}

function TypeCard({
  Icon,
  title,
  body,
  active,
  onSelect






}: {Icon: typeof UserIcon;title: string;body: string;active: boolean;onSelect: () => void;}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={
      'flex w-full items-start gap-3 rounded-card border-2 bg-white p-4 text-left transition-[border-color] duration-150 ease-out ' + (
      active ? 'border-clay-500' : 'border-sand-300 hover:border-clay-300')
      }>
      
      <span
        className={
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ' + (
        active ? 'bg-clay-500 text-white' : 'bg-sand-200 text-ink-600')
        }>
        
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-bold text-ink-900">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-5 text-ink-600">
          {body}
        </span>
      </span>
    </button>);

}