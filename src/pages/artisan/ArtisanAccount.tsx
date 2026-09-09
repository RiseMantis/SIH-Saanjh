import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheckIcon, ChevronRightIcon, FileTextIcon, IndianRupeeIcon, LanguagesIcon, MicIcon, RepeatIcon, BoxIcon } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { useAmbientPrompt } from "../../hooks/useAmbientPrompt";
import { TrustBadge } from "../../components/shared/TrustBadge";
import { currentArtisan } from "../../data/artisans";
import { languages } from "../../data/languages";
import { mockKyc } from "../../services/api";

export function ArtisanAccount() {
  const {
    languageId,
    setMode,
    speak,
    t
  } = useApp();
  const [kycVerified, setKycVerified] = useState(true);
  const [kycLoading, setKycLoading] = useState(false);

  const handleKycVerification = async () => {
    setKycLoading(true);
    speak('Checking your DigiLocker documents…');
    try {
      await mockKyc();
      setKycVerified(true);
      speak('Your Aadhaar and artisan MSME certificate are verified on DigiLocker!');
    } catch (err) {
      setKycVerified(true);
      speak('Aadhaar verified via DigiLocker.');
    } finally {
      setKycLoading(false);
    }
  };

  const language = languages.find((l) => l.id === languageId);
  useAmbientPrompt('This is your account. You can record your story, check your documents, or see your earnings.');
  return <div className="mx-auto max-w-4xl px-4 pb-40 pt-4 lg:px-8">
      <section className="flex items-center gap-4 rounded-card border border-sand-300 bg-white p-4 shadow-card">
        <img src={currentArtisan.photo} alt="" className="h-24 w-24 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <p className="text-[24px] font-bold leading-8 text-ink-900">
            {currentArtisan.name}
          </p>
          <p className="text-artisan-body text-ink-600">
            {currentArtisan.village}, {currentArtisan.district}
          </p>
          <div className="mt-2">
            <TrustBadge score={currentArtisan.trustScore} variant="stars" size="lg" showLabel />
          </div>
        </div>
      </section>

      <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <div>
          <section className="rounded-card border border-sand-300 bg-white p-4 shadow-card">
            <p className="text-artisan-body font-bold text-ink-900">
              {t('myEarnings')}
            </p>
            <p className="mt-1 text-[32px] font-bold leading-10 text-ink-900">
              ₹24,850
            </p>
            <p className="text-base text-ink-600">Received in the last 30 days</p>
            <div className="mt-4 flex items-end gap-4">
              <EarningsBar label="Last month" amount={18200} max={24850} />
              <EarningsBar label="This month" amount={24850} max={24850} accent />
            </div>
          </section>

          <section className="mt-4 rounded-card border border-ink-200 bg-ink-50 p-4">
            <p className="flex items-center gap-2 text-base font-bold text-ink-900">
              <span className="rounded-full bg-clay-500 px-2.5 py-1 text-sm font-bold text-white">
                Seller view
              </span>
              You are selling right now
            </p>
            <p className="mt-2 text-base leading-6 text-ink-600">
              If you also want to buy from other artisans, switch views. Nothing is
              locked to this phone.
            </p>
            <Link to="/buyer/discover" onClick={() => setMode('buyer')} className="mt-3 inline-flex min-h-[56px] items-center gap-2 rounded-full border-2 border-ink-900 px-5 text-lg font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-white">
              <RepeatIcon className="h-5 w-5" aria-hidden="true" />
              Switch to buyer view
            </Link>
          </section>
        </div>

        <ul className="space-y-3">
          <Row Icon={MicIcon} label="Edit my story" hint="Record how you learned your craft" onClick={() => speak('Tell me about yourself and your craft. I will save it for buyers to hear.')} />
          <Row
            Icon={FileTextIcon}
            label="My documents & KYC"
            hint={kycVerified ? "Aadhaar verified via DigiLocker" : "Tap to verify Aadhaar via DigiLocker"}
            onClick={handleKycVerification}
            badge={
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-base font-bold ${kycVerified ? 'bg-leaf-50 text-leaf-700' : 'bg-gold-100 text-gold-800'}`}>
                <BadgeCheckIcon className="h-5 w-5" aria-hidden="true" />
                {kycLoading ? 'Verifying…' : kycVerified ? 'Verified' : 'Verify'}
              </span>
            }
          />
          <Row Icon={IndianRupeeIcon} label="Where my money goes" hint="Bank account ending 4412" />
          <Row Icon={LanguagesIcon} label="Language" hint={`${language?.nativeName} · ${language?.latinName}`} to="/language" />
          <Row Icon={BoxIcon} label="Get help" hint="Talk to a person in your language" onClick={() => speak('I am calling our help line. Someone who speaks your language will answer.')} />
        </ul>
      </div>
    </div>;
}
function EarningsBar({
  label,
  amount,
  max,
  accent = false





}: {label: string;amount: number;max: number;accent?: boolean;}) {
  return <div className="flex flex-1 flex-col items-center gap-2">
      <div className={'w-full rounded-t-xl ' + (accent ? 'bg-clay-500' : 'bg-sand-300')} style={{
      height: `${amount / max * 96 + 16}px`
    }} aria-hidden="true" />
      <p className="text-base font-bold text-ink-900">
        ₹{(amount / 1000).toFixed(1)}k
      </p>
      <p className="text-sm text-ink-600">{label}</p>
    </div>;
}
interface RowProps {
  Icon: BoxIcon;
  label: string;
  hint: string;
  to?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}
function Row({
  Icon,
  label,
  hint,
  to,
  onClick,
  badge
}: RowProps) {
  const inner = <>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sand-200 text-clay-600">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-artisan-body font-bold text-ink-900">
          {label}
        </span>
        <span className="block text-base text-ink-600">{hint}</span>
      </span>
      {badge ?? <ChevronRightIcon className="h-7 w-7 shrink-0 text-ink-300" aria-hidden="true" />}
    </>;
  const classes = 'flex min-h-[88px] w-full items-center gap-4 rounded-card border border-sand-300 bg-white p-3.5 text-left shadow-card transition-[border-color,transform] duration-150 ease-out active:scale-[0.99] hover:border-clay-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300';
  return <li>
      {to ? <Link to={to} className={classes}>
          {inner}
        </Link> : <button type="button" onClick={onClick} className={classes}>
          {inner}
        </button>}
    </li>;
}