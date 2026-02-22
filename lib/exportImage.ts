"use client";

import { toPng } from "html-to-image";

const DEFAULT_PIXEL_RATIO = 4;
const DEFAULT_FILENAME = "snapcode-export.png";

export interface ExportImageOptions {
  pixelRatio?: number;
  filename?: string;
  cacheBust?: boolean;
}

/**
 * Captures a DOM element and downloads it as a high-resolution PNG.
 * Uses pixelRatio: 4 for 4x resolution export.
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

  const dataUrl = await toPng(element, {
    cacheBust,
    pixelRatio,
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
