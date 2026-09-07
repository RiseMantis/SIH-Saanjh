import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckIcon, MessageSquareQuoteIcon, WorkflowIcon } from 'lucide-react';
import { noteForPath } from '../../data/screenNotes';

const modeLabel = {
  artisan: 'Artisan mode',
  buyer: 'Buyer mode',
  shared: 'Shared entry'
};

export function AnnotationPanel() {
  const { pathname } = useLocation();
  const note = noteForPath(pathname);

  return (
    <aside className="hidden w-[320px] shrink-0 flex-col gap-4 overflow-y-auto py-10 pr-8 xl:flex">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-clay-600">
          {modeLabel[note.mode]}
        </p>
        <h2 className="mt-1 text-2xl font-bold leading-tight text-ink-900">
          {note.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-600">{note.purpose}</p>
      </div>

      {note.voicePrompt &&
      <div className="rounded-card border border-ink-200 bg-white p-4">
          <p className="flex items-center gap-2 text-xs font-bold text-ink-500">
            <MessageSquareQuoteIcon className="h-4 w-4" aria-hidden="true" />
            Ambient voice prompt
          </p>
          <p className="mt-2 text-[15px] italic leading-6 text-ink-900">
            “{note.voicePrompt}”
          </p>
          <p className="mt-2 text-xs text-ink-500">
            Plays once per visit, never on repeat.
          </p>
        </div>
      }

      <ul className="space-y-2">
        {note.notes.map((item) =>
        <li key={item} className="flex gap-2 text-sm leading-6 text-ink-700">
            <CheckIcon
            className="mt-1 h-4 w-4 shrink-0 text-leaf-500"
            aria-hidden="true" />
          
            {item}
          </li>
        )}
      </ul>

      <Link
        to="/voice-flow"
        className="mt-auto flex items-center gap-2 rounded-card border border-sand-400 bg-sand-200 px-4 py-3 text-sm font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-300">
        
        <WorkflowIcon className="h-4 w-4" aria-hidden="true" />
        See the add-product voice flow
      </Link>
    </aside>);

}