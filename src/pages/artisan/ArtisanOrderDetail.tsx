import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  UsersIcon,
  Volume2Icon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { OrderTracker } from '../../components/shared/OrderTracker';
import { StatusChip } from '../../components/shared/StatusChip';
import { Day1PaymentModal } from '../../components/shared/Day1PaymentModal';
import { artisanOrders, statusMeta } from '../../data/orders';
import { productById } from '../../data/products';

export function ArtisanOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { speak } = useApp();
  const [showDay1, setShowDay1] = useState(false);
  const order = artisanOrders.find((o) => o.id === orderId);
  const product = order ? productById(order.productId) : undefined;

  if (!order || !product) {
    return (
      <div className="p-6">
        <p className="text-artisan-body text-ink-700">
          That order is not here any more.
        </p>
        <Link
          to="/artisan/orders"
          className="mt-4 inline-flex min-h-[56px] items-center rounded-full bg-clay-500 px-6 text-lg font-bold text-white">
          
          Back to my orders
        </Link>
      </div>);

  }

  const spoken = `${product.title}, for ${order.counterpartName} in ${order.counterpartLocation}. Amount ${order.amount} rupees. Right now it is ${statusMeta[order.status].label}.`;

  return (
    <div className="mx-auto max-w-3xl pb-40 lg:px-8">
      <header className="flex items-center gap-3 border-b border-sand-300 bg-white px-3 py-3">
        <button
          type="button"
          onClick={() => navigate('/artisan/orders')}
          aria-label="Go back to my orders"
          className="flex h-[56px] w-[56px] items-center justify-center rounded-full text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-100">
          
          <ArrowLeftIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <h1 className="text-[22px] font-bold text-ink-900">This order</h1>
      </header>

      <div className="px-4 pt-4">
        <div className="flex gap-4 rounded-card border border-sand-300 bg-white p-4 shadow-card">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
          
          <div className="min-w-0 flex-1">
            <p className="text-artisan-body font-bold leading-6 text-ink-900">
              {product.title}
            </p>
            <p className="mt-1 text-base text-ink-600">
              {order.counterpartName} · {order.counterpartLocation}
            </p>
            <p className="mt-1 text-[26px] font-bold leading-8 text-ink-900">
              ₹{order.amount.toLocaleString('en-IN')}
            </p>
            <p className="text-base text-ink-500">
              {order.quantity} piece{order.quantity > 1 ? 's' : ''} ·{' '}
              {order.placedOn}
            </p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => speak(spoken)}
            className="flex min-h-[56px] items-center justify-center gap-2 rounded-full border-2 border-ink-900 text-base font-bold text-ink-900 transition-colors duration-150 ease-out hover:bg-sand-200">
            
            <Volume2Icon className="h-5 w-5" aria-hidden="true" />
            Read to me
          </button>
          <button
            type="button"
            onClick={() => setShowDay1(true)}
            className="flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-leaf-500 text-base font-bold text-white transition-colors duration-150 ease-out hover:bg-leaf-600">
            Day-1 Advance
          </button>
        </div>

        <Day1PaymentModal
          isOpen={showDay1}
          onClose={() => setShowDay1(false)}
          orderId={order.id}
          orderTotal={order.amount}
        />

        {order.cluster &&
        <section className="mt-4 rounded-card border-2 border-ink-200 bg-white p-4">
            <p className="flex items-center gap-2 text-artisan-body font-bold text-ink-900">
              <UsersIcon className="h-6 w-6 text-ink-700" aria-hidden="true" />
              You + {order.cluster.othersCount} others are making this together
            </p>
            <ul className="mt-3 space-y-2">
              {order.cluster.members.map((m) =>
            <li
              key={m.name}
              className="flex items-center gap-3 rounded-xl bg-sand-100 px-3 py-2.5">
              
                  <span
                className={
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full ' + (
                m.done ?
                'bg-leaf-500 text-white' :
                'bg-gold-500 text-white')
                }>
                
                    {m.done ?
                <CheckIcon className="h-6 w-6" aria-hidden="true" /> :

                <ClockIcon className="h-6 w-6" aria-hidden="true" />
                }
                  </span>
                  <span className="flex-1 text-base font-semibold text-ink-900">
                    {m.name}
                  </span>
                  <span className="text-base text-ink-600">
                    {m.units} pieces · {m.done ? 'done' : 'making'}
                  </span>
                </li>
            )}
            </ul>
          </section>
        }

        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-artisan-label font-bold text-ink-900">
              Where it is now
            </h2>
            <StatusChip status={order.status} size="lg" />
          </div>
          <OrderTracker
            status={order.status}
            orientation="vertical"
            notes={{
              ordered: `${order.counterpartName} placed this on ${order.placedOn}.`,
              'being-made': 'You are working on it. Nothing needed from us.',
              shipped: 'Hand the bundle to the pickup agent.',
              delivered: 'The buyer has it.',
              paid: 'Money reaches your account within 24 hours.'
            }} />
          
        </section>
      </div>
    </div>);

}