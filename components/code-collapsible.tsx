'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/** Clamps tall code blocks and adds an Expand / Collapse toggle. */
export function CodeCollapsible({ children, maxHeight = 360 }: { children: React.ReactNode; maxHeight?: number }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <div
        className={cn('overflow-hidden transition-[max-height]', !open && '[&_pre]:overflow-hidden')}
        style={{ maxHeight: open ? undefined : maxHeight }}
      >
        {children}
      </div>
      {!open ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 rounded-b-xl bg-linear-to-b from-transparent to-background" />
      ) : null}
      <div className={cn('flex justify-center', open ? 'mt-2' : 'absolute inset-x-0 bottom-3')}>
        <Button variant="outline" size="sm" onClick={() => setOpen((o) => !o)}>
          {open ? 'Collapse' : 'Expand'}
        </Button>
      </div>
    </div>
  );
}
