import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnnotationPanel } from './AnnotationPanel';
import { ScreenRail } from './ScreenRail';

/**
 * Desktop review shell: screen index on the left, the 390dp device in the middle,
 * design annotations on the right. On a real phone the device fills the viewport.
 */
export function AppShell({ showAnnotations = true }: {showAnnotations?: boolean;}) {
  return (
    <div className="flex h-full w-full overflow-hidden bg-sand-200 paper-grain font-sans">
      <ScreenRail />
      <div className="flex min-w-0 flex-1 items-center justify-center gap-10 lg:px-8">
        <div className="relative h-full w-full overflow-hidden bg-sand-100 lg:h-[844px] lg:max-h-[calc(100vh-72px)] lg:w-[390px] lg:shrink-0 lg:rounded-[40px] lg:border-[10px] lg:border-ink-900 lg:shadow-frame">
          <Outlet />
        </div>
        {showAnnotations && <AnnotationPanel />}
      </div>
    </div>);

}