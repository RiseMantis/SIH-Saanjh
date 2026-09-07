import React from "react";
import { Volume2Icon, BoxIcon } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
interface EmptyStateProps {
  Icon: BoxIcon;
  title: string;
  body: string;
  density?: 'artisan' | 'buyer';
  action?: React.ReactNode;
  spoken?: string;
}
export function EmptyState({
  Icon,
  title,
  body,
  density = 'buyer',
  action,
  spoken
}: EmptyStateProps) {
  const {
    speak
  } = useApp();
  const artisan = density === 'artisan';
  return <div className={'flex flex-col items-center rounded-card border border-dashed border-sand-400 bg-white text-center ' + (artisan ? 'gap-4 px-6 py-10' : 'gap-2 px-5 py-8')}>
      <span className={'flex items-center justify-center rounded-full bg-sand-200 text-clay-600 ' + (artisan ? 'h-24 w-24' : 'h-12 w-12')}>
        <Icon className={artisan ? 'h-12 w-12' : 'h-6 w-6'} aria-hidden="true" />
      </span>
      <div>
        <p className={'font-bold text-ink-900 ' + (artisan ? 'text-artisan-label' : 'text-base')}>
          {title}
        </p>
        <p className={'mx-auto mt-1 max-w-[280px] text-ink-600 ' + (artisan ? 'text-artisan-body' : 'text-sm')}>
          {body}
        </p>
      </div>
      {artisan && spoken && <button type="button" onClick={() => speak(spoken)} className="inline-flex min-h-[56px] items-center gap-2 rounded-full border-2 border-ink-900 px-5 text-lg font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-ink-50">
          <Volume2Icon className="h-5 w-5" aria-hidden="true" />
          Read this to me
        </button>}
      {action}
    </div>;
}