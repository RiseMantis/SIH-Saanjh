import React from 'react';
import { Outlet } from 'react-router-dom';
import { BuyerTabBar } from '../buyer/BuyerTabBar';
import { OfflineBanner } from '../shared/OfflineBanner';
import { VoiceCaption } from '../shared/VoiceCaption';

export function BuyerLayout() {
  return (
    <div className="relative flex h-full flex-col bg-sand-100 font-sans">
      <OfflineBanner density="buyer" />
      <main className="screen-scroll flex-1">
        <Outlet />
      </main>
      <VoiceCaption offset="none" />
      <BuyerTabBar />
    </div>);

}