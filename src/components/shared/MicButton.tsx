import React from 'react';
import { MicIcon, SquareIcon } from 'lucide-react';

interface MicButtonProps {
  listening: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'xl';
  label?: string;
  className?: string;
}

const sizes = {
  sm: 'h-12 w-12',
  md: 'h-[72px] w-[72px]',
  xl: 'h-44 w-44'
};

export function MicButton({
  listening,
  onToggle,
  size = 'md',
  label = 'Speak',
  className = ''
}: MicButtonProps) {
  return (
    <div className={'relative inline-flex ' + className}>
      {listening &&
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-clay-500 animate-mic-pulse"
        aria-hidden="true" />

      }
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={listening}
        aria-label={listening ? 'Stop listening' : label}
        className={
        'relative z-10 flex items-center justify-center rounded-full text-white shadow-lift transition-[transform,background-color] duration-150 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' +
        sizes[size] + (
        listening ? ' bg-clay-600' : ' bg-clay-500 hover:bg-clay-600')
        }>
        
        {listening ?
        size === 'xl' ?
        <Waveform /> :

        <SquareIcon className="h-6 w-6 fill-current" aria-hidden="true" /> :


        <MicIcon
          className={
          size === 'xl' ? 'h-20 w-20' : size === 'md' ? 'h-9 w-9' : 'h-6 w-6'
          }
          aria-hidden="true" />

        }
      </button>
    </div>);

}

export function Waveform({ bars = 7 }: {bars?: number;}) {
  return (
    <div className="flex h-16 items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) =>
      <span
        key={i}
        className="w-2.5 rounded-full bg-white animate-wave"
        style={{
          height: `${28 + i * 13 % 34}px`,
          animationDelay: `${i * 90}ms`
        }} />

      )}
    </div>);

}