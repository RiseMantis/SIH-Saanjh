import React, { useEffect, useState } from 'react';
import { CheckIcon, MinusIcon, PlusIcon, ShieldCheckIcon, Volume2Icon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { suggestPricing } from '../../../services/api';

export function StepPrice({ onNext }: {onNext: () => void;}) {
  const { draft, updateDraft, speak } = useApp();
  const price = draft.price;
  const [explanation, setExplanation] = useState(
    draft.price_explanation ||
    'Sarees like yours sold between ₹1,500 and ₹2,200 in Chanderi and Bhopal this month.'
  );
  const [costFloor, setCostFloor] = useState<number>(1080);

  useEffect(() => {
    async function loadPricing() {
      try {
        const res = await suggestPricing({
          raw_material_cost: 600,
          estimated_hours: 8,
          intricacy_score: 3,
          category: draft.category || 'Textiles',
          seasonality_multiplier: 1.0,
        });
        if (res) {
          const suggestedMid = Math.round((res.price_min + res.price_max) / 200) * 100;
          setExplanation(res.explanation);
          setCostFloor(res.price_min);
          updateDraft({
            price: suggestedMid || price,
            price_min: res.price_min,
            price_max: res.price_max,
            price_explanation: res.explanation,
          });
        }
      } catch (err) {
        console.warn('Backend pricing API offline, using baseline calculation:', err);
      }
    }
    loadPricing();
  }, [draft.category]);

  const change = (delta: number) => {
    const next = Math.max(Math.round(costFloor), price + delta);
    updateDraft({ price: next });
  };

  return (
    <div className="px-4 pb-40 pt-4">
      <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
        A fair price for this
      </h2>
      <p className="mt-2 text-artisan-body text-ink-600">
        Based on material costs, artisan labor floor, and market sales.
      </p>

      <div className="mt-5 rounded-sheet border border-sand-300 bg-white p-6 text-center shadow-card">
        <p className="text-base font-semibold text-ink-500">Suggested price</p>
        <p className="mt-1 text-[56px] font-bold leading-[1.05] text-ink-900">
          ₹{price.toLocaleString('en-IN')}
        </p>
        <p className="mt-2 text-base leading-6 text-ink-600">
          You keep ₹{Math.round(price * 0.94).toLocaleString('en-IN')} after
          delivery. Nothing else is taken.
        </p>

        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => change(-100)}
            aria-label="Lower the price by one hundred rupees"
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-ink-900 text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
            
            <MinusIcon className="h-9 w-9" aria-hidden="true" />
          </button>
          <span className="text-lg font-bold text-ink-600">₹100 steps</span>
          <button
            type="button"
            onClick={() => change(100)}
            aria-label="Raise the price by one hundred rupees"
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-ink-900 text-white transition-colors duration-150 ease-out hover:bg-ink-800">
            
            <PlusIcon className="h-9 w-9" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-card border border-sand-300 bg-sand-200 p-4">
        <div className="flex items-center gap-2 text-leaf-700 font-bold text-sm mb-1">
          <ShieldCheckIcon className="h-5 w-5" />
          <span>Cost Floor Guaranteed: ₹{costFloor.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-base leading-6 text-ink-700">
          {explanation}
        </p>
        <button
          type="button"
          onClick={() => speak(`I calculated a fair price based on your material costs and labor. ${explanation}`)}
          className="mt-3 flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-white">
          
          <Volume2Icon className="h-6 w-6" aria-hidden="true" />
          Explain this price to me
        </button>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-5 flex min-h-[72px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
        
        <CheckIcon className="h-7 w-7" aria-hidden="true" />
        Use ₹{price.toLocaleString('en-IN')}
      </button>
    </div>);

}