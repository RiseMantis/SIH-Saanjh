import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckIcon, LockIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import {
  RequestForm,
  type RequestSpec } from
'../../components/buyer/request/RequestForm';
import { MatchResults } from '../../components/buyer/request/MatchResults';
import { PaymentTerms } from '../../components/buyer/request/PaymentTerms';
import type { MatchResult } from '../../types';

type Stage = 'form' | 'matches' | 'terms' | 'done';

const stageLabels: Record<Stage, string> = {
  form: 'What do you need?',
  matches: 'Who can make it',
  terms: 'Terms and confirmation',
  done: 'Request placed'
};

export function PostRequest() {
  const [stage, setStage] = useState<Stage>('form');
  const [spec, setSpec] = useState<RequestSpec | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const { buyerAccountType, setBuyerAccountType } = useApp();

  if (buyerAccountType === 'individual') {
    return (
      <div className="px-4 pt-6">
        <div className="rounded-card border border-sand-300 bg-white p-5 text-center shadow-card">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sand-200 text-ink-600">
            <LockIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="mt-3 text-[17px] font-bold text-ink-900">
            Bulk sourcing is for business accounts
          </h1>
          <p className="mt-1.5 text-[13px] leading-6 text-ink-600">
            Switch your account to business to post bulk requests, see artisan
            clusters, and get invoice financing and ESG reports.
          </p>
          <button
            type="button"
            onClick={() => setBuyerAccountType('business')}
            className="mt-4 min-h-[48px] w-full rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
            
            Switch to a business account
          </button>
          <Link
            to="/buyer/discover"
            className="mt-2 flex min-h-[48px] items-center justify-center text-[13px] font-semibold text-ink-600">
            
            Keep browsing instead
          </Link>
        </div>
      </div>);

  }

  return (
    <div className="pb-6">
      <header className="sticky top-0 z-20 border-b border-sand-300 bg-sand-100/95 px-3 pb-2.5 pt-3 backdrop-blur">
        <div className="flex items-center gap-2">
          {stage !== 'form' && stage !== 'done' &&
          <button
            type="button"
            onClick={() => setStage(stage === 'terms' ? 'matches' : 'form')}
            aria-label="Go back one step"
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
            
              <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          }
          <div className="min-w-0 flex-1 px-1">
            <h1 className="text-lg font-bold leading-tight text-ink-900">
              {stageLabels[stage]}
            </h1>
            <p className="text-xs text-ink-500">Bulk sourcing request</p>
          </div>
        </div>
        <ol className="mt-2 flex gap-1.5" aria-hidden="true">
          {(['form', 'matches', 'terms'] as Stage[]).map((s, i) => {
            const order = ['form', 'matches', 'terms', 'done'];
            const active = order.indexOf(stage) >= i;
            return (
              <li
                key={s}
                className={
                'h-1.5 flex-1 rounded-full ' + (
                active ? 'bg-clay-500' : 'bg-sand-300')
                } />);


          })}
        </ol>
      </header>

      {stage === 'form' &&
      <RequestForm
        onSubmit={(value) => {
          setSpec(value);
          setStage('matches');
        }} />

      }

      {stage === 'matches' && spec &&
      <MatchResults
        spec={spec}
        onSelect={(value) => {
          setMatch(value);
          setStage('terms');
        }} />

      }

      {stage === 'terms' && spec && match &&
      <PaymentTerms
        spec={spec}
        match={match}
        onConfirm={() => setStage('done')} />

      }

      {stage === 'done' && spec && match &&
      <div className="px-4 pt-8 text-center">
          <motion.span
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-500 text-white">
          
            <CheckIcon className="h-10 w-10" aria-hidden="true" />
          </motion.span>
          <h2 className="mt-4 text-xl font-bold text-ink-900">
            Request placed with {match.name}
          </h2>
          <p className="mt-1.5 text-[13px] leading-6 text-ink-600">
            {spec.quantity} units · ₹
            {(spec.quantity * match.unitPrice).toLocaleString('en-IN')} · arriving
            in about {match.deliveryDays} days. The artisans are paid tomorrow;
            your invoice is due in 30 days.
          </p>
          <div className="mt-5 space-y-2.5 text-left">
            <Link
            to="/buyer/orders"
            className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600">
            
              Track this order
            </Link>
            <button
            type="button"
            onClick={() => setStage('form')}
            className="flex min-h-[48px] w-full items-center justify-center rounded-full border border-ink-200 bg-white text-[13px] font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
            
              Post another request
            </button>
          </div>
        </div>
      }
    </div>);

}