import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2Icon, ClockIcon, DollarSignIcon, IndianRupeeIcon, ShieldCheckIcon, XIcon, ArrowRightIcon } from 'lucide-react';
import { fetchDay1Payment } from '../../services/api';

interface Day1PaymentModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  orderTotal?: number;
}

export function Day1PaymentModal({ orderId, isOpen, onClose, orderTotal = 18000 }: Day1PaymentModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchDay1Payment(orderId)
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Using local fallback for Day-1 payment timeline:', err);
          const upfront = Math.round(orderTotal * 0.9);
          const retention = Math.round(orderTotal * 0.1);
          setData({
            order_id: orderId,
            order_total: orderTotal,
            financing_model: 'Day-1 Working Capital Advance',
            timeline: [
              {
                stage: 'Day 0',
                title: 'Order Confirmed & PO Issued',
                date: 'Today',
                status: 'completed',
                amount: orderTotal,
                description: 'Buyer issues bulk purchase order. Escrow guarantees funds.'
              },
              {
                stage: 'Day 1',
                title: '90% Working Capital Disbursed',
                date: 'Tomorrow',
                status: 'active',
                amount: upfront,
                description: `₹${upfront.toLocaleString('en-IN')} released immediately to artisan's Aadhaar/UPI account to procure raw materials.`
              },
              {
                stage: 'Day 15',
                title: 'Craft Inspection & Dispatch',
                date: 'In 15 days',
                status: 'upcoming',
                amount: null,
                description: 'Cluster coordinator inspects batch quality and initiates logistics shipment.'
              },
              {
                stage: 'Day 30',
                title: 'Buyer Settlement & 10% Retention Release',
                date: 'In 30 days',
                status: 'upcoming',
                amount: retention,
                description: `Buyer settles 30-day invoice. Remaining ₹${retention.toLocaleString('en-IN')} retention transferred to artisan.`
              }
            ]
          });
          setLoading(false);
        });
    }
  }, [isOpen, orderId, orderTotal]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ink-500 hover:bg-sand-100 hover:text-ink-900"
          >
            <XIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600">
              <ShieldCheckIcon className="h-6 w-6" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-ink-900">Day-1 Payment Timeline</h2>
              <p className="text-xs text-ink-500">Working Capital Guarantee & Invoice Financing</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-leaf-200 bg-leaf-50/70 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-leaf-800">
                Upfront Artisan Liquidity
              </span>
              <span className="text-xs font-bold text-leaf-700">90% on Day 1</span>
            </div>
            <p className="mt-1 text-2xl font-black text-leaf-900">
              ₹{(orderTotal * 0.9).toLocaleString('en-IN')}
              <span className="text-sm font-normal text-ink-600"> / ₹{orderTotal.toLocaleString('en-IN')}</span>
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-leaf-900/90">
              Zero predatory loans. Artisans receive instant working capital to purchase yarn, clay, or dyes without waiting for 30–60 day corporate payment cycles.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-center py-8 text-sm text-ink-500">Loading timeline stages…</p>
            ) : (
              data?.timeline?.map((step: any, idx: number) => {
                const isCompleted = step.status === 'completed';
                const isActive = step.status === 'active';

                return (
                  <div key={idx} className="relative flex gap-4">
                    {idx < data.timeline.length - 1 && (
                      <div
                        className={
                          'absolute left-4 top-8 -bottom-4 w-0.5 ' +
                          (isCompleted ? 'bg-leaf-500' : 'bg-sand-300')
                        }
                      />
                    )}

                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                      {isCompleted ? (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-leaf-500 text-white shadow-sm">
                          <CheckCircle2Icon className="h-5 w-5" />
                        </span>
                      ) : isActive ? (
                        <span className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full bg-clay-500 text-white shadow-md">
                          <ClockIcon className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sand-400 bg-sand-100 text-ink-400">
                          <span className="text-xs font-bold">{idx + 1}</span>
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pb-2">
                      <div className="flex items-baseline justify-between">
                        <span className="inline-flex rounded-md bg-sand-200 px-2 py-0.5 text-[11px] font-bold text-ink-700">
                          {step.stage}
                        </span>
                        <span className="text-xs text-ink-500">{step.date}</span>
                      </div>
                      <h3 className="mt-1 text-sm font-bold text-ink-900">{step.title}</h3>
                      {step.amount != null && (
                        <p className="mt-0.5 text-xs font-semibold text-leaf-700">
                          Disbursement: ₹{step.amount.toLocaleString('en-IN')}
                        </p>
                      )}
                      <p className="mt-1 text-xs leading-5 text-ink-600">{step.description}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] w-full rounded-full bg-ink-900 text-sm font-semibold text-white transition hover:bg-ink-800"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
