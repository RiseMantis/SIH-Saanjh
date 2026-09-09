import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CalendarDaysIcon, MapPinIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ProductCard } from '../../components/shared/ProductCard';
import { products, fairs } from '../../data/products';
import { images as artisanImages } from '../../data/artisans';
import { fetchListings } from '../../services/api';
import type { CraftCategory, Product } from '../../types';

const categories: (CraftCategory | 'All')[] = [
  'All',
  'Textiles',
  'Pottery',
  'Jewelry',
  'Woodwork',
  'Painting',
  'Metalwork',
  'Basketry'
];

export function Discover() {
  const [category, setCategory] = useState<CraftCategory | 'All'>('All');
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const { saved, toggleSaved } = useApp();

  useEffect(() => {
    async function loadListings() {
      try {
        const res = await fetchListings({
          category: category === 'All' ? undefined : category,
          limit: 20
        });
        if (res && res.items && res.items.length > 0) {
          const mapped: Product[] = res.items.map((item: any, idx: number) => ({
            id: item.id || `db-${idx}`,
            title: item.title || 'Handmade Craft Item',
            artisanId: item.artisan_id || 'artisan-1',
            category: (item.category as CraftCategory) || 'Textiles',
            price: Number(item.price || item.price_min || 1500),
            images: item.media_urls && item.media_urls.length > 0 ? item.media_urls : [artisanImages.saree],
            description: item.description_en || item.description_hi || '',
            likes: 42 + idx * 7,
            bulkAvailable: true,
            madeIn: item.artisan_state || 'Madhya Pradesh',
            storySnippet: item.description_hi || 'Crafted traditionally by local artisans.',
            isBestSeller: idx === 0
          }));
          setDbProducts(mapped);
        } else {
          setDbProducts([]);
        }
      } catch (err) {
        console.warn('Backend listings offline, using local feed:', err);
        setDbProducts([]);
      }
    }
    loadListings();
  }, [category]);

  const localFeed =
    category === 'All' ?
    products :
    products.filter((p) => p.category === category);

  const feed = dbProducts.length > 0 ? [...dbProducts, ...localFeed] : localFeed;

  return (
    <div className="mx-auto max-w-6xl pb-6">
      <header className="sticky top-0 z-20 border-b border-sand-300 bg-sand-100/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <div>
            <h1 className="text-xl font-bold leading-tight text-ink-900">
              Discover
            </h1>
            <p className="flex items-center gap-1 text-xs text-ink-500">
              <MapPinIcon className="h-3 w-3" aria-hidden="true" />
              Near Bengaluru
            </p>
          </div>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-12 w-12 items-center justify-center rounded-full text-ink-800 transition-colors duration-150 ease-out hover:bg-sand-200">
            
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-clay-500" />
          </button>
        </div>
        <ul className="flex gap-2 overflow-x-auto px-4 pb-2.5 screen-scroll">
          {categories.map((c) =>
          <li key={c}>
              <button
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={
              'min-h-[36px] whitespace-nowrap rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-150 ease-out ' + (
              category === c ?
              'border-ink-900 bg-ink-900 text-white' :
              'border-sand-400 bg-white text-ink-700 hover:bg-sand-200')
              }>
              
                {c}
              </button>
            </li>
          )}
        </ul>
      </header>

      <section className="px-4 pt-4" aria-labelledby="fairs-heading">
        <div className="flex items-baseline justify-between">
          <h2
            id="fairs-heading"
            className="text-sm font-bold uppercase tracking-wide text-ink-700">
            
            Upcoming fairs near you
          </h2>
        </div>
        <ul className="screen-scroll mt-2.5 flex gap-3 overflow-x-auto pb-1">
          {fairs.map((fair) =>
          <li key={fair.id} className="w-[210px] shrink-0">
              <article className="overflow-hidden rounded-card border border-sand-300 bg-white shadow-card">
                <img
                src={fair.image}
                alt=""
                className="h-24 w-full object-cover" />
              
                <div className="p-3">
                  <h3 className="text-[13px] font-bold leading-snug text-ink-900">
                    {fair.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-500">
                    <CalendarDaysIcon className="h-3 w-3" aria-hidden="true" />
                    {fair.dates} · {fair.city}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-clay-600">
                    {fair.stalls} artisan stalls
                  </p>
                </div>
              </article>
            </li>
          )}
        </ul>
      </section>

      <section className="mt-5 px-4" aria-label="Artisan posts">
        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:grid-cols-3">
          {feed.map((product) =>
          <ProductCard
            key={product.id}
            product={product}
            variant="feed"
            saved={saved.includes(product.id)}
            onToggleSave={toggleSaved} />

          )}
        </div>
      </section>

      <p className="mt-5 px-4 text-center text-xs text-ink-400">
        You can also say “find me Warli art under ₹2000” from the search tab.{' '}
        <Link to="/buyer/search" className="font-semibold text-clay-600 underline">
          Try voice search
        </Link>
      </p>
    </div>);

}