import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { RegistryGallery } from '@/components/registry-gallery';
import { Button } from '@/components/ui/button';
import { getRegistryCategories, getRegistryItems } from '@/lib/registry';
import { appDescription, appName, docsRoute, githubUrl } from '@/lib/shared';

export default function HomePage() {
  const items = getRegistryItems().map((item) => ({
    name: item.name,
    title: item.title ?? item.name,
    description: item.description,
    categories: item.categories ?? [],
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-12 md:py-16">
      <section className="flex flex-col items-start gap-5">
        <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">{appName}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground text-pretty">{appDescription}</p>
        <div className="flex flex-wrap gap-2">
          <Button nativeButton={false} render={<Link href={docsRoute} />}>
            Read the docs
            <ArrowRight data-icon="inline-end" />
          </Button>
          <Button variant="outline" nativeButton={false} render={<a href={githubUrl} target="_blank" rel="noreferrer" />}>
            <ExternalLink data-icon="inline-start" />
            GitHub
          </Button>
        </div>
      </section>

      <RegistryGallery items={items} categories={getRegistryCategories()} />
    </div>
  );
}
