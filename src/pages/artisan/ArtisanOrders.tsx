import React, { useState } from 'react';
import { PackageIcon } from 'lucide-react';
import { useAmbientPrompt } from '../../hooks/useAmbientPrompt';
import { OrderCard } from '../../components/shared/OrderCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { artisanOrders } from '../../data/orders';

type Filter = 'ongoing' | 'completed';

export function ArtisanOrders() {
  const [filter, setFilter] = useState<Filter>('ongoing');
  useAmbientPrompt(
    'These are your orders. Two are still being made. Tap any order and I will read it to you.'
  );

  const orders = artisanOrders.filter((o) =>
  filter === 'ongoing' ?
  o.status === 'ordered' || o.status === 'being-made' || o.status === 'shipped' :
  o.status === 'delivered' || o.status === 'paid'
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-40 pt-4 lg:px-8">
      <h1 className="text-[26px] font-bold text-ink-900">My orders</h1>

      <div className="mt-3 flex gap-3" role="tablist" aria-label="Order filter">
        {(['ongoing', 'completed'] as Filter[]).map((f) =>
        <button
          key={f}
          type="button"
          role="tab"
          aria-selected={filter === f}
          onClick={() => setFilter(f)}
          className={
          'min-h-[56px] flex-1 rounded-full border-2 text-artisan-body font-bold capitalize transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' + (
          filter === f ?
          'border-ink-900 bg-ink-900 text-white' :
          'border-sand-400 bg-white text-ink-800 hover:bg-sand-200')
          }>
          
            {f}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {orders.length === 0 ?
        <EmptyState
          Icon={PackageIcon}
          density="artisan"
          title="No orders here yet"
          body="When someone buys your work, it will show up here with a photo you will recognise."
          spoken="You have no orders in this list yet. When someone buys your work, I will tell you." /> :


        orders.map((order) =>
        <OrderCard
          key={order.id}
          order={order}
          density="artisan"
          to={`/artisan/orders/${order.id}`} />

        )
        }
      </div>
    </div>);

}