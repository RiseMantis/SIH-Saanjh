import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CameraIcon, CheckIcon, MessageCircleIcon, Share2Icon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { images } from '../../../data/artisans';

export function StepSuccess({ onAddAnother }: {onAddAnother: () => void;}) {
  const { draft } = useApp();

  return (
    <div className="flex min-h-full flex-col items-center bg-leaf-50 px-5 pb-40 pt-10 text-center">
      <motion.span
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="flex h-32 w-32 items-center justify-center rounded-full bg-leaf-500 text-white shadow-lift">
        
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.24, ease: [0.23, 1, 0.32, 1] }}>
          
          <CheckIcon className="h-20 w-20" aria-hidden="true" />
        </motion.span>
      </motion.span>

      <h2 className="mt-6 text-[32px] font-bold leading-10 text-ink-900">
        Your product is live!
      </h2>
      <p className="mt-2 text-artisan-body leading-7 text-ink-700">
        Buyers across India can see it now. We will tell you the moment someone
        orders.
      </p>

      <div className="mt-6 flex w-full items-center gap-3 rounded-card border border-sand-300 bg-white p-3 text-left">
        <img
          src={draft.enhancedPhoto ?? images.saree}
          alt=""
          className="h-20 w-20 shrink-0 rounded-xl object-cover" />
        
        <div className="min-w-0">
          <p className="truncate text-artisan-body font-bold text-ink-900">
            {draft.title || 'Hand-woven cotton saree, red and gold'}
          </p>
          <p className="text-xl font-bold text-ink-900">
            ₹{draft.price.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="mt-6 w-full space-y-3">
        <button
          type="button"
          className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-full bg-leaf-500 text-artisan-label font-bold text-white shadow-lift transition-colors duration-150 ease-out hover:bg-leaf-600">
          
          <MessageCircleIcon className="h-7 w-7" aria-hidden="true" />
          Share on WhatsApp
        </button>
        <button
          type="button"
          className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-white">
          
          <Share2Icon className="h-6 w-6" aria-hidden="true" />
          Share somewhere else
        </button>
        <button
          type="button"
          onClick={onAddAnother}
          className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-lg font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
          
          <CameraIcon className="h-6 w-6" aria-hidden="true" />
          Add another product
        </button>
        <Link
          to="/artisan/home"
          className="flex min-h-[56px] w-full items-center justify-center rounded-full text-lg font-bold text-ink-600 transition-colors duration-150 ease-out hover:bg-white">
          
          Go to my home
        </Link>
      </div>
    </div>);

}