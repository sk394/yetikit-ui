import { notFound } from 'next/navigation';
import { DemoRenderer } from '@/components/demo-renderer';
import { PreviewFrame } from '@/components/preview-frame';
import { demoNames } from '@/registry/__names__';

export const dynamicParams = false;

export function generateStaticParams() {
  return demoNames.map((name) => ({ name }));
}

export async function generateMetadata(props: PageProps<'/preview/[name]'>) {
  const { name } = await props.params;
  return { title: `${name} preview` };
}

/** Renders one demo on a blank page. Embedded by `<ComponentPreview />` via an iframe. */
export default async function PreviewPage(props: PageProps<'/preview/[name]'>) {
  const { name } = await props.params;
  if (!(demoNames as readonly string[]).includes(name)) notFound();

  return (
    <PreviewFrame name={name}>
      <DemoRenderer name={name} />
    </PreviewFrame>
  );
}
