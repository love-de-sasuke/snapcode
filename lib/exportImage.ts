"use client";

import { toPng } from "html-to-image";

const MAX_PIXEL_RATIO = 12;
const DEFAULT_PIXEL_RATIO = MAX_PIXEL_RATIO;
const DEFAULT_FILENAME = "snapcode-export.png";

export interface ExportImageOptions {
  pixelRatio?: number;
  filename?: string;
  cacheBust?: boolean;
}

/**
 * Captures a DOM element and downloads it as a high-resolution PNG.
 * Uses the maximum configured pixel ratio for highest-resolution export.
 */
export async function exportImage(
  element: HTMLElement,
  options: ExportImageOptions = {}
): Promise<void> {
  const {
    pixelRatio = DEFAULT_PIXEL_RATIO,
    filename = DEFAULT_FILENAME,
    cacheBust = true,
  } = options;

  const rect = element.getBoundingClientRect();
  const exportWidth = Math.max(1, Math.round(rect.width));
  const exportHeight = Math.max(1, Math.round(rect.height));
  const multiplier = Math.min(MAX_PIXEL_RATIO, Math.max(1, pixelRatio));

  const dataUrl = await toPng(element, {
    cacheBust,
    pixelRatio: 1,
    width: exportWidth,
    height: exportHeight,
    canvasWidth: exportWidth * multiplier,
    canvasHeight: exportHeight * multiplier,
    skipAutoScale: true,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
