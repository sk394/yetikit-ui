'use client';

import { Suspense } from 'react';
import { Index } from '@/registry/__index__';

/** Looks a demo up in the generated index and renders it on the client. */
export function DemoRenderer({ name }: { name: string }) {
  const entry = Index[name];
  if (!entry) return null;
  const Demo = entry.component;

  return (
    <Suspense fallback={<div className="h-24 w-full animate-pulse rounded-lg bg-muted" />}>
      <Demo />
    </Suspense>
  );
}
