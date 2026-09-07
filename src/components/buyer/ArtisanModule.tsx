import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2Icon,
  IndianRupeeIcon,
  MapPinIcon,
  StarIcon,
  UsersIcon } from
'lucide-react';
import type { Artisan } from '../../types';
import { TrustBadge } from '../shared/TrustBadge';

export function ArtisanModule({
  artisan,
  linkToProfile = true



}: {artisan: Artisan;linkToProfile?: boolean;}) {
  return (
    <section
      className="rounded-card border border-sand-300 bg-white p-4 shadow-card"
      aria-labelledby={`artisan-${artisan.id}`}>
      
      <div className="flex items-start gap-3">
        <img
          src={artisan.photo}
          alt=""
          className="h-16 w-16 shrink-0 rounded-full object-cover" />
        
        <div className="min-w-0 flex-1">
          <h2
            id={`artisan-${artisan.id}`}
            className="text-base font-bold leading-tight text-ink-900">
            
            {artisan.name}
          </h2>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
            <MapPinIcon className="h-3 w-3" aria-hidden="true" />
            {artisan.village}, {artisan.district}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-600">
            <UsersIcon className="h-3 w-3" aria-hidden="true" />
            {artisan.groupName} · {artisan.groupMembers} members
          </p>
        </div>
        <TrustBadge score={artisan.trustScore} />
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 border-y border-sand-200 py-3">
        <Stat label="Ongoing" value={String(artisan.ongoingOrders)} />
        <Stat label="Completed" value={String(artisan.completedOrders)} />
        <Stat
          label="Per month"
          value={`${artisan.monthlyCapacity} pcs`} />
        
      </dl>

      <p className="mt-3 text-[13px] leading-6 text-ink-700">{artisan.about}</p>
      <p className="mt-1 text-[11px] text-ink-400">
        Recorded by the artisan in their own words
      </p>

      <p className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-ink-900">
        <IndianRupeeIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Usually charges ₹{artisan.priceRangeLow.toLocaleString('en-IN')} – ₹
        {artisan.priceRangeHigh.toLocaleString('en-IN')}
      </p>

      <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-ink-500">
        Most-starred past works
      </h3>
      <ul className="screen-scroll mt-2 flex gap-2 overflow-x-auto pb-1">
        {artisan.starredWorks.map((work, i) =>
        <li key={i} className="shrink-0">
            <img
            src={work}
            alt={`Past work by ${artisan.name}`}
            className="h-24 w-24 rounded-xl object-cover" />
          
          </li>
        )}
      </ul>

      <h3 className="mt-4 text-xs font-bold uppercase tracking-wide text-ink-500">
        Top reviews
      </h3>
      <ul className="mt-2 space-y-2.5">
        {artisan.reviews.map((review) =>
        <li key={review.id} className="rounded-xl bg-sand-100 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[13px] font-bold text-ink-900">
                {review.buyerName}
              </p>
              <span className="flex items-center gap-0.5" aria-label={`${review.rating} out of 5`}>
                {Array.from({ length: review.rating }).map((_, i) =>
              <StarIcon
                key={i}
                className="h-3 w-3 fill-gold-500 text-gold-500"
                aria-hidden="true" />

              )}
              </span>
            </div>
            <p className="mt-1 text-[13px] leading-5 text-ink-700">
              {review.text}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-400">
              <CheckCircle2Icon className="h-3 w-3" aria-hidden="true" />
              Verified order · {review.date}
            </p>
          </li>
        )}
      </ul>

      {linkToProfile &&
      <Link
        to={`/buyer/artisan/${artisan.id}`}
        className="mt-4 flex min-h-[48px] items-center justify-center rounded-full border border-ink-200 text-[13px] font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
        
          See everything by {artisan.name.split(' ')[0]}
        </Link>
      }
    </section>);

}

function Stat({ label, value }: {label: string;value: string;}) {
  return (
    <div className="text-center">
      <dt className="text-[11px] uppercase tracking-wide text-ink-400">
        {label}
      </dt>
      <dd className="text-base font-bold text-ink-900">{value}</dd>
    </div>);

}