'use client';

import * as React from 'react';
import { ExternalLink, Monitor, RotateCw, Smartphone, Tablet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { previewRoute } from '@/lib/shared';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type Viewport = 'desktop' | 'tablet' | 'mobile';

/** Preset widths. `null` means "fill the available width". */
export const VIEWPORTS: Record<
  Viewport,
  { label: string; width: number | null; icon: React.ComponentType<{ className?: string }> }
> = {
  desktop: { label: 'Desktop', width: null, icon: Monitor },
  tablet: { label: 'Tablet', width: 768, icon: Tablet },
  mobile: { label: 'Mobile', width: 390, icon: Smartphone },
};

/** Posted by the preview page whenever its content height changes. */
export type PreviewResizeMessage = { type: 'yetikit:resize'; name: string; height: number };
/** Posted by the docs page to ask the preview for its current height. */
export type PreviewMeasureMessage = { type: 'yetikit:measure'; name: string };

export function ComponentPreviewClient({
  name,
  description,
  code,
  defaultViewport = 'desktop',
  minHeight = 240,
  className,
}: {
  name: string;
  description?: string;
  code: React.ReactNode;
  defaultViewport?: Viewport;
  minHeight?: number;
  className?: string;
}) {
  const [viewport, setViewport] = React.useState<Viewport>(defaultViewport);
  const [frameKey, setFrameKey] = React.useState(0);
  const [contentHeight, setContentHeight] = React.useState(minHeight);
  const [containerWidth, setContainerWidth] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const frameRef = React.useRef<HTMLIFrameElement>(null);
  const src = `${previewRoute}/${name}`;

  // Height reported by the preview page.
  React.useEffect(() => {
    const onMessage = (event: MessageEvent<PreviewResizeMessage>) => {
      const data = event.data;
      if (!data || data.type !== 'yetikit:resize' || data.name !== name) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      setContentHeight(Math.max(minHeight, Math.ceil(data.height)));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [name, minHeight]);

  // Available width, so wide presets can be scaled down to fit.
  React.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setContainerWidth(Math.floor(entry.contentRect.width)));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // The preview may have reported before this component hydrated (and the
  // iframe's load event may have fired before React attached its handler), so
  // ask for a measurement both on mount and on every load.
  const requestMeasure = React.useCallback(() => {
    const message: PreviewMeasureMessage = { type: 'yetikit:measure', name };
    frameRef.current?.contentWindow?.postMessage(message, '*');
  }, [name]);

  React.useEffect(() => {
    requestMeasure();
  }, [requestMeasure, frameKey]);

  const preset = VIEWPORTS[viewport].width;
  const frameWidth = preset ?? containerWidth ?? 0;
  const scale = preset && containerWidth && preset > containerWidth ? containerWidth / preset : 1;
  const visibleHeight = Math.ceil(contentHeight * scale);

  return (
    <Tabs defaultValue="preview" className={cn('not-prose my-6 gap-3', className)} data-slot="component-preview">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          {code ? <TabsTrigger value="code">Code</TabsTrigger> : null}
        </TabsList>

        <div className="flex items-center gap-1">
          <ToggleGroup
            value={[viewport]}
            onValueChange={(value) => {
              const next = (value as Viewport[])[0];
              if (next) setViewport(next);
            }}
            variant="outline"
            size="sm"
            spacing={0}
            aria-label="Preview viewport"
          >
            {(Object.keys(VIEWPORTS) as Viewport[]).map((key) => {
              const { label, icon: Icon } = VIEWPORTS[key];
              return (
                <ToggleGroupItem key={key} value={key} aria-label={label} title={label}>
                  <Icon className="size-4" />
                  <span className="sr-only">{label}</span>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
          <span className="hidden min-w-16 text-right text-xs tabular-nums text-muted-foreground sm:inline">
            {frameWidth ? `${frameWidth}px${scale < 1 ? ` · ${Math.round(scale * 100)}%` : ''}` : null}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Reload preview"
            aria-label="Reload preview"
            onClick={() => setFrameKey((k) => k + 1)}
          >
            <RotateCw />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Open in new tab"
            aria-label="Open in new tab"
            nativeButton={false}
            render={<a href={src} target="_blank" rel="noreferrer" />}
          >
            <ExternalLink />
          </Button>
        </div>
      </div>

      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}

      <TabsContent value="preview">
        <div ref={containerRef} className="preview-backdrop overflow-hidden rounded-xl border bg-background/60 p-3 sm:p-4">
          {/* Outer box reserves the scaled size; inner frame keeps its real width so media queries behave. */}
          <div
            className="mx-auto overflow-hidden rounded-lg border bg-background shadow-sm transition-[width,height] duration-300 ease-out"
            style={{ width: preset ? Math.min(preset, containerWidth ?? preset) : '100%', height: visibleHeight }}
            data-viewport={viewport}
          >
            <iframe
              key={frameKey}
              ref={frameRef}
              src={src}
              title={`${name} preview`}
              onLoad={requestMeasure}
              className="block origin-top-left bg-background"
              style={{
                width: preset ?? '100%',
                height: contentHeight,
                transform: scale < 1 ? `scale(${scale})` : undefined,
              }}
            />
          </div>
        </div>
      </TabsContent>

      {code ? (
        <TabsContent value="code" className="[&_figure]:my-0">
          {code}
        </TabsContent>
      ) : null}
    </Tabs>
  );
}
