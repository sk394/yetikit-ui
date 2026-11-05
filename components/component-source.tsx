import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { getItemSource, readRegistryFile } from '@/lib/registry';
import { CodeCollapsible } from '@/components/code-collapsible';

export type ComponentSourceProps = {
  /** Registry item name; renders its first file (usually `registry/ui/<name>.tsx`). */
  name?: string;
  /** Or an explicit path under `registry/`, e.g. `registry/hooks/use-thing.ts`. */
  src?: string;
  title?: string;
  /** Collapse long files behind an "Expand" button. */
  collapsible?: boolean;
};

/** Shows the source of a registry file as a highlighted code block. */
export async function ComponentSource({ name, src, title, collapsible = true }: ComponentSourceProps) {
  const code = src ? await readRegistryFile(src) : name ? await getItemSource(name) : null;
  const fileName = title ?? (src ? src.split('/').pop() : `${name}.tsx`);

  if (!code) {
    return (
      <div className="rounded-lg border border-dashed border-destructive/50 p-4 text-sm text-destructive">
        Source not found for <code>{src ?? name}</code>.
      </div>
    );
  }

  const lang = fileName?.split('.').pop() ?? 'tsx';
  const block = <ServerCodeBlock code={code} lang={lang} codeblock={{ title: fileName }} />;

  return collapsible ? <CodeCollapsible>{block}</CodeCollapsible> : block;
}
