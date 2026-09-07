import React from 'react';
import { CheckIcon } from 'lucide-react';
import type { OrderStatus } from '../../types';
import { statusOrder } from '../../data/orders';
import { statusIcon, statusLabel } from './StatusChip';

interface OrderTrackerProps {
  status: OrderStatus;
  orientation: 'vertical' | 'horizontal';
  notes?: Partial<Record<OrderStatus, string>>;
}

export function OrderTracker({
  status,
  orientation,
  notes
}: OrderTrackerProps) {
  const currentIndex = statusOrder.indexOf(status);

  if (orientation === 'horizontal') {
    return (
      <ol className="flex items-start justify-between" aria-label="Order status">
        {statusOrder.map((step, i) => {
          const done = i <= currentIndex;
          const Icon = statusIcon(step);
          return (
            <li
              key={step}
              className="relative flex flex-1 flex-col items-center text-center"
              aria-current={i === currentIndex ? 'step' : undefined}>
              
              {i > 0 &&
              <span
                className={
                'absolute left-0 top-4 h-0.5 w-full -translate-x-1/2 ' + (
                i <= currentIndex ? 'bg-leaf-500' : 'bg-sand-300')
                }
                aria-hidden="true" />

              }
              <span
                className={
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ' + (
                done ?
                'border-leaf-500 bg-leaf-500 text-white' :
                'border-sand-300 bg-white text-ink-300')
                }>
                
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span
                className={
                'mt-2 text-[11px] font-medium leading-tight ' + (
                done ? 'text-ink-900' : 'text-ink-400')
                }>
                
                {statusLabel(step)}
              </span>
            </li>);

        })}
      </ol>);

  }

  return (
    <ol className="space-y-1" aria-label="Order status">
      {statusOrder.map((step, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        const Icon = statusIcon(step);
        return (
          <li
            key={step}
            className="flex gap-4"
            aria-current={current ? 'step' : undefined}>
            
            <div className="flex flex-col items-center">
              <span
                className={
                'flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ' + (
                done ?
                'border-leaf-500 bg-leaf-500 text-white' :
                current ?
                'border-clay-500 bg-clay-500 text-white' :
                'border-sand-300 bg-white text-ink-300')
                }>
                
                {done ?
                <CheckIcon className="h-7 w-7" aria-hidden="true" /> :

                <Icon className="h-7 w-7" aria-hidden="true" />
                }
              </span>
              {i < statusOrder.length - 1 &&
              <span
                className={
                'my-1 w-1 flex-1 rounded-full ' + (
                done ? 'bg-leaf-500' : 'bg-sand-300')
                }
                aria-hidden="true" />

              }
            </div>
            <div className={'pb-5 pt-2 ' + (i === statusOrder.length - 1 ? 'pb-0' : '')}>
              <p
                className={
                'text-artisan-body font-bold ' + (
                done || current ? 'text-ink-900' : 'text-ink-400')
                }>
                
                {statusLabel(step)}
              </p>
              {notes?.[step] &&
              <p className="mt-0.5 text-base leading-6 text-ink-600">
                  {notes[step]}
                </p>
              }
              {current &&
              <p className="mt-1 inline-flex rounded-full bg-clay-50 px-2.5 py-1 text-sm font-semibold text-clay-700">
                  Now
                </p>
              }
            </div>
          </li>);

      })}
    </ol>);

}