import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false },
};

/** Bare layout for `/preview/[name]`: no navigation, just the demo. */
export default function PreviewLayout({ children }: LayoutProps<'/preview'>) {
  return <>{children}</>;
}
