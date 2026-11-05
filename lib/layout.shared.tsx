import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Mountain } from 'lucide-react';
import { appName, docsRoute, githubUrl } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <Mountain className="size-4" aria-hidden />
          {appName}
        </span>
      ),
    },
    links: [
      { text: 'Docs', url: docsRoute, active: 'nested-url' },
      { text: 'Components', url: `${docsRoute}/components`, active: 'nested-url' },
    ],
    githubUrl,
  };
}
