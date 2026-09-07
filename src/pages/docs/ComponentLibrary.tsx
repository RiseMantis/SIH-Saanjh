import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CameraIcon,
  CheckCircle2Icon,
  ClockIcon,
  CloudOffIcon,
  IndianRupeeIcon,
  MicIcon,
  PackageIcon,
  SearchIcon } from
'lucide-react';
import { AppProvider } from '../../contexts/AppContext';
import { TrustBadge } from '../../components/shared/TrustBadge';
import { StatusChip } from '../../components/shared/StatusChip';
import { MicButton } from '../../components/shared/MicButton';
import { OrderTracker } from '../../components/shared/OrderTracker';
import { OrderCard } from '../../components/shared/OrderCard';
import { ProductCard } from '../../components/shared/ProductCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { LanguageGrid } from '../../components/shared/LanguageGrid';
import { AIProgress } from '../../components/shared/AIProgress';
import { artisanOrders, buyerOrders } from '../../data/orders';
import { products } from '../../data/products';

const swatches = [
{ name: 'Primary — Terracotta', hex: '#D9622B', className: 'bg-clay-500', use: 'CTAs, active states, highlights' },
{ name: 'Secondary — Deep indigo', hex: '#12203C', className: 'bg-ink-900', use: 'Headers, nav, trust and KYC' },
{ name: 'Success — Leaf', hex: '#1F7A3D', className: 'bg-leaf-500', use: 'Completed, paid, verified' },
{ name: 'Warning — Amber', hex: '#E8A93B', className: 'bg-gold-500', use: 'Pending, needs attention' },
{ name: 'Error — Muted red', hex: '#C1442D', className: 'bg-chili-500', use: 'Failed, rejected, offline error' },
{ name: 'Canvas — Warm off-white', hex: '#F7F5F1', className: 'bg-sand-100 border border-sand-400', use: 'App background' },
{ name: 'Surface — White', hex: '#FFFFFF', className: 'bg-white border border-sand-400', use: 'Cards' }];


const typeScale = [
{ label: 'Artisan primary label / button', size: '24–28px', className: 'text-artisan-label font-bold' },
{ label: 'Artisan body', size: '18–20px', className: 'text-artisan-body' },
{ label: 'Buyer heading', size: '17–20px', className: 'text-lg font-bold' },
{ label: 'Buyer body', size: '14–16px', className: 'text-[14px]' },
{ label: 'Buyer meta', size: '11–12px', className: 'text-[11px] text-ink-500' }];


