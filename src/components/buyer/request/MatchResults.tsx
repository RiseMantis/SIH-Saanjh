import React, { useState } from 'react';
import { BoxesIcon, ClockIcon, UserIcon, UsersIcon } from 'lucide-react';
import { TrustBadge } from '../../shared/TrustBadge';
import { matchResults } from '../../../data/notifications';
import type { MatchResult } from '../../../types';
import type { RequestSpec } from './RequestForm';

interface MatchResultsProps {
  spec: RequestSpec;
  onSelect: (match: MatchResult) => void;
}

export function MatchResults({ spec, onSelect }: MatchResultsProps) {
  const [filter, setFilter] = useState<'all' | 'cluster' | 'artisan'>('all');
  const results = matchResults.filter((m) =>
  filter === 'all' ? true : m.type === filter
  );

  return (
    <div className="px-4 pt-4">
      <div className="rounded-card border border-ink-200 bg-ink-50 p-3">
        <p className="text-[13px] font-semibold text-ink-900">
          {spec.quantity} × {spec.craft.toLowerCase()} · ₹{spec.priceLow}–₹
          {spec.priceHigh} per unit
        </p>
        <p className="mt-0.5 text-[12px] text-ink-600">
          Delivered to {spec.location} by{' '}
          {new Date(spec.deadline).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short'
          })}
        </p>
      </div>

      <ul className="mt-3 flex gap-2" role="tablist" aria-label="Match type">
        {(['all', 'cluster', 'artisan'] as const).map((f) =>
        <li key={f}>
            <button
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={
            'min-h-[36px] rounded-full border px-3.5 text-[13px] font-semibold capitalize transition-colors duration-150 ease-out ' + (
            filter === f ?
            'border-ink-900 bg-ink-900 text-white' :
            'border-sand-400 bg-white text-ink-700 hover:bg-sand-200')
            }>
            
              {f === 'all' ? 'All matches' : f + 's'}
            </button>
          </li>
        )}
      </ul>

      <p className="mt-3 text-[11px] uppercase tracking-wide text-ink-400">
        Ranked by capacity, trust and delivery time
      </p>

      <ul className="mt-2 space-y-3">
        {results.map((match, index) => {
          const shortfall = match.capacity < spec.quantity;
          return (
            <li key={match.id}>
              <article
                className={
                'rounded-card border bg-white p-3.5 shadow-card ' + (
                index === 0 ? 'border-clay-500' : 'border-sand-300')
                }>
                
                {index === 0 &&
                <p className="mb-2 inline-flex rounded-full bg-clay-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Best match
                  </p>
                }
                <div className="flex items-start gap-3">
                  <img
                    src={match.photo}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="flex items-center gap-1.5 text-[15px] font-bold leading-tight text-ink-900">
                        {match.type === 'cluster' ?
                        <UsersIcon className="h-4 w-4 text-ink-600" aria-hidden="true" /> :

                        <UserIcon className="h-4 w-4 text-ink-600" aria-hidden="true" />
                        }
                        {match.name}
                      </p>
                      <span className="rounded-full bg-leaf-100 px-2 py-0.5 text-[11px] font-bold text-leaf-700">
                        {index === 0 ? '98%' : index === 1 ? '88%' : '76%'} Fit
                      </span>
                    </div>
                    <p className="text-xs text-ink-500">{match.location}</p>
                    {match.members &&
                    <p className="mt-1 text-[11px] leading-4 text-ink-600">
                        {match.members.join(' · ')}
                      </p>
                    }
                  </div>
                  <TrustBadge score={match.trustScore} />
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-2 border-y border-sand-200 py-2.5 text-center">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-ink-400">
                      Capacity
                    </dt>
                    <dd
                      className={
                      'text-sm font-bold ' + (
                      shortfall ? 'text-gold-700' : 'text-ink-900')
                      }>
                      
                      {match.capacity} units
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-ink-400">
                      Per unit
                    </dt>
                    <dd className="text-sm font-bold text-ink-900">
                      ₹{match.unitPrice}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-ink-400">
                      Delivery
                    </dt>
                    <dd className="text-sm font-bold text-ink-900">
                      {match.deliveryDays} days
                    </dd>
                  </div>
                </dl>

                {shortfall &&
                <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-5 text-gold-700">
                    <ClockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Covers {match.capacity} of {spec.quantity} units — we can
                    pair them with a second cluster.
                  </p>
                }

                <button
                  type="button"
                  onClick={() => onSelect(match)}
                  className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-[14px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
                  
                  <BoxesIcon className="h-4 w-4" aria-hidden="true" />
                  Continue with this {match.type}
                </button>
              </article>
            </li>);

        })}
      </ul>
    </div>);

}