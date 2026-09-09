import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ClipboardListIcon,
  CompassIcon,
  SearchIcon,
  ShoppingBagIcon,
  UserIcon,
} from 'lucide-react';

const navLinks = [
  { to: '/buyer/discover', label: 'Discover', Icon: CompassIcon },
  { to: '/buyer/search', label: 'Search', Icon: SearchIcon },
  { to: '/buyer/request', label: 'Request', Icon: ClipboardListIcon },
  { to: '/buyer/orders', label: 'Orders', Icon: ShoppingBagIcon },
  { to: '/buyer/account', label: 'Account', Icon: UserIcon },
];

/**
 * Horizontal top navigation bar for buyer mode on desktop (≥ 1024px).
 * Hidden on mobile — the bottom BuyerTabBar handles navigation there.
 */
export function BuyerTopNav() {
  return (
    <nav
      aria-label="Main"
      className="hidden lg:flex shrink-0 items-center justify-between border-b border-sand-300 bg-white/80 backdrop-blur px-8 py-0"
    >
      {/* Brand */}
      <Link to="/buyer/discover" className="flex items-center gap-2.5 py-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-clay-500 text-white">
          <CompassIcon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="text-lg font-bold text-ink-900">Saanjh</span>
      </Link>

      {/* Nav links */}
      <ul className="flex items-center gap-1">
        {navLinks.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ease-out ' +
                (isActive
                  ? 'bg-clay-50 text-clay-700'
                  : 'text-ink-600 hover:bg-sand-200 hover:text-ink-900')
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