export function ComponentLibrary() {
  return (
    <AppProvider>
      <div className="min-h-full w-full overflow-y-auto bg-sand-200 paper-grain font-sans">
        <div className="mx-auto max-w-[1180px] px-6 py-10">
          <Link
            to="/artisan/home"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-600 hover:text-ink-900">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back to the app
          </Link>
          <h1 className="mt-3 text-[34px] font-bold leading-tight text-ink-900">
            Component library
          </h1>
          <p className="mt-1 max-w-[620px] text-[15px] leading-7 text-ink-600">
            One token set, one component set. Each component ships two density
            variants — artisan (56dp targets, 18–28px type, always labelled) and
            buyer (48dp targets, standard density).
          </p>

          <Section title="Colour" caption="AA minimum everywhere, AAA in artisan mode.">
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {swatches.map((s) =>
              <li
                key={s.hex}
                className="overflow-hidden rounded-card border border-sand-300 bg-white">
                
                  <div className={'h-16 w-full ' + s.className} />
                  <div className="p-3">
                    <p className="text-[13px] font-bold text-ink-900">{s.name}</p>
                    <p className="font-mono text-[11px] text-ink-500">{s.hex}</p>
                    <p className="mt-1 text-[11px] leading-4 text-ink-600">{s.use}</p>
                  </div>
                </li>
              )}
            </ul>
          </Section>

          <Section
            title="Type scale"
            caption="Noto Sans + Noto Sans Devanagari. Sentence case only — never all-caps labels.">
            
            <ul className="space-y-3 rounded-card border border-sand-300 bg-white p-5">
              {typeScale.map((t) =>
              <li
                key={t.label}
                className="flex flex-wrap items-baseline justify-between gap-3 border-b border-sand-200 pb-3 last:border-0 last:pb-0">
                
                  <span className={t.className + ' text-ink-900'}>
                    हाथ से बुनी साड़ी · Hand-woven saree
                  </span>
                  <span className="text-[12px] text-ink-500">
                    {t.label} · {t.size}
                  </span>
                </li>
              )}
            </ul>
          </Section>

          <Section title="Trust score badge" caption="Identical wherever an artisan is referenced.">
            <DensityPair
              artisan={
              <div className="space-y-4">
                  <TrustBadge score={4.6} variant="stars" size="lg" showLabel />
                  <TrustBadge score={4.6} size="lg" showLabel />
                  <TrustBadge score={3.8} size="lg" showLabel />
                </div>
              }
              buyer={
              <div className="flex flex-wrap items-center gap-3">
                  <TrustBadge score={4.9} />
                  <TrustBadge score={4.1} />
                  <TrustBadge score={3.2} />
                  <TrustBadge score={4.6} variant="stars" />
                </div>
              } />
            
          </Section>

          <Section
            title="Status, never colour alone"
            caption="Every status pairs a colour with an icon and a word.">
            
            <div className="flex flex-wrap items-center gap-3 rounded-card border border-sand-300 bg-white p-5">
              <StatusChip status="ordered" size="lg" />
              <StatusChip status="being-made" size="lg" />
              <StatusChip status="shipped" size="lg" />
              <StatusChip status="delivered" size="lg" />
              <StatusChip status="paid" size="lg" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-card border border-sand-300 bg-white p-5">
              <StatusChip status="ordered" />
              <StatusChip status="being-made" />
              <StatusChip status="shipped" />
              <StatusChip status="delivered" />
              <StatusChip status="paid" />
            </div>
          </Section>

          <Section title="Order card" caption="Simple (artisan) and rich (buyer) variants of one component.">
            <DensityPair
              artisan={
              <OrderCard order={artisanOrders[1]} density="artisan" to="/artisan/orders/ao2" />
              }
              buyer={
              <div className="space-y-3">
                  <OrderCard order={buyerOrders[0]} density="buyer" to="/buyer/orders/bo1" />
                  <OrderCard order={buyerOrders[2]} density="buyer" to="/buyer/orders/bo3" />
                </div>
              } />
            
          </Section>

          <Section title="Product card" caption="Feed and grid density for buyer surfaces.">
            <div className="grid gap-4 md:grid-cols-[1fr_320px]">
              <div className="max-w-[380px]">
                <ProductCard product={products[0]} variant="feed" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <ProductCard product={products[5]} variant="grid" />
                <ProductCard product={products[6]} variant="grid" />
              </div>
            </div>
          </Section>

          <Section title="Order status tracker" caption="Vertical icon stepper for artisans, horizontal for buyers.">
            <DensityPair
              artisan={<OrderTracker status="being-made" orientation="vertical" />}
              buyer={
              <div className="pt-2">
                  <OrderTracker status="shipped" orientation="horizontal" />
                </div>
              } />
            
          </Section>

          <Section title="Voice mic button" caption="One component, two states — idle pulse and listening waveform.">
            <MicDemo />
          </Section>

          <Section title="Language switcher" caption="Script-first grid, reused in onboarding and settings.">
            <DensityPair
              artisan={<LanguageGridDemo density="artisan" />}
              buyer={<LanguageGridDemo density="buyer" />} />
            
          </Section>

          <Section title="Empty, loading and error states" caption="Designed for every list — friendly and spoken for artisans, compact for buyers.">
            <DensityPair
              artisan={
              <div className="space-y-4">
                  <EmptyState
                  Icon={PackageIcon}
                  density="artisan"
                  title="No orders here yet"
                  body="When someone buys your work, it will show up here."
                  spoken="You have no orders yet." />
                
                  <AIProgress message="Finding a fair price…" durationMs={100000} />
                  <div className="flex items-start gap-3 rounded-card border-2 border-chili-100 bg-chili-50 p-4">
                    <CloudOffIcon className="mt-0.5 h-6 w-6 shrink-0 text-chili-600" aria-hidden="true" />
                    <p className="text-artisan-body font-semibold leading-6 text-chili-600">
                      No internet — nothing is lost. We’ll upload this when
                      you’re back online.
                    </p>
                  </div>
                </div>
              }
              buyer={
              <div className="space-y-3">
                  <EmptyState
                  Icon={SearchIcon}
                  title="Nothing matches those filters"
                  body="Try widening the price range." />
                
                  <div className="space-y-2 rounded-card border border-sand-300 bg-white p-4">
                    <div className="h-3 w-2/3 animate-pulse rounded-full bg-sand-200" />
                    <div className="h-3 w-1/2 animate-pulse rounded-full bg-sand-200" />
                    <div className="h-24 w-full animate-pulse rounded-xl bg-sand-200" />
                  </div>
                  <p className="flex items-center gap-2 rounded-card border border-chili-100 bg-chili-50 px-3 py-2.5 text-[13px] font-semibold text-chili-600">
                    <CloudOffIcon className="h-4 w-4" aria-hidden="true" />
                    You are offline. Showing your last saved results.
                  </p>
                </div>
              } />
            
          </Section>

          <Section title="Touch targets and icon metaphors" caption="56dp artisan, 48dp buyer. Icons in artisan mode are always labelled.">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-card border border-sand-300 bg-white p-5">
                <p className="text-[12px] font-bold uppercase tracking-wide text-ink-500">
                  Artisan · 56dp minimum, icon + label
                </p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {[
                  { Icon: CameraIcon, label: 'Add photo' },
                  { Icon: MicIcon, label: 'Speak' },
                  { Icon: IndianRupeeIcon, label: 'Price' },
                  { Icon: CheckCircle2Icon, label: 'Done' },
                  { Icon: ClockIcon, label: 'Pending' }].
                  map(({ Icon, label }) =>
                  <li
                    key={label}
                    className="flex min-h-[56px] min-w-[80px] flex-col items-center justify-center gap-1 rounded-2xl bg-sand-100 px-3 py-2">
                    
                      <Icon className="h-7 w-7 text-clay-600" aria-hidden="true" />
                      <span className="text-[13px] font-bold text-ink-900">{label}</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="rounded-card border border-sand-300 bg-white p-5">
                <p className="text-[12px] font-bold uppercase tracking-wide text-ink-500">
                  Buyer · 48dp minimum
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {[CameraIcon, MicIcon, IndianRupeeIcon, CheckCircle2Icon, ClockIcon].map(
                    (Icon, i) =>
                    <li
                      key={i}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand-100">
                      
                        <Icon className="h-5 w-5 text-ink-700" aria-hidden="true" />
                      </li>

                  )}
                </ul>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </AppProvider>);

}

function Section({
  title,
  caption,
  children




}: {title: string;caption: string;children: React.ReactNode;}) {
  return (
    <section className="mt-10">
      <h2 className="text-[20px] font-bold text-ink-900">{title}</h2>
      <p className="mb-4 mt-0.5 text-[13px] text-ink-600">{caption}</p>
      {children}
    </section>);

}

function DensityPair({
  artisan,
  buyer



}: {artisan: React.ReactNode;buyer: React.ReactNode;}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-card border border-clay-200 bg-sand-100 p-5">
        <p className="mb-3 inline-flex rounded-full bg-clay-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Artisan density
        </p>
        {artisan}
      </div>
      <div className="rounded-card border border-sand-300 bg-sand-100 p-5">
        <p className="mb-3 inline-flex rounded-full bg-ink-900 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Buyer density
        </p>
        {buyer}
      </div>
    </div>);

}

function MicDemo() {
  const [listening, setListening] = useState(false);
  return (
    <div className="flex flex-wrap items-end gap-8 rounded-card border border-sand-300 bg-white p-6">
      <div className="flex flex-col items-center gap-2">
        <MicButton listening={listening} onToggle={() => setListening((v) => !v)} size="xl" />
        <p className="text-[12px] text-ink-500">Add-product step (xl)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MicButton listening={listening} onToggle={() => setListening((v) => !v)} size="md" />
        <p className="text-[12px] text-ink-500">Floating assistant (72dp)</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <MicButton listening={listening} onToggle={() => setListening((v) => !v)} size="sm" />
        <p className="text-[12px] text-ink-500">Inside a search field</p>
      </div>
      <p className="text-[12px] text-ink-600">
        Tap any mic to flip between idle pulse and listening waveform.
      </p>
    </div>);

}

function LanguageGridDemo({ density }: {density: 'artisan' | 'buyer';}) {
  const [selected, setSelected] = useState('hi');
  return (
    <div className="max-h-[320px] overflow-y-auto">
      <LanguageGrid selectedId={selected} onSelect={setSelected} density={density} />
    </div>);

}