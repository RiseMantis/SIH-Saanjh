import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  MegaphoneIcon,
  PackageIcon,
  Volume2Icon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAmbientPrompt } from '../../hooks/useAmbientPrompt';
import { notificationById, notifications } from '../../data/notifications';

const kindIcon = {
  scheme: MegaphoneIcon,
  fair: CalendarDaysIcon,
  order: PackageIcon
};

export function NotificationDetail() {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const { speak } = useApp();
  const item = notificationById(notificationId ?? '') ?? notifications[0];
  const Icon = kindIcon[item.kind];

  useAmbientPrompt(item.spoken);

  return (
    <div className="mx-auto max-w-3xl pb-40 lg:px-8">
      <header className="flex items-center gap-3 border-b border-sand-300 bg-white px-3 py-3">
        <button
          type="button"
          onClick={() => navigate('/artisan/home')}
          aria-label="Go back home"
          className="flex h-[56px] w-[56px] items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          
          <ArrowLeftIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <h1 className="text-[22px] font-bold text-ink-900">News for you</h1>
      </header>

      <div className="px-4 pt-5">
        <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gold-500 text-white">
          <Icon className="h-12 w-12" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-[28px] font-bold leading-9 text-ink-900">
          {item.headline}
        </h2>
        <p className="mt-1 text-base text-ink-500">{item.date}</p>

        <button
          type="button"
          onClick={() => speak(`${item.spoken} ${item.detail}`)}
          className="mt-5 flex min-h-[64px] w-full items-center justify-center gap-2 rounded-full bg-clay-500 text-artisan-label font-bold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
          
          <Volume2Icon className="h-7 w-7" aria-hidden="true" />
          Tell me more
        </button>

        <p className="mt-5 text-artisan-body leading-7 text-ink-700">
          {item.detail}
        </p>

        {item.kind === 'scheme' &&
        <div className="mt-5 space-y-3">
            <button
            type="button"
            onClick={() =>
            speak(
              'I will fill the form with your DigiLocker documents and read it back to you before sending.'
            )
            }
            className="min-h-[64px] w-full rounded-full border-2 border-ink-900 text-artisan-label font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
            
              Yes, apply for me
            </button>
            <Link
            to="/artisan/home"
            className="flex min-h-[56px] w-full items-center justify-center rounded-full text-lg font-bold text-ink-600 transition-colors duration-150 ease-out hover:bg-sand-200">
            
              Not now
            </Link>
          </div>
        }
      </div>

      <section className="mt-6 px-4">
        <h3 className="text-artisan-label font-bold text-ink-900">
          Other news
        </h3>
        <ul className="mt-3 space-y-3">
          {notifications.
          filter((n) => n.id !== item.id).
          map((n) => {
            const RowIcon = kindIcon[n.kind];
            return (
              <li key={n.id}>
                  <Link
                  to={`/artisan/notification/${n.id}`}
                  className="flex min-h-[88px] items-center gap-4 rounded-card border border-sand-300 bg-white p-3.5 shadow-card transition-[border-color] duration-150 ease-out hover:border-clay-300">
                  
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sand-200 text-clay-600">
                      <RowIcon className="h-7 w-7" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-artisan-body font-bold leading-6 text-ink-900">
                        {n.headline}
                      </span>
                      <span className="block text-base text-ink-500">
                        {n.date}
                      </span>
                    </span>
                  </Link>
                </li>);

          })}
        </ul>
      </section>
    </div>);

}