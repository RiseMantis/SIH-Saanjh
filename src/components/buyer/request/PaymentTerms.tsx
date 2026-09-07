import React from 'react';
import {
  ArrowRightIcon,
  BanknoteIcon,
  BuildingIcon,
  DownloadIcon,
  LeafIcon,
  UsersIcon } from
'lucide-react';
import type { MatchResult } from '../../../types';
import type { RequestSpec } from './RequestForm';
import { useApp } from '../../../contexts/AppContext';

interface PaymentTermsProps {
  spec: RequestSpec;
  match: MatchResult;
  onConfirm: () => void;
}

export function PaymentTerms({ spec, match, onConfirm }: PaymentTermsProps) {
  const { buyerAccountType } = useApp();
  const total = spec.quantity * match.unitPrice;

  return (
    <div className="px-4 pt-4">
      <section className="rounded-card border border-sand-300 bg-white p-4 shadow-card">
        <h2 className="text-[15px] font-bold text-ink-900">Order summary</h2>
        <dl className="mt-2.5 space-y-1.5 text-[13px]">
          <Row label="Made by" value={match.name} />
          <Row label="Quantity" value={`${spec.quantity} units`} />
          <Row label="Per unit" value={`₹${match.unitPrice}`} />
          <Row label="Delivery" value={`${match.deliveryDays} days to ${spec.location}`} />
        </dl>
        <div className="mt-3 flex items-baseline justify-between border-t border-sand-200 pt-3">
          <span className="text-[13px] font-semibold text-ink-600">
            Order value
          </span>
          <span className="text-xl font-bold text-ink-900">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </section>

      <section
        className="mt-4 overflow-hidden rounded-card border-2 border-ink-900 bg-ink-900 text-white"
        aria-labelledby="terms-heading">
        
        <div className="px-4 pt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-clay-300">
            Payment terms
          </p>
          <h2 id="terms-heading" className="mt-1 text-[19px] font-bold leading-tight">
            You pay in 30–60 days, as usual. The artisan gets paid immediately.
          </h2>
          <p className="mt-2 text-[13px] leading-6 text-ink-100">
            Our financing partner settles the invoice on day one and collects
            from you on your normal terms. No change to your payables process.
          </p>
        </div>

        <ol className="mt-4 space-y-0 bg-white/5 px-4 py-4">
          <TermStep
            Icon={UsersIcon}
            day="Day 0"
            title="Artisans start work"
            body={`${match.name} accepts and begins production.`} />
          
          <TermStep
            Icon={BanknoteIcon}
            day="Day 1"
            title="Artisan is paid in full"
            body={`₹${total.toLocaleString('en-IN')} released by the financing partner — not held until you pay.`}
            accent />
          
          <TermStep
            Icon={BuildingIcon}
            day="Day 30–60"
            title="You settle the invoice"
            body="Standard corporate terms, one consolidated invoice with GST."
            last />
          
        </ol>

        <div className="px-4 pb-4">
          <p className="rounded-xl bg-white/10 px-3 py-2.5 text-[12px] leading-5 text-ink-100">
            Financing cost is already inside the ₹{match.unitPrice} unit price.
            There is no separate fee on your side.
          </p>
        </div>
      </section>

      {buyerAccountType === 'business' &&
      <section className="mt-4 rounded-card border border-leaf-100 bg-leaf-50 p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-500 text-white">
              <LeafIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-ink-900">
                Sourcing impact report
              </h2>
              <p className="mt-0.5 text-[12px] text-leaf-700">
                Included with your business tier
              </p>
            </div>
          </div>
          <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-white p-3 text-center">
            <Impact label="Artisans supported" value={String(match.members?.length ?? 1)} />
            <Impact label="Regions" value="1" />
            <Impact label="Women-led" value="50%" />
          </dl>
          <button
          type="button"
          className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-leaf-500 bg-white text-[13px] font-semibold text-leaf-700 transition-colors duration-150 ease-out hover:bg-leaf-50">
          
            <DownloadIcon className="h-4 w-4" aria-hidden="true" />
            Download ESG report (PDF)
          </button>
        </section>
      }

      <button
        type="button"
        onClick={onConfirm}
        className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
        
        Confirm order
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>);

}

function Row({ label, value }: {label: string;value: string;}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-right font-semibold text-ink-900">{value}</dd>
    </div>);

}

function Impact({ label, value }: {label: string;value: string;}) {
  return (
    <div>
      <dt className="text-[10px] uppercase leading-tight tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="text-base font-bold text-ink-900">{value}</dd>
    </div>);

}

function TermStep({
  Icon,
  day,
  title,
  body,
  accent = false,
  last = false







}: {Icon: typeof BanknoteIcon;day: string;title: string;body: string;accent?: boolean;last?: boolean;}) {
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full ' + (
          accent ? 'bg-clay-500 text-white' : 'bg-white/15 text-white')
          }>
          
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        {!last && <span className="my-1 w-0.5 flex-1 bg-white/20" aria-hidden="true" />}
      </div>
      <div className={last ? 'pb-0' : 'pb-4'}>
        <p className="text-[11px] font-bold uppercase tracking-wide text-clay-300">
          {day}
        </p>
        <p className="text-[14px] font-bold leading-snug">{title}</p>
        <p className="mt-0.5 text-[12px] leading-5 text-ink-100">{body}</p>
      </div>
    </li>);

}