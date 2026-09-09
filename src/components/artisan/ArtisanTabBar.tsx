import React from 'react';
import { NavLink } from 'react-router-dom';
import { CameraIcon, HomeIcon, PackageIcon, UserIcon } from 'lucide-react';

const tabs = [
{ to: '/artisan/home', label: 'Home', Icon: HomeIcon },
{ to: '/artisan/orders', label: 'My orders', Icon: PackageIcon },
{ to: '/artisan/account', label: 'My account', Icon: UserIcon }];


export function ArtisanTabBar() {
  return (
    <nav
      aria-label="Main"
      className="relative z-30 shrink-0 border-t border-ink-800 bg-ink-900 pb-2 pt-2 lg:hidden">
      
      <ul className="flex items-end justify-around px-2">
        <TabItem {...tabs[0]} />
        <li className="-mt-9">
          <NavLink
            to="/artisan/add"
            className={({ isActive }) =>
            'flex h-[88px] w-[88px] flex-col items-center justify-center gap-1 rounded-full border-4 border-ink-900 text-white shadow-lift transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' + (
            isActive ? 'bg-clay-600' : 'bg-clay-500 hover:bg-clay-600')
            }>
            
            <CameraIcon className="h-9 w-9" aria-hidden="true" />
            <span className="text-[13px] font-bold leading-none">Add</span>
          </NavLink>
        </li>
        <TabItem {...tabs[1]} />
        <TabItem {...tabs[2]} />
      </ul>
    </nav>);

}

function TabItem({
  to,
  label,
  Icon




}: {to: string;label: string;Icon: typeof HomeIcon;}) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
        'flex min-h-[56px] min-w-[64px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-clay-300 ' + (
        isActive ? 'bg-white/10 text-white' : 'text-ink-300 hover:text-white')
        }>
        
        {({ isActive }) =>
        <>
            <Icon
            className={'h-7 w-7 ' + (isActive ? 'fill-clay-500 text-clay-400' : '')}
            aria-hidden="true" />
          
            <span className="text-[13px] font-semibold leading-none">{label}</span>
          </>
        }
      </NavLink>
    </li>);

}