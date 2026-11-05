'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type AnimatedNumberProps = Omit<React.ComponentProps<'span'>, 'children'> & {
  /** Target value to count to. */
  value: number;
  /** Animation length in milliseconds. */
  duration?: number;
  /** Start counting only once the element is visible. */
  startOnView?: boolean;
  /** Custom formatter. Defaults to `Intl.NumberFormat` for the current locale. */
  format?: (value: number) => string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function AnimatedNumber({
  value,
  duration = 1200,
  startOnView = true,
  format,
  className,
  ...props
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = React.useState(0);
  const [active, setActive] = React.useState(!startOnView);

  React.useEffect(() => {
    if (!startOnView || active) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [startOnView, active]);

  const displayRef = React.useRef(0);

  React.useEffect(() => {
    if (!active) return;

    let frame = 0;
    const from = displayRef.current;
    const reduceMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = reduceMotion ? 1 : Math.min((now - start) / duration, 1);
      const next = from + (value - from) * easeOutCubic(progress);
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, duration]);

  const formatter = React.useMemo(
    () => format ?? ((n: number) => new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n)),
    [format],
  );

  return (
    <span ref={ref} data-slot="animated-number" className={cn('tabular-nums', className)} {...props}>
      {formatter(display)}
    </span>
  );
}

export { AnimatedNumber };
