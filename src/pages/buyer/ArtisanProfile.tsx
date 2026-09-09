import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { ArtisanModule } from '../../components/buyer/ArtisanModule';
import { ProductCard } from '../../components/shared/ProductCard';
import { artisanById, artisans } from '../../data/artisans';
import { products } from '../../data/products';
import { useApp } from '../../contexts/AppContext';

export function ArtisanProfile() {
  const { artisanId } = useParams();
  const navigate = useNavigate();
  const { saved, toggleSaved } = useApp();
  const artisan = artisanById(artisanId ?? '') ?? artisans[0];
  const theirProducts = products.filter((p) => p.artisanId === artisan.id);

  return (
    <div className="mx-auto max-w-5xl pb-6 lg:px-8">
      <header className="flex items-center gap-2 border-b border-sand-300 bg-white px-3 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-12 w-12 items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="text-lg font-bold text-ink-900">{artisan.name}</h1>
      </header>

      <div className="px-4 pt-4 lg:px-0">
        <ArtisanModule artisan={artisan} linkToProfile={false} />
      </div>

      <section className="mt-5 px-4 lg:px-0" aria-labelledby="their-work">
        <h2 id="their-work" className="text-sm font-bold text-ink-900">
          Available now ({theirProducts.length})
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {theirProducts.map((product) =>
          <li key={product.id}>
              <ProductCard
              product={product}
              variant="grid"
              saved={saved.includes(product.id)}
              onToggleSave={toggleSaved} />
            
            </li>
          )}
        </ul>
      </section>
    </div>);

}