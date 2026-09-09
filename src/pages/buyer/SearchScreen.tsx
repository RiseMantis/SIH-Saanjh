import React, { useMemo, useState } from 'react';
import { SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { MicButton } from '../../components/shared/MicButton';
import { ProductCard } from '../../components/shared/ProductCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { products } from '../../data/products';
import { artisanById } from '../../data/artisans';
import type { CraftCategory } from '../../types';

const crafts: CraftCategory[] = [
'Textiles',
'Pottery',
'Jewelry',
'Woodwork',
'Painting',
'Metalwork',
'Basketry'];


export function SearchScreen() {
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [craft, setCraft] = useState<CraftCategory | null>(null);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [minTrust, setMinTrust] = useState(4);
  const [bulkOnly, setBulkOnly] = useState(false);
  const { saved, toggleSaved, speak } = useApp();

  const results = useMemo(
    () =>
    products.filter((p) => {
      const artisan = artisanById(p.artisanId);
      const matchesQuery =
      query.trim().length === 0 ||
      (p.title + p.description + p.category).
      toLowerCase().
      includes(query.trim().toLowerCase());
      return (
        matchesQuery && (
        !craft || p.category === craft) &&
        p.price <= maxPrice && (
        artisan ? artisan.trustScore >= minTrust : true) && (
        !bulkOnly || p.bulkAvailable));

    }),
    [query, craft, maxPrice, minTrust, bulkOnly]
  );

  const voiceSearch = () => {
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);
    speak('Listening…');
    window.setTimeout(() => {
      setListening(false);
      setQuery('Warli');
      setMaxPrice(2000);
      setCraft('Painting');
      speak('Showing Warli art under two thousand rupees.');
    }, 1900);
  };

  return (
    <div className="mx-auto max-w-6xl pb-6">
      <header className="sticky top-0 z-20 space-y-2.5 border-b border-sand-300 bg-sand-100/95 px-4 pb-3 pt-3 backdrop-blur">
        <div className="flex items-center gap-2 rounded-full border border-sand-400 bg-white pl-3.5 pr-1.5">
          <SearchIcon className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
          <label htmlFor="buyer-search" className="sr-only">
            Search crafts
          </label>
          <input
            id="buyer-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search crafts, artisans, villages"
            className="h-12 min-w-0 flex-1 bg-transparent text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none" />
          
          <MicButton
            listening={listening}
            onToggle={voiceSearch}
            size="sm"
            label="Search by voice" />
          
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          className="flex min-h-[36px] items-center gap-2 rounded-full border border-sand-400 bg-white px-3 text-[13px] font-semibold text-ink-800 transition-colors duration-150 ease-out hover:bg-sand-200">
          
          <SlidersHorizontalIcon className="h-4 w-4" aria-hidden="true" />
          Filters
        </button>
      </header>

      {showFilters &&
      <section
        className="space-y-3.5 border-b border-sand-300 bg-white px-4 py-4"
        aria-label="Filters">
        
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500">
              Craft type
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {crafts.map((c) =>
            <li key={c}>
                  <button
                type="button"
                onClick={() => setCraft(craft === c ? null : c)}
                aria-pressed={craft === c}
                className={
                'min-h-[36px] rounded-full border px-3 text-[13px] font-medium transition-colors duration-150 ease-out ' + (
                craft === c ?
                'border-clay-500 bg-clay-50 text-clay-700' :
                'border-sand-400 text-ink-700 hover:bg-sand-100')
                }>
                
                    {c}
                  </button>
                </li>
            )}
            </ul>
          </div>

          <div>
            <label
            htmlFor="max-price"
            className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-ink-500">
            
              Price up to
              <span className="text-sm font-bold normal-case text-ink-900">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </label>
            <input
            id="max-price"
            type="range"
            min={500}
            max={5000}
            step={100}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-clay-500" />
          
          </div>

          <div>
            <label
            htmlFor="min-trust"
            className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-ink-500">
            
              Minimum trust score
              <span className="text-sm font-bold normal-case text-ink-900">
                {minTrust.toFixed(1)} +
              </span>
            </label>
            <input
            id="min-trust"
            type="range"
            min={3}
            max={5}
            step={0.1}
            value={minTrust}
            onChange={(e) => setMinTrust(Number(e.target.value))}
            className="mt-2 w-full accent-clay-500" />
          
          </div>

          <button
          type="button"
          onClick={() => setBulkOnly((v) => !v)}
          aria-pressed={bulkOnly}
          className="flex w-full items-center justify-between rounded-xl border border-sand-300 px-3 py-2.5 text-left">
          
            <span className="text-[13px] font-semibold text-ink-900">
              Available for bulk orders
            </span>
            <span
            className={
            'flex h-6 w-11 items-center rounded-full px-0.5 transition-colors duration-150 ease-out ' + (
            bulkOnly ? 'bg-clay-500' : 'bg-sand-400')
            }
            aria-hidden="true">
            
              <span
              className={
              'h-5 w-5 rounded-full bg-white transition-transform duration-150 ease-out ' + (
              bulkOnly ? 'translate-x-5' : 'translate-x-0')
              } />
            
            </span>
          </button>
        </section>
      }

      <section className="px-4 pt-4" aria-label="Search results">
        <p className="text-xs text-ink-500">
          {results.length} result{results.length === 1 ? '' : 's'}
          {query && ` for “${query}”`}
        </p>
        {results.length === 0 ?
        <div className="mt-3">
            <EmptyState
            Icon={SearchIcon}
            title="Nothing matches those filters"
            body="Try widening the price range or lowering the trust score minimum." />
          
          </div> :

        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product) =>
          <li key={product.id}>
                <ProductCard
              product={product}
              variant="grid"
              saved={saved.includes(product.id)}
              onToggleSave={toggleSaved} />
            
              </li>
          )}
          </ul>
        }
      </section>
    </div>);

}