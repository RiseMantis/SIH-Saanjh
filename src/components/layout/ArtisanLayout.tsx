import React from 'react';
import { Outlet } from 'react-router-dom';
import { ArtisanTabBar } from '../artisan/ArtisanTabBar';
import { FloatingAssistant } from '../artisan/FloatingAssistant';
import { OfflineBanner } from '../shared/OfflineBanner';
import { VoiceCaption } from '../shared/VoiceCaption';

export function ArtisanLayout() {
  return (
    <div className="relative flex h-full flex-col bg-sand-100 font-sans">
      <OfflineBanner density="artisan" />
      <main className="screen-scroll flex-1">
        <Outlet />
      </main>
      <VoiceCaption />
      <FloatingAssistant />
      <ArtisanTabBar />
    </div>);

}