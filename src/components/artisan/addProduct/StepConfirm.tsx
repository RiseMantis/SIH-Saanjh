import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, Volume2Icon, XIcon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { TrustBadge } from '../../shared/TrustBadge';
import { currentArtisan, images } from '../../../data/artisans';
import { createListing, publishListing } from '../../../services/api';

export function StepConfirm({ onPublish }: {onPublish: () => void;}) {
  const [confirming, setConfirming] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { draft, speak } = useApp();

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const listingData = {
        title: draft.title || 'Hand-woven cotton saree, red and gold',
        description_en: draft.description || 'Hand-woven cotton saree in deep red with a golden zari border.',
        description_hi: draft.description_hi || 'हाथ से बुनी सूती साड़ी',
        category: draft.category || 'Textiles',
        tags: draft.tags && draft.tags.length > 0 ? draft.tags : ['handwoven', 'cotton', 'saree'],
        price: draft.price,
        price_min: draft.price_min || Math.round(draft.price * 0.85),
        price_max: draft.price_max || Math.round(draft.price * 1.15),
      };
      const created = await createListing(listingData);
      if (created && created.id) {
        await publishListing(created.id);
      }
    } catch (err) {
      console.warn('Backend publish failed or offline, proceeding locally:', err);
    } finally {
      setIsPublishing(false);
      onPublish();
    }
  };

  const readBack = `I heard: ${draft.title || 'hand-woven cotton saree, red and gold'}. Price ${draft.price} rupees. Should I publish this?`;

  return (
    <div className="px-4 pb-40 pt-4">
      <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
        This is what buyers will see
      </h2>

      <article className="mt-4 overflow-hidden rounded-card border border-sand-300 bg-white shadow-card">
        <img
          src={draft.enhancedPhoto ?? images.saree}
          alt={draft.title || 'Your product'}
          className="aspect-[4/3] w-full object-cover" />
        
        <div className="p-4">
          <h3 className="text-[20px] font-bold leading-7 text-ink-900">
            {draft.title || 'Hand-woven cotton saree, red and gold'}
          </h3>
          <p className="mt-1 text-[26px] font-bold text-ink-900">
            ₹{draft.price.toLocaleString('en-IN')}
          </p>
          <p className="mt-2 text-base leading-6 text-ink-700">
            {draft.description ||
            'Hand-woven cotton saree in deep red with a golden zari border.'}
          </p>
          <div className="mt-3 flex items-center gap-3 border-t border-sand-200 pt-3">
            <img
              src={currentArtisan.photo}
              alt=""
              className="h-10 w-10 rounded-full object-cover" />
            
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-ink-900">
                {currentArtisan.name}
              </p>
              <p className="truncate text-sm text-ink-500">
                {currentArtisan.village}, {currentArtisan.district}
              </p>
            </div>
            <TrustBadge score={currentArtisan.trustScore} />
          </div>
        </div>
      </article>

      <button
        type="button"
        onClick={() => speak(readBack)}
        className="mt-4 flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-ink-900 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-ink-800">
        
        <Volume2Icon className="h-7 w-7" aria-hidden="true" />
        Read the whole listing to me
      </button>

      <div className="mt-4 space-y-3">
        <button
          type="button"
          onClick={() => {
            setConfirming(true);
            speak(readBack);
          }}
          className="min-h-[72px] w-full rounded-full bg-clay-500 text-[26px] font-bold text-white shadow-lift transition-colors duration-150 ease-out hover:bg-clay-600">
          
          Publish
        </button>
        <button
          type="button"
          onClick={() => speak('Saved as a draft. It is not visible to buyers yet.')}
          className="min-h-[64px] w-full rounded-full border-2 border-ink-900 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
          
          Save as draft
        </button>
      </div>

      <AnimatePresence>
        {confirming &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 z-50 flex items-end bg-ink-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm publishing">
          
            <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
            className="w-full rounded-sheet bg-white p-5 shadow-lift">
            
              <p className="text-artisan-body leading-7 text-ink-700">
                I heard:
              </p>
              <p className="mt-1 text-[22px] font-bold leading-8 text-ink-900">
                {draft.title || 'Hand-woven cotton saree, red and gold'} ·{' '}
                ₹{draft.price.toLocaleString('en-IN')}
              </p>
              <p className="mt-2 text-artisan-body text-ink-700">
                Should I publish this?
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                type="button"
                onClick={() => setConfirming(false)}
                className="flex min-h-[72px] items-center justify-center gap-2 rounded-full border-2 border-ink-900 text-artisan-label font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
                
                  <XIcon className="h-7 w-7" aria-hidden="true" />
                  No
                </button>
                <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublish}
                className="flex min-h-[72px] items-center justify-center gap-2 rounded-full bg-leaf-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-leaf-600 disabled:opacity-50">
                
                  <CheckIcon className="h-7 w-7" aria-hidden="true" />
                  {isPublishing ? 'Publishing…' : 'Yes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}