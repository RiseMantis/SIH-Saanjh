import React from "react";
import { Link } from "react-router-dom";
import { BellIcon, BriefcaseIcon, ChevronRightIcon, CreditCardIcon, HeartIcon, MapPinIcon, RepeatIcon, SparklesIcon, BoxIcon } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { products } from "../../data/products";
export function BuyerAccount() {
  const {
    buyerAccountType,
    setBuyerAccountType,
    saved,
    setMode
  } = useApp();
  const business = buyerAccountType === 'business';
  const savedProducts = products.filter((p) => saved.includes(p.id));
  return <div className="pb-6">
      <header className="border-b border-sand-300 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-lg font-bold text-white">
            ZW
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight text-ink-900">
              Zeta Workspaces
            </h1>
            <p className="text-xs text-ink-500">procurement@zetaworkspaces.in</p>
          </div>
          <span className="rounded-full bg-sand-200 px-2.5 py-1 text-[11px] font-bold text-ink-700">
            Buyer view
          </span>
        </div>
      </header>

      <section className="px-4 pt-4">
        <div className="rounded-card border border-sand-300 bg-white p-4 shadow-card">
          <p className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
            <BriefcaseIcon className="h-4 w-4" aria-hidden="true" />
            Buying for
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
            {(['individual', 'business'] as const).map((type) => <button key={type} type="button" role="radio" aria-checked={buyerAccountType === type} onClick={() => setBuyerAccountType(type)} className={'min-h-[48px] rounded-xl border-2 px-3 text-[13px] font-semibold capitalize transition-colors duration-150 ease-out ' + (buyerAccountType === type ? 'border-clay-500 bg-clay-50 text-clay-700' : 'border-sand-300 bg-white text-ink-700 hover:bg-sand-100')}>
                {type === 'individual' ? 'Myself' : 'A business'}
              </button>)}
          </div>
          <p className="mt-2 text-[12px] leading-5 text-ink-500">
            {business ? 'Bulk requests, artisan clusters, invoice financing and ESG reports are switched on.' : 'Bulk sourcing, financing terms and ESG reports are hidden while you buy for yourself.'}
          </p>
        </div>
      </section>

      {business && <section className="px-4 pt-3">
          <div className="rounded-card border border-ink-200 bg-ink-900 p-4 text-white">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-clay-300">
              <SparklesIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Insights tier
            </p>
            <p className="mt-1 text-[15px] font-bold leading-snug">
              Sourcing insights and ESG reporting are active until 31 Mar 2027
            </p>
            <button type="button" className="mt-3 min-h-[48px] w-full rounded-full bg-white/10 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-white/20">
              Manage subscription
            </button>
          </div>
        </section>}

      <section className="px-4 pt-4" aria-labelledby="wishlist">
        <div className="flex items-baseline justify-between">
          <h2 id="wishlist" className="text-sm font-bold text-ink-900">
            Saved items ({savedProducts.length})
          </h2>
          <Link to="/buyer/search" className="text-[12px] font-semibold text-clay-600 underline">
            Find more
          </Link>
        </div>
        <ul className="screen-scroll mt-2.5 flex gap-2.5 overflow-x-auto pb-1">
          {savedProducts.map((p) => <li key={p.id} className="w-[120px] shrink-0">
              <Link to={`/buyer/product/${p.id}`}>
                <img src={p.images[0]} alt={p.title} className="h-24 w-full rounded-xl object-cover" />
                <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-ink-800">
                  {p.title}
                </p>
              </Link>
            </li>)}
          {savedProducts.length === 0 && <li className="text-[12px] text-ink-500">
              Nothing saved yet — tap the heart on anything you like.
            </li>}
        </ul>
      </section>

      <ul className="mt-4 space-y-2 px-4">
        <Row Icon={HeartIcon} label="Wishlist and collections" />
        <Row Icon={MapPinIcon} label="Delivery addresses" hint="3 saved" />
        <Row Icon={CreditCardIcon} label="Payment methods" hint="Net 30 terms active" />
        <Row Icon={BellIcon} label="Notification preferences" />
        <Row Icon={BoxIcon} label="Help and support" />
      </ul>

      <section className="mt-4 px-4">
        <Link to="/artisan/home" onClick={() => setMode('artisan')} className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-ink-200 bg-white text-[13px] font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          <RepeatIcon className="h-4 w-4" aria-hidden="true" />
          Switch to seller view
        </Link>
      </section>
    </div>;
}
function Row({
  Icon,
  label,
  hint




}: {Icon: BoxIcon;label: string;hint?: string;}) {
  return <li>
      <button type="button" className="flex min-h-[56px] w-full items-center gap-3 rounded-card border border-sand-300 bg-white px-3.5 text-left transition-[border-color] duration-150 ease-out hover:border-clay-300">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sand-200 text-ink-700">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold text-ink-900">
            {label}
          </span>
          {hint && <span className="block text-[12px] text-ink-500">{hint}</span>}
        </span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-300" aria-hidden="true" />
      </button>
    </li>;
}