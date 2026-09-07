import React from 'react';
import { Link } from 'react-router-dom';
import {
  CameraIcon,
  ChevronRightIcon,
  MegaphoneIcon,
  PackageIcon,
  ShieldCheckIcon,
  Volume2Icon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAmbientPrompt } from '../../hooks/useAmbientPrompt';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { currentArtisan } from '../../data/artisans';
import { artisanOrders } from '../../data/orders';
import { notifications } from '../../data/notifications';

export function ArtisanHome() {
  const { speak } = useApp();
  const ongoing = artisanOrders.filter(
    (o) => o.status === 'ordered' || o.status === 'being-made'
  ).length;
  const scheme = notifications[0];

  const greeting = `Namaste, ${currentArtisan.name.split(' ')[0]}. You have ${ongoing} orders being made. This is your home. Say 'add new product' to list something, or 'my orders' to check on your sales.`;
  useAmbientPrompt(greeting);

  return (
    <div className="px-4 pb-40 pt-4">
      <section className="rounded-card bg-ink-900 p-4 text-white">
        <div className="flex items-center gap-3">
          <img
            src={currentArtisan.photo}
            alt=""
            className="h-14 w-14 rounded-full object-cover" />
          
          <div className="min-w-0 flex-1">
            <p className="font-deva text-[22px] font-bold leading-7">
              नमस्ते, {currentArtisan.name.split(' ')[0]}
            </p>
            <p className="text-base text-ink-100">
              You have {ongoing} orders to make.
            </p>
          </div>
          <button
            type="button"
            onClick={() => speak(greeting)}
            aria-label="Hear this greeting"
            className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-150 ease-out hover:bg-white/20">
            
            <Volume2Icon className="h-7 w-7" aria-hidden="true" />
          </button>
        </div>
      </section>

      <Link
        to="/artisan/add"
        className="mt-4 flex min-h-[228px] flex-col items-center justify-center gap-3 rounded-sheet bg-clay-500 px-6 py-8 text-center text-white shadow-lift transition-[background-color,transform] duration-150 ease-out active:scale-[0.99] hover:bg-clay-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300">
        
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
          <CameraIcon className="h-14 w-14" aria-hidden="true" />
        </span>
        <span className="text-[30px] font-bold leading-9">
          Add a new product
        </span>
        <span className="text-lg leading-6 text-clay-50">
          Take one photo and tell me about it
        </span>
      </Link>

      <h2 className="mt-6 text-artisan-label font-bold text-ink-900">
        Your day
      </h2>

      <div className="mt-3 space-y-3">
        <SummaryCard
          to="/artisan/orders"
          tone="amber"
          Icon={PackageIcon}
          label="Orders being made"
          value={`${ongoing} orders`}
          hint="2 to send this week" />
        

        <div className="flex items-center gap-4 rounded-card border border-sand-300 bg-white p-4 shadow-card">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-leaf-500 text-white">
            <ShieldCheckIcon className="h-8 w-8" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-artisan-body font-bold text-ink-900">
              Your trust score
            </p>
            <TrustBadge
              score={currentArtisan.trustScore}
              variant="stars"
              size="lg"
              showLabel />
            
          </div>
        </div>

        <Link
          to={`/artisan/notification/${scheme.id}`}
          className="flex items-center gap-4 rounded-card border-2 border-gold-100 bg-gold-50 p-4 transition-[border-color,transform] duration-150 ease-out active:scale-[0.99] hover:border-gold-500">
          
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-white">
            <MegaphoneIcon className="h-8 w-8" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-artisan-body font-bold leading-6 text-ink-900">
              {scheme.headline}
            </p>
            <p className="mt-0.5 text-base font-semibold text-gold-700">
              Tap to hear it
            </p>
          </div>
          <ChevronRightIcon
            className="h-7 w-7 shrink-0 text-gold-700"
            aria-hidden="true" />
          
        </Link>
      </div>
    </div>);

}

function SummaryCard({
  to,
  tone,
  Icon,
  label,
  value,
  hint







}: {to: string;tone: 'amber' | 'leaf';Icon: typeof PackageIcon;label: string;value: string;hint: string;}) {
  const tones = {
    amber: 'bg-gold-500 text-white',
    leaf: 'bg-leaf-500 text-white'
  };
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-card border border-sand-300 bg-white p-4 shadow-card transition-[border-color,transform] duration-150 ease-out active:scale-[0.99] hover:border-clay-300">
      
      <span
        className={
        'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ' +
        tones[tone]
        }>
        
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-artisan-body font-bold text-ink-900">{label}</p>
        <p className="text-2xl font-bold leading-8 text-ink-900">{value}</p>
        <p className="text-base text-ink-600">{hint}</p>
      </div>
      <ChevronRightIcon
        className="h-7 w-7 shrink-0 text-ink-300"
        aria-hidden="true" />
      
    </Link>);

}