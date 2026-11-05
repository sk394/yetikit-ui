'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { docsRoute } from '@/lib/shared';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export type GalleryItem = {
  name: string;
  title: string;
  description?: string;
  categories: string[];
};

/** Searchable, filterable grid of registry items for the landing page. */
export function RegistryGallery({ items, categories }: { items: GalleryItem[]; categories: string[] }) {
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      if (category && !item.categories.includes(category)) return false;
      if (!q) return true;
      return [item.name, item.title, item.description ?? '', ...item.categories].join(' ').toLowerCase().includes(q);
    });
  }, [items, query, category]);

  return (
    <section id="components" className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search components…"
            aria-label="Search components"
            className="h-9 pl-8"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {items.length} components
        </p>
      </div>

      {categories.length ? (
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={category === null} onClick={() => setCategory(null)}>
            All
          </FilterChip>
          {categories.map((c) => (
            <FilterChip key={c} active={category === c} onClick={() => setCategory(category === c ? null : c)}>
              {c}
            </FilterChip>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Nothing matches. Try another search or category.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.name}>
              <Link
                href={`${docsRoute}/components/${item.name}`}
                className="group flex h-full flex-col gap-2 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/30 hover:bg-muted/40"
              >
                <span className="flex items-center justify-between gap-2 font-medium">
                  {item.title}
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                {item.description ? <span className="text-sm text-muted-foreground">{item.description}</span> : null}
                {item.categories.length ? (
                  <span className="mt-auto flex flex-wrap gap-1 pt-1">
                    {item.categories.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active ? 'border-foreground bg-foreground text-background' : 'hover:bg-muted',
      )}
    >
      {children}
    </button>
  );
}
