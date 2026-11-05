import { promises as fs } from 'node:fs';
import path from 'node:path';
import registry from '@/registry.json';

export type RegistryFile = {
  path: string;
  type: string;
  target?: string;
};

export type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  categories?: string[];
  files?: RegistryFile[];
  meta?: Record<string, unknown>;
};

export type RegistryManifest = {
  name: string;
  homepage?: string;
  items: RegistryItem[];
};

const manifest = registry as RegistryManifest;

const REGISTRY_DIR = path.join(process.cwd(), 'registry');

/** Every item declared in `registry.json`, in declaration order. */
export function getRegistryItems(): RegistryItem[] {
  return manifest.items;
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return manifest.items.find((item) => item.name === name);
}

/** All distinct categories used across registry items, sorted. */
export function getRegistryCategories(): string[] {
  const set = new Set<string>();
  for (const item of manifest.items) for (const c of item.categories ?? []) set.add(c);
  return [...set].sort();
}

/**
 * Read a file that lives under `registry/`. Paths outside the registry folder
 * are rejected so MDX can never read arbitrary files.
 */
export async function readRegistryFile(relativePath: string): Promise<string | null> {
  const normalized = relativePath.replace(/^registry\//, '');
  const absolute = path.resolve(REGISTRY_DIR, normalized);
  if (!absolute.startsWith(REGISTRY_DIR + path.sep)) return null;

  try {
    return await fs.readFile(absolute, 'utf8');
  } catch {
    return null;
  }
}

/** Source of a demo in `registry/examples/<name>.tsx`. */
export function getExampleSource(name: string) {
  return readRegistryFile(path.join('examples', `${name}.tsx`));
}

/** Source of the first file of a registry item (usually `registry/ui/<name>.tsx`). */
export async function getItemSource(name: string) {
  const item = getRegistryItem(name);
  const file = item?.files?.[0];
  if (!file) return readRegistryFile(path.join('ui', `${name}.tsx`));
  return readRegistryFile(file.path);
}
