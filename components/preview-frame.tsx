'use client';

import * as React from 'react';
import type { PreviewMeasureMessage, PreviewResizeMessage } from '@/components/component-preview-client';

/**
 * Wraps a demo inside the `/preview/[name]` route and reports its rendered
 * height to the parent document so the docs iframe can auto-size.
 */
export function PreviewFrame({ name, children }: { name: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node || window.parent === window) return;

    const report = () => {
      const message: PreviewResizeMessage = {
        type: 'yetikit:resize',
        name,
        height: node.getBoundingClientRect().height,
      };
      window.parent.postMessage(message, '*');
    };

    const onMessage = (event: MessageEvent<PreviewMeasureMessage>) => {
      if (event.data?.type === 'yetikit:measure' && event.data.name === name) report();
    };

    report();
    const observer = new ResizeObserver(report);
    observer.observe(node);
    window.addEventListener('message', onMessage);
    return () => {
      observer.disconnect();
      window.removeEventListener('message', onMessage);
    };
  }, [name]);

  return (
    <div ref={ref} data-preview={name} className="flex min-h-60 w-full items-center justify-center p-6 sm:p-8">
      {children}
    </div>
  );
}
