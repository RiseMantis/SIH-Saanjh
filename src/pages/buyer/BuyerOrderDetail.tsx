import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadIcon,
  RepeatIcon,
  StarIcon,
  UsersIcon } from
'lucide-react';
import { OrderTracker } from '../../components/shared/OrderTracker';
import { StatusChip } from '../../components/shared/StatusChip';
import { Day1PaymentModal } from '../../components/shared/Day1PaymentModal';
import { buyerOrders } from '../../data/orders';
import { productById } from '../../data/products';

export function BuyerOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [showDay1, setShowDay1] = useState(false);
  const order = buyerOrders.find((o) => o.id === orderId) ?? buyerOrders[0];
  const product = productById(order.productId);
  const canReview = order.status === 'delivered' || order.status === 'paid';

  return (
    <div className="mx-auto max-w-3xl pb-6 lg:px-8">
      <header className="flex items-center gap-2 border-b border-sand-300 bg-white px-3 py-3">
        <button
          type="button"
          onClick={() => navigate('/buyer/orders')}
          aria-label="Back to orders"
          className="flex h-12 w-12 items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          
          <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <div>
          <h1 className="text-lg font-bold leading-tight text-ink-900">
            Order {order.id.toUpperCase()}
          </h1>
          <p className="text-xs text-ink-500">Placed {order.placedOn}</p>
        </div>
      </header>

      <div className="px-4 pt-4">
        <div className="flex gap-3 rounded-card border border-sand-300 bg-white p-3 shadow-card">
          <img
            src={product?.images[0]}
            alt={product?.title ?? ''}
            className="h-20 w-20 shrink-0 rounded-xl object-cover" />
          
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-semibold leading-snug text-ink-900">
              {product?.title}
            </p>
            <Link
              to={`/buyer/artisan/${product?.artisanId}`}
              className="text-xs text-ink-500 underline">
              
              {order.counterpartName} · {order.counterpartLocation}
            </Link>
            <div className="mt-1.5 flex items-center gap-2">
              <StatusChip status={order.status} />
              <span className="text-sm font-bold text-ink-900">
                ₹{order.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <section className="mt-4 rounded-card border border-sand-300 bg-white p-4 shadow-card">
          <h2 className="text-xs font-bold uppercase tracking-wide text-ink-500">
            Status
          </h2>
          <div className="mt-4">
            <OrderTracker status={order.status} orientation="horizontal" />
          </div>
        </section>

        {order.cluster &&
        <section className="mt-4 rounded-card border border-ink-200 bg-ink-50 p-4">
            <p className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
              <UsersIcon className="h-4 w-4" aria-hidden="true" />
              Made by a cluster of {order.cluster.members.length} artisans
            </p>
            <ul className="mt-2 space-y-1.5">
              {order.cluster.members.map((m) =>
            <li
              key={m.name}
              className="flex items-center justify-between text-[13px] text-ink-700">
              
                  <span>{m.name}</span>
                  <span className="font-semibold">
                    {m.units} units · {m.done ? 'delivered' : 'in progress'}
                  </span>
                </li>
            )}
            </ul>
          </section>
        }

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-ink-200 bg-white text-[13px] font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
            
            <DownloadIcon className="h-4 w-4" aria-hidden="true" />
            Invoice
          </button>
          <button
            type="button"
            onClick={() => setShowDay1(true)}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-leaf-500 text-[13px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-leaf-600">
            
            Day-1 Financing
          </button>
        </div>

        <Day1PaymentModal
          isOpen={showDay1}
          onClose={() => setShowDay1(false)}
          orderId={order.id}
          orderTotal={order.amount}
        />

        {canReview &&
        <section className="mt-4 rounded-card border border-sand-300 bg-white p-4 shadow-card">
            <h2 className="text-[14px] font-bold text-ink-900">
              How was it? Your rating shapes their trust score.
            </h2>
            <div className="mt-2.5 flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) =>
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`Rate ${star} out of 5`}
              className="flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-150 ease-out hover:bg-sand-100">
              
                  <StarIcon
                className={
                'h-7 w-7 ' + (
                star <= rating ?
                'fill-gold-500 text-gold-500' :
                'text-sand-400')
                }
                aria-hidden="true" />
              
                </button>
            )}
            </div>
            <button
            type="button"
            disabled={rating === 0}
            className="mt-3 min-h-[48px] w-full rounded-full bg-clay-500 text-[15px] font-semibold text-white transition-colors duration-150 ease-out hover:bg-clay-600 disabled:bg-sand-300 disabled:text-ink-400">
            
              Submit review
            </button>
          </section>
        }
      </div>
    </div>);

}