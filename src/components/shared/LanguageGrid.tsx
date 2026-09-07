import React from 'react';
import { CheckIcon, Volume2Icon } from 'lucide-react';
import { languages } from '../../data/languages';

interface LanguageGridProps {
  selectedId: string;
  onSelect: (id: string) => void;
  density?: 'artisan' | 'buyer';
}

export function LanguageGrid({
  selectedId,
  onSelect,
  density = 'artisan'
}: LanguageGridProps) {
  const artisan = density === 'artisan';
  return (
    <ul className={'grid gap-3 ' + (artisan ? 'grid-cols-2' : 'grid-cols-3')}>
      {languages.map((lang) => {
        const active = lang.id === selectedId;
        return (
          <li key={lang.id}>
            <button
              type="button"
              onClick={() => onSelect(lang.id)}
              aria-pressed={active}
              className={
              'flex w-full flex-col items-start justify-between rounded-card border-2 text-left transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' + (
              artisan ? 'min-h-[92px] p-4' : 'min-h-[68px] p-3') + (
              active ?
              ' border-clay-500 bg-clay-50' :
              ' border-sand-300 bg-white hover:border-clay-300')
              }>
              
              <span className="flex w-full items-start justify-between gap-2">
                <span
                  className={
                  'font-deva font-semibold text-ink-900 ' + (
                  artisan ? 'text-2xl leading-9' : 'text-lg leading-7')
                  }>
                  
                  {lang.nativeName}
                </span>
                {active ?
                <CheckIcon
                  className="mt-1 h-5 w-5 shrink-0 text-clay-600"
                  aria-hidden="true" /> :


                <Volume2Icon
                  className="mt-1 h-4 w-4 shrink-0 text-ink-400"
                  aria-hidden="true" />

                }
              </span>
              <span
                className={
                'mt-1 text-ink-500 ' + (artisan ? 'text-sm' : 'text-xs')
                }>
                
                {lang.latinName}
              </span>
            </button>
          </li>);

      })}
    </ul>);

}