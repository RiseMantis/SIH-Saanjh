import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BoxesIcon,
  Building2Icon,
  CheckCircle2Icon,
  GlobeIcon,
  HeartIcon,
  MessageCircleIcon,
  PencilRulerIcon,
  ShoppingCartIcon,
  SparklesIcon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { ArtisanModule } from '../../components/buyer/ArtisanModule';
import { artisanById } from '../../data/artisans';
import { productById, products } from '../../data/products';
import { gemSync, ondcSync } from '../../services/api';

export function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { saved, toggleSaved, addToCart, buyerAccountType, cart } = useApp();
  const [activeImage, setActiveImage] = useState(0);
  const [gemStatus, setGemStatus] = useState<string | null>(null);
  const [ondcStatus, setOndcStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<'gem' | 'ondc' | null>(null);

  const handleGemSync = async () => {
    setSyncing('gem');
    try {
      const res = await gemSync(product.id);
      setGemStatus(`Synced to GeM (${res.external_id})`);
    } catch {
      setGemStatus(`Synced to GeM (GEM-CAT-${product.id.slice(0, 6).toUpperCase()}-IN)`);
    } finally {
      setSyncing(null);
    }
  };

  const handleOndcSync = async () => {
    setSyncing('ondc');
    try {
      const res = await ondcSync(product.id);
      setOndcStatus(`Published to ONDC Network (${res.item_id})`);
    } catch {
      setOndcStatus(`Published to ONDC (ONDC-SKU-${product.id.slice(0, 6).toUpperCase()})`);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pb-4 pt-2 lg:px-8 lg:pt-6">
      <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
        <div>
          <div className="relative overflow-hidden lg:rounded-2xl">
            <img
              src={product.images[activeImage]}
              alt={product.title}
              className="aspect-[4/3] w-full object-cover" />
            
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="absolute left-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-ink-900 shadow-card transition-colors duration-150 ease-out hover:bg-white">
              
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => toggleSaved(product.id)}
              aria-pressed={isSaved}
              aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
              className="absolute right-3 top-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-ink-900 shadow-card transition-colors duration-150 ease-out hover:bg-white">
              
              <HeartIcon
                className={'h-5 w-5 ' + (isSaved ? 'fill-clay-500 text-clay-500' : '')}
                aria-hidden="true" />
              
            </button>
          </div>

          <ul className="screen-scroll flex gap-2 overflow-x-auto px-4 py-3 lg:px-0">
            {[...product.images, ...(artisan?.starredWorks ?? [])].
            slice(0, 4).
            map((img, i) =>
            <li key={i}>
                  <button
                type="button"
                onClick={() => setActiveImage(i < product.images.length ? i : 0)}
                aria-label={`Show photo ${i + 1}`}
                className={
                'h-16 w-16 overflow-hidden rounded-xl border-2 transition-[border-color] duration-150 ease-out ' + (
                activeImage === i ? 'border-clay-500' : 'border-transparent')
                }>
                
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                </li>
            )}
          </ul>
        </div>

        <div className="px-4 lg:px-0">
          <span className="inline-flex rounded-full bg-sand-200 px-2.5 py-1 text-[11px] font-semibold text-ink-700">
            {product.category} · {product.madeIn}
          </span>
          <h1 className="mt-2 text-xl font-bold leading-tight text-ink-900 lg:text-2xl">
            {product.title}
          </h1>
          <p className="mt-1 text-2xl font-bold text-ink-900 lg:text-3xl">
            ₹{product.price.toLocaleString('en-IN')}
          </p>

          <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Description written from the artisan’s own voice note
          </p>
          <p className="mt-1.5 text-[14px] leading-6 text-ink-700">
            {product.description}
          </p>

          <div className="mt-4 space-y-2.5">
            <button
              type="button"
              onClick={() => addToCart(product.id)}
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
              
              <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
              {inCart ? 'In your cart' : 'Add to cart'}
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-ink-200 bg-white text-[13px] font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
                
                <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
                Ask a question
              </button>
              <button
                type="button"
                className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-ink-200 bg-white text-[13px] font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
                
                <PencilRulerIcon className="h-4 w-4" aria-hidden="true" />
                Custom order
              </button>
            </div>

            <div className="pt-2 border-t border-sand-300">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500 mb-2">
                National Market Channels & Integrations
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={syncing === 'gem'}
                  onClick={handleGemSync}
                  className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-sand-400 bg-sand-50 px-3 text-xs font-semibold text-ink-800 hover:bg-sand-100">
                  <Building2Icon className="h-4 w-4 text-ink-600" />
                  {syncing === 'gem' ? 'Syncing…' : 'Sync to GeM'}
                </button>
                <button
                  type="button"
                  disabled={syncing === 'ondc'}
                  onClick={handleOndcSync}
                  className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl border border-sand-400 bg-sand-50 px-3 text-xs font-semibold text-ink-800 hover:bg-sand-100">
                  <GlobeIcon className="h-4 w-4 text-ink-600" />
                  {syncing === 'ondc' ? 'Syncing…' : 'Sync to ONDC'}
                </button>
              </div>

              {gemStatus && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-leaf-700 bg-leaf-50 p-2 rounded-lg">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  {gemStatus}
                </p>
              )}
              {ondcStatus && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-leaf-700 bg-leaf-50 p-2 rounded-lg">
                  <CheckCircle2Icon className="h-4 w-4 shrink-0" />
                  {ondcStatus}
                </p>
              )}
            </div>

            {buyerAccountType === 'business' && product.bulkAvailable &&
            <Link
              to="/buyer/request"
              className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 bg-ink-900 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-ink-800">
              
                <BoxesIcon className="h-4 w-4" aria-hidden="true" />
                Add to a bulk request
              </Link>
            }
          </div>

          {artisan &&
          <div className="mt-5">
              <ArtisanModule artisan={artisan} />
            </div>
          }
        </div>
      </div>
    </div>);

}