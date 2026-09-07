import React, { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { MicButton } from '../../shared/MicButton';
import type { CraftCategory } from '../../../types';

export interface RequestSpec {
  craft: CraftCategory;
  quantity: number;
  priceLow: number;
  priceHigh: number;
  deadline: string;
  location: string;
  notes: string;
}

const crafts: CraftCategory[] = [
'Pottery',
'Textiles',
'Metalwork',
'Woodwork',
'Basketry'];


export function RequestForm({ onSubmit }: {onSubmit: (spec: RequestSpec) => void;}) {
  const [spec, setSpec] = useState<RequestSpec>({
    craft: 'Pottery',
    quantity: 60,
    priceLow: 500,
    priceHigh: 750,
    deadline: '2026-10-20',
    location: 'Pune, Maharashtra',
    notes: ''
  });
  const [listening, setListening] = useState(false);
  const { speak } = useApp();

  const set = <K extends keyof RequestSpec,>(key: K, value: RequestSpec[K]) =>
  setSpec((prev) => ({ ...prev, [key]: value }));

  const dictate = () => {
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);
    speak('Listening…');
    window.setTimeout(() => {
      setListening(false);
      set(
        'notes',
        'Unglazed terracotta planters, 8 inch, with our logo stamped on the base. Packed in pairs.'
      );
    }, 2000);
  };

  return (
    <form
      className="space-y-4 px-4 pt-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(spec);
      }}>
      
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
          Craft type
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {crafts.map((c) =>
          <li key={c}>
              <button
              type="button"
              onClick={() => set('craft', c)}
              aria-pressed={spec.craft === c}
              className={
              'min-h-[36px] rounded-full border px-3 text-[13px] font-medium transition-colors duration-150 ease-out ' + (
              spec.craft === c ?
              'border-clay-500 bg-clay-50 text-clay-700' :
              'border-sand-400 bg-white text-ink-700 hover:bg-sand-100')
              }>
              
                {c}
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Quantity" htmlFor="qty">
          <input
            id="qty"
            type="number"
            min={10}
            value={spec.quantity}
            onChange={(e) => set('quantity', Number(e.target.value))}
            className="h-12 w-full rounded-xl border border-sand-400 bg-white px-3 text-[15px] font-semibold text-ink-900 focus:border-clay-500 focus:outline-none" />
          
        </Field>
        <Field label="Deadline" htmlFor="deadline">
          <input
            id="deadline"
            type="date"
            value={spec.deadline}
            onChange={(e) => set('deadline', e.target.value)}
            className="h-12 w-full rounded-xl border border-sand-400 bg-white px-3 text-[14px] text-ink-900 focus:border-clay-500 focus:outline-none" />
          
        </Field>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
          Target price per unit
        </p>
        <div className="mt-2 flex items-center gap-2">
          <input
            aria-label="Lowest price per unit"
            type="number"
            value={spec.priceLow}
            onChange={(e) => set('priceLow', Number(e.target.value))}
            className="h-12 w-full rounded-xl border border-sand-400 bg-white px-3 text-[15px] font-semibold text-ink-900 focus:border-clay-500 focus:outline-none" />
          
          <span className="text-sm text-ink-500">to</span>
          <input
            aria-label="Highest price per unit"
            type="number"
            value={spec.priceHigh}
            onChange={(e) => set('priceHigh', Number(e.target.value))}
            className="h-12 w-full rounded-xl border border-sand-400 bg-white px-3 text-[15px] font-semibold text-ink-900 focus:border-clay-500 focus:outline-none" />
          
        </div>
      </div>

      <Field label="Delivery location" htmlFor="location">
        <input
          id="location"
          value={spec.location}
          onChange={(e) => set('location', e.target.value)}
          className="h-12 w-full rounded-xl border border-sand-400 bg-white px-3 text-[15px] text-ink-900 focus:border-clay-500 focus:outline-none" />
        
      </Field>

      <div>
        <label
          htmlFor="notes"
          className="text-xs font-bold uppercase tracking-wide text-ink-500">
          
          Special requirements
        </label>
        <div className="mt-2 rounded-xl border border-sand-400 bg-white p-2.5">
          <textarea
            id="notes"
            rows={3}
            value={spec.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Sizes, finish, branding, packing…"
            className="w-full resize-none bg-transparent text-[14px] leading-6 text-ink-900 placeholder:text-ink-400 focus:outline-none" />
          
          <div className="mt-1 flex items-center justify-between border-t border-sand-200 pt-2">
            <p className="text-[11px] text-ink-500">
              {listening ? 'Listening…' : 'Type it, or dictate it'}
            </p>
            <MicButton
              listening={listening}
              onToggle={dictate}
              size="sm"
              label="Dictate special requirements" />
            
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
        
        Find artisans and clusters
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>);

}

function Field({
  label,
  htmlFor,
  children




}: {label: string;htmlFor: string;children: React.ReactNode;}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="text-xs font-bold uppercase tracking-wide text-ink-500">
        
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>);

}