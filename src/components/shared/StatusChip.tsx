import React from 'react';
import {
  CheckCircle2Icon,
  ClockIcon,
  HammerIcon,
  IndianRupeeIcon,
  TruckIcon } from
'lucide-react';
import type { OrderStatus } from '../../types';

const config: Record<
  OrderStatus,
  {label: string;className: string;Icon: typeof ClockIcon;}> =
{
  ordered: {
    label: 'Ordered',
    className: 'bg-gold-50 text-gold-700 border-gold-100',
    Icon: ClockIcon
  },
  'being-made': {
    label: 'Being made',
    className: 'bg-clay-50 text-clay-700 border-clay-100',
    Icon: HammerIcon
  },
  shipped: {
    label: 'Shipped',
    className: 'bg-ink-50 text-ink-800 border-ink-200',
    Icon: TruckIcon
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-leaf-50 text-leaf-700 border-leaf-100',
    Icon: CheckCircle2Icon
  },
  paid: {
    label: 'Paid',
    className: 'bg-leaf-50 text-leaf-700 border-leaf-100',
    Icon: IndianRupeeIcon
  }
};

export function StatusChip({
  status,
  size = 'sm'



}: {status: OrderStatus;size?: 'sm' | 'lg';}) {
  const { label, className, Icon } = config[status];
  return (
    <span
      className={
      'inline-flex items-center gap-2 rounded-full border font-semibold ' +
      className + (
      size === 'lg' ? ' px-3.5 py-2 text-lg' : ' px-2.5 py-1 text-xs')
      }>
      
      <Icon className={size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'} aria-hidden="true" />
      {label}
    </span>);

}

export const statusLabel = (status: OrderStatus) => config[status].label;
export const statusIcon = (status: OrderStatus) => config[status].Icon;