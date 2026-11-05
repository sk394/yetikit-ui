import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { getExampleSource } from '@/lib/registry';
import { ComponentPreviewClient } from '@/components/component-preview-client';

export type ComponentPreviewProps = {
  /** Demo file name in `registry/examples/`, without the `.tsx` extension. */
  name: string;
  /** Optional short caption shown above the frame. */
  description?: string;
  /** Hide the "Code" tab. */
  hideCode?: boolean;
  /** Initial viewport when the page loads. */
  defaultViewport?: 'desktop' | 'tablet' | 'mobile';
  /** Minimum frame height in px. The frame grows with its content. */
  minHeight?: number;
  className?: string;
};

/**
 * Renders a demo inside a responsive iframe (desktop / tablet / mobile) with a
 * "Code" tab containing the demo's source.
 *
 * Usage in MDX: `<ComponentPreview name="stat-card-demo" />`
 */
export async function ComponentPreview({
  name,
  description,
  hideCode,
  defaultViewport,
  minHeight,
  className,
}: ComponentPreviewProps) {
  const code = await getExampleSource(name);

  if (!code) {
    return (
      <div className="rounded-lg border border-dashed border-destructive/50 p-4 text-sm text-destructive">
        Demo <code>{name}</code> not found. Create <code>registry/examples/{name}.tsx</code> and run{' '}
        <code>pnpm registry:index</code>.
      </div>
    );
  }

  const codeBlock = hideCode ? null : (
    <ServerCodeBlock code={code} lang="tsx" codeblock={{ title: `${name}.tsx`, className: 'my-0' }} />
  );

  return (
    <ComponentPreviewClient
      name={name}
      description={description}
      code={codeBlock}
      defaultViewport={defaultViewport}
      minHeight={minHeight}
      className={className}
    />
  );
}
