import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { getRegistryItem } from '@/lib/registry';
import { gitConfig, siteUrl } from '@/lib/shared';
import { ComponentSource } from '@/components/component-source';

const managers = [
  { id: 'pnpm', run: 'pnpm dlx' },
  { id: 'npm', run: 'npx' },
  { id: 'yarn', run: 'yarn dlx' },
  { id: 'bun', run: 'bunx --bun' },
] as const;

/**
 * Installation section for a registry item: CLI commands for every package
 * manager (GitHub registry + hosted URL) and a manual tab with the source.
 */
export async function ComponentInstall({ name }: { name: string }) {
  const item = getRegistryItem(name);
  const githubAddress = `${gitConfig.user}/${gitConfig.repo}/${name}`;
  const hostedUrl = `${siteUrl}/r/${name}.json`;

  return (
    <Tabs items={['CLI', 'Manual']} defaultIndex={0}>
      <Tab value="CLI">
        <p className="mt-0">Install straight from the GitHub repository (no deploy needed):</p>
        <Tabs items={managers.map((m) => m.id)} persist>
          {managers.map((m) => (
            <Tab key={m.id} value={m.id}>
              <ServerCodeBlock code={`${m.run} shadcn@latest add ${githubAddress}`} lang="bash" />
            </Tab>
          ))}
        </Tabs>
        <p>Or from the hosted registry:</p>
        <ServerCodeBlock code={`npx shadcn@latest add ${hostedUrl}`} lang="bash" />
      </Tab>
      <Tab value="Manual">
        {item?.dependencies?.length ? (
          <>
            <p className="mt-0">Install dependencies:</p>
            <ServerCodeBlock code={`pnpm add ${item.dependencies.join(' ')}`} lang="bash" />
          </>
        ) : null}
        {item?.registryDependencies?.length ? (
          <>
            <p>Add the shadcn components it builds on:</p>
            <ServerCodeBlock code={`pnpm dlx shadcn@latest add ${item.registryDependencies.join(' ')}`} lang="bash" />
          </>
        ) : null}
        <p>Copy the source into your project and update import paths if needed:</p>
        <ComponentSource name={name} />
      </Tab>
    </Tabs>
  );
}
