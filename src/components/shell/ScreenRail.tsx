import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpenIcon,
  CloudOffIcon,
  CpuIcon,
  LayoutGridIcon,
  Volume2Icon,
  VolumeXIcon,
  WifiIcon,
  WorkflowIcon } from
'lucide-react';
import { useApp } from '../../contexts/AppContext';

const artisanScreens = [
{ to: '/', label: 'Role select' },
{ to: '/language', label: 'Language' },
{ to: '/artisan/signup', label: 'Voice signup' },
{ to: '/artisan/home', label: 'Home' },
{ to: '/artisan/add', label: 'Add product (4 steps)' },
{ to: '/artisan/orders', label: 'My orders' },
{ to: '/artisan/orders/ao2', label: 'Order detail (cluster)' },
{ to: '/artisan/account', label: 'My account' },
{ to: '/artisan/notification/n1', label: 'Scheme detail' }];


const buyerScreens = [
{ to: '/buyer/signup', label: 'Signup + account type' },
{ to: '/buyer/discover', label: 'Discover feed' },
{ to: '/buyer/search', label: 'Search + filters' },
{ to: '/buyer/product/p1', label: 'Product detail' },
{ to: '/buyer/artisan/a2', label: 'Artisan profile' },
{ to: '/buyer/request', label: 'Post a request (B2B)' },
{ to: '/buyer/orders', label: 'Orders' },
{ to: '/buyer/orders/bo3', label: 'Order detail' },
{ to: '/buyer/account', label: 'Account' }];


const docs = [
{ to: '/library', label: 'Component library', Icon: LayoutGridIcon },
{ to: '/voice-flow', label: 'Voice flow diagram', Icon: WorkflowIcon },
{ to: '/admin/audit-log', label: 'AI Audit Trail & Safety', Icon: CpuIcon }];


export function ScreenRail() {
  const { soundOn, setSoundOn, online, setOnline } = useApp();

  return (
    <aside className="hidden w-[268px] shrink-0 flex-col overflow-y-auto border-r border-sand-400 bg-white/70 px-5 py-8 lg:flex">
      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-clay-500 text-white">
          <BookOpenIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-ink-900">Saanjh</p>
          <p className="text-xs text-ink-500">Market linkage for artisans</p>
        </div>
      </div>

      <RailGroup title="Artisan mode" items={artisanScreens} />
      <RailGroup title="Buyer mode" items={buyerScreens} />

      <p className="mb-2 mt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
        Deliverables
      </p>
      <ul className="space-y-1">
        {docs.map(({ to, label, Icon }) =>
        <li key={to}>
            <NavLink
            to={to}
            className={({ isActive }) =>
            'flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 ease-out ' + (
            isActive ?
            'bg-ink-900 text-white' :
            'text-ink-700 hover:bg-sand-200')
            }>
            
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        )}
      </ul>

      <div className="mt-6 space-y-2 border-t border-sand-300 pt-4">
        <ToggleRow
          on={soundOn}
          onChange={setSoundOn}
          onLabel="Voice output on"
          offLabel="Voice output muted"
          OnIcon={Volume2Icon}
          OffIcon={VolumeXIcon} />
        
        <ToggleRow
          on={!online}
          onChange={(v) => setOnline(!v)}
          onLabel="Offline state"
          offLabel="Simulate offline"
          OnIcon={CloudOffIcon}
          OffIcon={WifiIcon} />
        
      </div>
    </aside>);

}

function RailGroup({
  title,
  items



}: {title: string;items: {to: string;label: string;}[];}) {
  return (
    <>
      <p className="mb-2 mt-7 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-400">
        {title}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) =>
        <li key={item.to}>
            <NavLink
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            'block rounded-lg px-2.5 py-1.5 text-[13px] transition-colors duration-150 ease-out ' + (
            isActive ?
            'bg-clay-50 font-semibold text-clay-700' :
            'text-ink-600 hover:bg-sand-200')
            }>
            
              {item.label}
            </NavLink>
          </li>
        )}
      </ul>
    </>);

}

function ToggleRow({
  on,
  onChange,
  onLabel,
  offLabel,
  OnIcon,
  OffIcon







}: {on: boolean;onChange: (value: boolean) => void;onLabel: string;offLabel: string;OnIcon: typeof WifiIcon;OffIcon: typeof WifiIcon;}) {
  const Icon = on ? OnIcon : OffIcon;
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-pressed={on}
      className={
      'flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-[13px] font-medium transition-colors duration-150 ease-out ' + (
      on ?
      'border-clay-200 bg-clay-50 text-clay-700' :
      'border-sand-300 bg-white text-ink-600 hover:bg-sand-100')
      }>
      
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {on ? onLabel : offLabel}
      </span>
      <span
        className={
        'flex h-5 w-9 items-center rounded-full px-0.5 transition-colors duration-150 ease-out ' + (
        on ? 'bg-clay-500' : 'bg-sand-400')
        }
        aria-hidden="true">
        
        <span
          className={
          'h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-out ' + (
          on ? 'translate-x-4' : 'translate-x-0')
          } />
        
      </span>
    </button>);

}