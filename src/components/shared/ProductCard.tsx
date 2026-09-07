import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  MessageCircleIcon,
  PlayCircleIcon,
  Share2Icon } from
'lucide-react';
import type { Product } from '../../types';
import { artisanById } from '../../data/artisans';
import { TrustBadge } from './TrustBadge';

interface ProductCardProps {
  product: Product;
  variant?: 'feed' | 'grid';
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}

export function ProductCard({
  product,
  variant = 'feed',
  saved = false,
  onToggleSave
}: ProductCardProps) {
  const artisan = artisanById(product.artisanId);

  if (variant === 'grid') {
    return (
      <article className="overflow-hidden rounded-card border border-sand-300 bg-white shadow-card">
        <Link to={`/buyer/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-sand-200">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover" />
            
          </div>
          <div className="p-2.5">
            <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-ink-900">
              {product.title}
            </h3>
            <p className="mt-1 truncate text-[11px] text-ink-500">
              {artisan?.name} · {artisan?.village}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-1">
              <span className="text-sm font-bold text-ink-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {artisan && <TrustBadge score={artisan.trustScore} />}
            </div>
          </div>
        </Link>
      </article>);

  }

  return (
    <article className="overflow-hidden rounded-card border border-sand-300 bg-white shadow-card">
      <header className="flex items-center gap-3 px-3 py-2.5">
        <Link to={`/buyer/artisan/${artisan?.id}`} className="shrink-0">
          <img
            src={artisan?.photo}
            alt=""
            className="h-10 w-10 rounded-full object-cover" />
          
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            to={`/buyer/artisan/${artisan?.id}`}
            className="block truncate text-sm font-semibold text-ink-900 hover:underline">
            
            {artisan?.name}
          </Link>
          <p className="truncate text-xs text-ink-500">
            {artisan?.village}, {artisan?.district}
          </p>
        </div>
        {artisan && <TrustBadge score={artisan.trustScore} />}
      </header>

      <Link to={`/buyer/product/${product.id}`} className="relative block">
        <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover" />
          
          {product.isVideo &&
          <span className="absolute inset-0 flex items-center justify-center bg-ink-900/15">
              <PlayCircleIcon className="h-14 w-14 text-white" aria-hidden="true" />
              <span className="sr-only">Video post</span>
            </span>
          }
        </div>
      </Link>

      <div className="px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold leading-snug text-ink-900">
              {product.title}
            </h3>
            <p className="mt-0.5 text-sm font-bold text-ink-900">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onToggleSave?.(product.id)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from saved' : 'Save this product'}
              className="flex h-12 w-12 items-center justify-center rounded-full text-ink-500 transition-colors duration-150 ease-out hover:bg-sand-100">
              
              <HeartIcon
                className={'h-5 w-5 ' + (saved ? 'fill-clay-500 text-clay-500' : '')}
                aria-hidden="true" />
              
            </button>
            <button
              type="button"
              aria-label="Share this product"
              className="flex h-12 w-12 items-center justify-center rounded-full text-ink-500 transition-colors duration-150 ease-out hover:bg-sand-100">
              
              <Share2Icon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            to={`/buyer/product/${product.id}`}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-clay-500 px-4 text-sm font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
            
            Order now
          </Link>
          <button
            type="button"
            className="flex min-h-[48px] items-center gap-2 rounded-full border border-ink-200 px-4 text-sm font-semibold text-ink-800 transition-colors duration-150 ease-out hover:bg-sand-100">
            
            <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
            Message
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-400">
          {product.likes.toLocaleString('en-IN')} people saved this
        </p>
      </div>
    </article>);

}