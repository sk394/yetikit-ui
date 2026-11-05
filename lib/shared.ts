import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'YetiKit UI';
export const appDescription =
  'A personal registry of advanced shadcn (Base UI) components, with docs and responsive live demos.';

export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';
export const previewRoute = '/preview';

/**
 * Where this site is deployed. Used to build `shadcn add <url>` commands.
 * Set NEXT_PUBLIC_SITE_URL in your hosting provider (no trailing slash).
 */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const gitConfig = {
  user: 'sk394',
  repo: 'yetikit-ui',
  branch: 'main',
};

export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
