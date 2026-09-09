import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Full-viewport app shell. Renders route content directly without
 * any device-frame simulation or sidebar navigation.
 *
 * Previously this component wrapped content in a 390×844 "phone mockup"
 * with a ScreenRail sidebar and AnnotationPanel — those are now removed
 * in favour of a truly responsive layout.
 */
export function AppShell() {
  return (
    <div className="flex h-full w-full flex-col bg-sand-100 font-sans">
      <Outlet />
    </div>
  );
}