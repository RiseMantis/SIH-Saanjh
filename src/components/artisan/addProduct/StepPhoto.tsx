import React, { useRef, useState } from 'react';
import { CameraIcon, CheckIcon, ImagePlusIcon, RotateCcwIcon, UploadIcon } from 'lucide-react';
import { useApp } from '../../../contexts/AppContext';
import { AIProgress } from '../../shared/AIProgress';
import { images } from '../../../data/artisans';
import { uploadPhoto } from '../../../services/api';

type Phase = 'camera' | 'processing' | 'review';

export function StepPhoto({ onNext }: {onNext: () => void;}) {
  const [phase, setPhase] = useState<Phase>('camera');
  const [reveal, setReveal] = useState(55);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(images.saree);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { draft, updateDraft, speak } = useApp();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPhase('processing');
      speak('Cleaning up your photo…');
    }
  };

  const capture = () => {
    setPhase('processing');
    speak('Cleaning up your photo…');
  };

  const processPhoto = async () => {
    if (selectedFile) {
      try {
        const res = await uploadPhoto(selectedFile);
        updateDraft({
          photo: res.raw_url,
          enhancedPhoto: res.enhanced_url,
          photoCount: Math.max(1, draft.photoCount)
        });
        setPhase('review');
        speak('Here is your photo before and after. Slide the handle to compare. Do you like it?');
        return;
      } catch (err) {
        console.warn('Backend photo upload failed or offline, falling back to client preview:', err);
      }
    }
    // Fallback to preview or sample
    updateDraft({
      photo: previewUrl,
      enhancedPhoto: previewUrl,
      photoCount: Math.max(1, draft.photoCount)
    });
    setPhase('review');
    speak('Here is your photo before and after. Slide the handle to compare. Do you like it?');
  };

  return (
    <div className="px-4 pb-40 pt-4">
      {phase === 'camera' &&
      <>
          <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
            Take one photo of what you made
          </h2>
          <p className="mt-2 text-artisan-body text-ink-600">
            Hold the phone steady and keep the whole thing inside the box.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="relative mt-4 aspect-[3/4] overflow-hidden rounded-card bg-ink-900">
            <img
            src={previewUrl}
            alt="Live camera view of your product"
            className="h-full w-full object-cover opacity-90" />
          
            <div
            className="absolute inset-6 rounded-2xl border-4 border-dashed border-white/85"
            aria-hidden="true" />
          
            <p className="absolute inset-x-0 bottom-4 text-center text-lg font-semibold text-white drop-shadow">
              Keep it inside the box
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <button
            type="button"
            onClick={capture}
            className="flex min-h-[88px] w-full items-center justify-center gap-3 rounded-full bg-clay-500 text-[26px] font-bold text-white shadow-lift transition-[background-color,transform] duration-150 ease-out active:scale-[0.99] hover:bg-clay-600">
            
              <CameraIcon className="h-10 w-10" aria-hidden="true" />
              Take the photo
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full border-2 border-ink-900 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
              <UploadIcon className="h-5 w-5" aria-hidden="true" />
              Choose photo from device
            </button>
          </div>
        </>
      }

      {phase === 'processing' &&
      <div className="pt-6">
          <AIProgress
          message="Cleaning up your photo with AI background removal…"
          durationMs={2000}
          onDone={processPhoto} />
        
        </div>
      }

      {phase === 'review' &&
      <>
          <h2 className="text-artisan-label font-bold leading-8 text-ink-900">
            Before and after
          </h2>
          <p className="mt-2 text-artisan-body text-ink-600">
            Slide the handle to see what we changed. You can always go back.
          </p>

          <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-card border border-sand-300 bg-sand-200">
            <img
            src={images.saree}
            alt="Your photo after clean-up"
            className="absolute inset-0 h-full w-full object-cover" />
          
            <img
            src={images.saree}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter: 'saturate(0.5) brightness(0.74) contrast(0.88)',
              clipPath: `inset(0 ${100 - reveal}% 0 0)`
            }} />
          
            {reveal > 12 &&
          <span className="absolute bottom-2 left-2 rounded-full bg-ink-900/80 px-2.5 py-1 text-sm font-bold text-white">
                Before
              </span>
          }
            <span
            className="pointer-events-none absolute inset-y-0 w-1 bg-white"
            style={{ left: `${reveal}%` }}
            aria-hidden="true" />
          
            <span className="absolute bottom-2 right-2 rounded-full bg-leaf-500 px-2.5 py-1 text-sm font-bold text-white">
              After
            </span>
          </div>

          <label htmlFor="reveal" className="mt-3 block text-base font-semibold text-ink-700">
            Compare before and after
          </label>
          <input
          id="reveal"
          type="range"
          min={0}
          max={100}
          value={reveal}
          onChange={(e) => setReveal(Number(e.target.value))}
          className="mt-2 h-3 w-full accent-clay-500" />
        

          <div className="mt-5 space-y-3">
            <button
            type="button"
            onClick={onNext}
            className="flex min-h-[72px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
            
              <CheckIcon className="h-7 w-7" aria-hidden="true" />
              Keep this photo
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
              type="button"
              onClick={() => setPhase('camera')}
              className="flex min-h-[64px] items-center justify-center gap-2 rounded-full border-2 border-ink-900 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
              
                <RotateCcwIcon className="h-6 w-6" aria-hidden="true" />
                Take again
              </button>
              <button
              type="button"
              onClick={() => {
                updateDraft({ photoCount: Math.min(5, draft.photoCount + 1) });
                setPhase('camera');
              }}
              className="flex min-h-[64px] items-center justify-center gap-2 rounded-full border-2 border-ink-900 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
              
                <ImagePlusIcon className="h-6 w-6" aria-hidden="true" />
                Add another
              </button>
            </div>
            <p className="text-center text-base text-ink-500">
              {draft.photoCount || 1} of 5 photos · one is enough
            </p>
          </div>
        </>
      }
    </div>);

}