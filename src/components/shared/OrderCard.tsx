import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, UsersIcon } from 'lucide-react';
import type { Order } from '../../types';
import { productById } from '../../data/products';
import { StatusChip } from './StatusChip';

interface OrderCardProps {
  order: Order;
  density: 'artisan' | 'buyer';
  to: string;
}

export function OrderCard({ order, density, to }: OrderCardProps) {
  const product = productById(order.productId);
  const artisan = density === 'artisan';

  return (
    <Link
      to={to}
      className={
      'flex items-center gap-3 rounded-card border bg-white shadow-card transition-[border-color,transform] duration-150 ease-out active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' + (
      artisan ?
      'min-h-[112px] gap-4 border-sand-300 p-3.5 hover:border-clay-300' :
      'border-sand-300 p-3 hover:border-clay-300')
      }>
      
      <img
        src={product?.images[0]}
        alt={product?.title ?? ''}
        className={
        'shrink-0 rounded-xl object-cover ' + (
        artisan ? 'h-24 w-24' : 'h-16 w-16')
        } />
      
      <div className="min-w-0 flex-1">
        <p
          className={
          'truncate font-semibold text-ink-900 ' + (
          artisan ? 'text-artisan-body' : 'text-sm')
          }>
          
          {product?.title}
        </p>
        <p
          className={
          'truncate text-ink-600 ' + (artisan ? 'text-base' : 'text-xs')
          }>
          
          {order.counterpartName} · {order.counterpartLocation}
        </p>
        <div
          className={
          'flex flex-wrap items-center gap-2 ' + (artisan ? 'mt-2' : 'mt-1.5')
          }>
          
          <StatusChip status={order.status} size={artisan ? 'lg' : 'sm'} />
          <span
            className={
            'font-bold text-ink-900 ' + (artisan ? 'text-xl' : 'text-sm')
            }>
            
            ₹{order.amount.toLocaleString('en-IN')}
          </span>
        </div>
        {order.cluster &&
        <p
          className={
          'mt-2 inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-2.5 py-1 font-medium text-ink-800 ' + (
          artisan ? 'text-sm' : 'text-[11px]')
          }>
          
            <UsersIcon
            className={artisan ? 'h-4 w-4' : 'h-3 w-3'}
            aria-hidden="true" />
          
            {artisan ?
          `You + ${order.cluster.othersCount} others` :
          `Group order · ${order.cluster.members.length} artisans`}
          </p>
        }
      </div>
      <ChevronRightIcon
        className={'shrink-0 text-ink-300 ' + (artisan ? 'h-7 w-7' : 'h-5 w-5')}
        aria-hidden="true" />
      
    </Link>);

}