import React from 'react';
import { ShieldCheckIcon, StarIcon } from 'lucide-react';

interface TrustBadgeProps {
  score: number;
  variant?: 'stars' | 'shield';
  size?: 'sm' | 'lg';
  showLabel?: boolean;
}

export function TrustBadge({
  score,
  variant = 'shield',
  size = 'sm',
  showLabel = false
}: TrustBadgeProps) {
  const rounded = Math.round(score);
  const tone =
  score >= 4.5 ?
  'bg-leaf-50 text-leaf-700 border-leaf-100' :
  score >= 3.5 ?
  'bg-gold-50 text-gold-700 border-gold-100' :
  'bg-chili-50 text-chili-600 border-chili-100';

  if (variant === 'stars') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) =>
          <StarIcon
            key={i}
            className={
            (size === 'lg' ? 'h-7 w-7' : 'h-4 w-4') + (
            i <= rounded ? ' fill-gold-500 text-gold-500' : ' text-sand-400')
            } />

          )}
        </div>
        <span className="sr-only">Trust score {score} out of 5</span>
        {showLabel &&
        <span
          className={
          size === 'lg' ?
          'text-lg font-semibold text-ink-800' :
          'text-xs font-semibold text-ink-600'
          }>
          
            Trusted seller
          </span>
        }
      </div>);

  }

  return (
    <span
      className={
      'inline-flex items-center gap-1.5 rounded-full border font-semibold ' +
      tone + (
      size === 'lg' ? ' px-3.5 py-2 text-base' : ' px-2 py-1 text-xs')
      }>
      
      <ShieldCheckIcon
        className={size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'}
        aria-hidden="true" />
      
      <span>{score.toFixed(1)}</span>
      {showLabel && <span className="font-medium">trust</span>}
      <span className="sr-only">trust score out of 5</span>
    </span>);

}