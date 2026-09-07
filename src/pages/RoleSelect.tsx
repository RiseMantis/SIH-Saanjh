import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ShoppingBasketIcon, Volume2Icon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAmbientPrompt } from '../hooks/useAmbientPrompt';
import { VoiceCaption } from '../components/shared/VoiceCaption';
import { images } from '../data/artisans';

const greeting = 'Welcome! Are you here to sell your craft, or to buy?';

export function RoleSelect() {
  const { setMode, speak } = useApp();
  useAmbientPrompt(greeting);

  return (
    <div className="relative flex h-full flex-col bg-sand-100 font-sans">
      <div className="screen-scroll flex-1">
        <header className="relative overflow-hidden bg-ink-900 px-6 pb-8 pt-10 text-white">
          <div className="absolute inset-0 opacity-25" aria-hidden="true">
            <img
              src={images.pottery}
              alt=""
              className="h-full w-full object-cover" />
            
          </div>
          <div className="relative">
            <p className="font-deva text-lg text-clay-300">नमस्ते · Welcome</p>
            <h1 className="mt-2 text-[32px] font-bold leading-[1.15]">
              Saanjh
            </h1>
            <p className="mt-2 max-w-[280px] text-lg leading-7 text-ink-100">
              A market for handmade things, spoken in your language.
            </p>
            <button
              type="button"
              onClick={() => speak(greeting)}
              className="mt-5 inline-flex min-h-[56px] items-center gap-2 rounded-full bg-white/10 px-5 text-lg font-semibold text-white transition-colors duration-150 ease-out hover:bg-white/20">
              
              <Volume2Icon className="h-6 w-6" aria-hidden="true" />
              Hear this again
            </button>
          </div>
        </header>

        <div className="space-y-4 px-5 py-6">
          <h2 className="text-artisan-label font-bold text-ink-900">
            What brings you here?
          </h2>

          <RoleCard
            to="/language"
            onSelect={() => setMode('artisan')}
            title="I make and sell crafts"
            subtitle="List what you made by speaking. No typing needed."
            image={images.artisanWoman}
            emphasis />
          

          <RoleCard
            to="/language"
            onSelect={() => setMode('buyer')}
            title="I want to buy crafts"
            subtitle="Browse, search and order directly from artisans."
            icon={<ShoppingBasketIcon className="h-12 w-12" aria-hidden="true" />} />
          

          <p className="pt-2 text-center text-base leading-6 text-ink-500">
            You can switch between selling and buying later from your account.
          </p>
        </div>
      </div>
      <VoiceCaption offset="none" />
    </div>);

}

interface RoleCardProps {
  to: string;
  onSelect: () => void;
  title: string;
  subtitle: string;
  image?: string;
  icon?: React.ReactNode;
  emphasis?: boolean;
}

function RoleCard({
  to,
  onSelect,
  title,
  subtitle,
  image,
  icon,
  emphasis = false
}: RoleCardProps) {
  return (
    <Link
      to={to}
      onClick={onSelect}
      className={
      'flex min-h-[132px] items-center gap-4 rounded-card border-2 bg-white p-4 text-left shadow-card transition-[border-color,transform] duration-150 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' + (
      emphasis ?
      'border-clay-500 hover:border-clay-600' :
      'border-sand-300 hover:border-clay-300')
      }>
      
      {image ?
      <img
        src={image}
        alt=""
        className="h-24 w-24 shrink-0 rounded-2xl object-cover" /> :


      <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-clay-50 text-clay-600">
          {icon}
        </span>
      }
      <span className="min-w-0 flex-1">
        <span className="block text-[22px] font-bold leading-7 text-ink-900">
          {title}
        </span>
        <span className="mt-1 block text-base leading-6 text-ink-600">
          {subtitle}
        </span>
      </span>
      <ChevronRightIcon
        className="h-8 w-8 shrink-0 text-ink-300"
        aria-hidden="true" />
      
    </Link>);

}