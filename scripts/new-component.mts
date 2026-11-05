/**
 * Scaffold a new registry component with a demo and a docs page.
 *
 * Usage:
 *   pnpm new:component <name> [--title "Title"] [--description "..."] [--category a,b]
 *
 * Example:
 *   pnpm new:component fancy-tabs --title "Fancy Tabs" --category navigation,advanced
 *
 * Creates:
 *   registry/ui/<name>.tsx              the component
 *   registry/examples/<name>-demo.tsx   the demo rendered in docs + preview
 *   content/docs/components/<name>.mdx  the docs page
 * and appends an item to registry.json, then regenerates registry/__index__.tsx.
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);

function flag(name: string): string | undefined {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return undefined;
  return args[index + 1];
}

const name = args.find((arg) => !arg.startsWith('--') && args[args.indexOf(arg) - 1]?.startsWith('--') !== true);

if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
  console.error('Usage: pnpm new:component <kebab-case-name> [--title "Title"] [--description "..."] [--category a,b]');
  process.exit(1);
}

const pascal = name
  .split('-')
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join('');
const title = flag('title') ?? pascal.replace(/([a-z])([A-Z])/g, '$1 $2');
const description = flag('description') ?? `${title} component.`;
const categories = (flag('category') ?? '')
  .split(',')
  .map((c) => c.trim())
  .filter(Boolean);

const uiPath = path.join(root, 'registry', 'ui', `${name}.tsx`);
const demoPath = path.join(root, 'registry', 'examples', `${name}-demo.tsx`);
const docPath = path.join(root, 'content', 'docs', 'components', `${name}.mdx`);
const manifestPath = path.join(root, 'registry.json');

for (const file of [uiPath, demoPath, docPath]) {
  if (existsSync(file)) {
    console.error(`Refusing to overwrite existing file: ${path.relative(root, file)}`);
    process.exit(1);
  }
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
  items: { name: string; [key: string]: unknown }[];
};
if (manifest.items.some((item) => item.name === name)) {
  console.error(`registry.json already has an item named "${name}"`);
  process.exit(1);
}

mkdirSync(path.dirname(uiPath), { recursive: true });
mkdirSync(path.dirname(demoPath), { recursive: true });
mkdirSync(path.dirname(docPath), { recursive: true });

writeFileSync(
  uiPath,
  `import * as React from 'react';
import { cn } from '@/lib/utils';

export type ${pascal}Props = React.ComponentProps<'div'>;

function ${pascal}({ className, ...props }: ${pascal}Props) {
  return (
    <div
      data-slot="${name}"
      className={cn('rounded-lg border bg-card p-4 text-card-foreground', className)}
      {...props}
    />
  );
}

export { ${pascal} };
`,
);

writeFileSync(
  demoPath,
  `import { ${pascal} } from '@/registry/ui/${name}';

export default function ${pascal}Demo() {
  return <${pascal}>Hello from ${title}</${pascal}>;
}
`,
);

writeFileSync(
  docPath,
  `---
title: ${title}
description: ${description}
---

<ComponentPreview name="${name}-demo" />

## Installation

<ComponentInstall name="${name}" />

## Usage

\`\`\`tsx
import { ${pascal} } from '@/components/ui/${name}';
\`\`\`

\`\`\`tsx
<${pascal}>Hello</${pascal}>
\`\`\`

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`className\` | \`string\` | – | Extra classes merged onto the root element. |
`,
);

manifest.items.push({
  name,
  type: 'registry:ui',
  title,
  description,
  ...(categories.length ? { categories } : {}),
  files: [{ path: `registry/ui/${name}.tsx`, type: 'registry:ui' }],
});
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

execSync('pnpm exec tsx scripts/build-registry.mts --index-only', { stdio: 'inherit', cwd: root });

console.log(`
✔ Created ${name}

  registry/ui/${name}.tsx
  registry/examples/${name}-demo.tsx
  content/docs/components/${name}.mdx
  registry.json (new item)

Next:
  1. Build the component in registry/ui/${name}.tsx
  2. Make the demo in registry/examples/${name}-demo.tsx show it off
  3. Add dependencies / registryDependencies to its entry in registry.json
  4. pnpm dev → http://localhost:3000/docs/components/${name}
`);
