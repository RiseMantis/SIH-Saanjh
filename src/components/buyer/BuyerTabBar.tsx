import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ClipboardListIcon,
  CompassIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon } from
'lucide-react';

const tabs = [
{ to: '/buyer/discover', label: 'Discover', Icon: CompassIcon },
{ to: '/buyer/search', label: 'Search', Icon: SearchIcon },
{ to: '/buyer/request', label: 'Request', Icon: ClipboardListIcon },
{ to: '/buyer/orders', label: 'Orders', Icon: ShoppingBagIcon },
{ to: '/buyer/account', label: 'Account', Icon: UserIcon }];


export function BuyerTabBar() {
  return (
    <nav
      aria-label="Main"
      className="relative z-30 shrink-0 border-t border-ink-800 bg-ink-900 px-1 py-1.5 lg:hidden">
      
      <ul className="flex items-stretch justify-around">
        {tabs.map(({ to, label, Icon }) =>
        <li key={to} className="flex-1">
            <NavLink
            to={to}
            className={({ isActive }) =>
            'flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-300 ' + (
            isActive ? 'text-white' : 'text-ink-400 hover:text-ink-100')
            }>
            
              {({ isActive }) =>
            <>
                  <Icon
                className={'h-5 w-5 ' + (isActive ? 'text-clay-400' : '')}
                aria-hidden="true" />
              
                  <span className="text-[11px] font-medium leading-none">{label}</span>
                </>
            }
            </NavLink>
          </li>
        )}
      </ul>
    </nav>);

}