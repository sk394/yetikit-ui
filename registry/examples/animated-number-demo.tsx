'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedNumber } from '@/registry/ui/animated-number';

export default function AnimatedNumberDemo() {
  const [value, setValue] = React.useState(128_430);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Monthly active users</p>
        <AnimatedNumber value={value} className="text-5xl font-semibold tracking-tight" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setValue((v) => v + Math.round(Math.random() * 25_000))}>
          Increase
        </Button>
        <Button variant="outline" onClick={() => setValue(0)}>
          Reset
        </Button>
      </div>
    </div>
  );
}
