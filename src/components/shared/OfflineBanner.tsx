import React from 'react';
import { CloudOffIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function OfflineBanner({
  density = 'artisan'


}: {density?: 'artisan' | 'buyer';}) {
  const { online } = useApp();
  if (online) return null;

  return (
    <div
      role="status"
      className={
      'flex items-start gap-3 border-b border-gold-100 bg-gold-50 text-gold-700 ' + (
      density === 'artisan' ? 'px-4 py-3' : 'px-4 py-2')
      }>
      
      <CloudOffIcon
        className={density === 'artisan' ? 'mt-0.5 h-6 w-6 shrink-0' : 'h-4 w-4 shrink-0'}
        aria-hidden="true" />
      
      <p
        className={
        'font-semibold ' + (
        density === 'artisan' ? 'text-artisan-body leading-6' : 'text-xs')
        }>
        
        {density === 'artisan' ?
        "No internet — nothing is lost. We'll upload this when you're back online." :
        'You are offline. Showing your last saved results.'}
      </p>
    </div>);

}