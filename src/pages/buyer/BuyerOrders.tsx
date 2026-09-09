import React, { useState } from 'react';
import { ShoppingBagIcon } from 'lucide-react';
import { OrderCard } from '../../components/shared/OrderCard';
import { EmptyState } from '../../components/shared/EmptyState';
import { buyerOrders } from '../../data/orders';

type Filter = 'all' | 'active' | 'completed';

const filters: {id: Filter;label: string;}[] = [
{ id: 'all', label: 'All' },
{ id: 'active', label: 'Active' },
{ id: 'completed', label: 'Completed' }];


export function BuyerOrders() {
  const [filter, setFilter] = useState<Filter>('all');

  const orders = buyerOrders.filter((o) => {
    if (filter === 'active')
    return ['ordered', 'being-made', 'shipped'].includes(o.status);
    if (filter === 'completed') return ['delivered', 'paid'].includes(o.status);
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-6 lg:px-8">
      <header className="sticky top-0 z-20 border-b border-sand-300 bg-sand-100/95 px-4 pb-2.5 pt-3 backdrop-blur">
        <h1 className="text-xl font-bold text-ink-900">Orders</h1>
        <ul className="mt-2 flex gap-2" role="tablist" aria-label="Order filter">
          {filters.map((f) =>
          <li key={f.id}>
              <button
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={
              'min-h-[36px] rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-150 ease-out ' + (
              filter === f.id ?
              'border-ink-900 bg-ink-900 text-white' :
              'border-sand-400 bg-white text-ink-700 hover:bg-sand-200')
              }>
              
                {f.label}
              </button>
            </li>
          )}
        </ul>
      </header>

      <div className="space-y-3 px-4 pt-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {orders.length === 0 ?
        <EmptyState
          Icon={ShoppingBagIcon}
          title="No orders in this view"
          body="Switch the filter, or browse the discover feed to find something handmade." /> :


        orders.map((order) =>
        <OrderCard
          key={order.id}
          order={order}
          density="buyer"
          to={`/buyer/orders/${order.id}`} />

        )
        }
      </div>
    </div>);

}