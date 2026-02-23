"use client";

import { useEffect, useState, useMemo } from "react";
// Use the browser-friendly bundle so no Node fs/path are pulled into the client build.
import { getHighlighter, type Highlighter } from "shiki/bundle/web";
// Provide Oniguruma WASM as a URL that the browser can fetch.
import onigWasm from "shiki/onig.wasm?url";

const SHIKI_THEME = "dracula" as const;
const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "jsx",
  "tsx",
  "java",
  "go",
  "rust",
  "html",
  "css",
  "json",
  "bash",
  "markdown",
] as const;

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return match;
    }
  });
}

export interface UseProcessorOptions {
  theme?: string;
}

export interface UseProcessorResult {
  highlightedHtml: string;
  isReady: boolean;
  highlighter: Highlighter | null;
  theme: string;
}

/**
 * Hook that handles Shiki syntax highlighting with Dracula theme.
 * Uses the web bundle + explicit WASM loader to stay client-bundle safe.
 */
export function useProcessor(
  code: string,
  language: string,
  highlightedLines: Set<number>,
  options: UseProcessorOptions = {}
): UseProcessorResult {
  const theme = options.theme ?? SHIKI_THEME;
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter({
      themes: [theme],
      langs: [...LANGUAGES],
      loadWasm: async () => {
        const res = await fetch(onigWasm);
        return res.arrayBuffer();
      },
    })
      .then((h) => {
        if (!cancelled) setHighlighter(h);
      })
      .catch((err) => console.error("Shiki init error:", err));
    return () => {
      cancelled = true;
    };
  }, [theme]);

  const highlightedHtml = useMemo(() => {
    if (!highlighter || !code.trim()) return "";
    try {
      const tokens = highlighter.codeToThemedTokens(code, { lang: language, theme });
      return tokens
        .map((line, lineIndex) => {
          const lineNum = lineIndex + 1;
          const isHighlighted = highlightedLines.has(lineNum);
          const lineContent = line
            .map(
              (token) =>
                `<span style="color: ${token.color ?? "inherit"}">${escapeHtml(token.content)}</span>`
            )
            .join("");
          return `<div class="code-line ${isHighlighted ? "glowing" : ""}" data-line-number="${lineNum}">${lineContent}</div>`;
        })
        .join("");
    } catch {
      return `<div class="code-line">${escapeHtml(code)}</div>`;
    }
  }, [highlighter, code, language, theme, highlightedLines]);

  return {
    highlightedHtml,
    isReady: !!highlighter,
    highlighter,
    theme,
  };
}
