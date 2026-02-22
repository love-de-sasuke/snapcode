"use client";

import { useProcessor } from "@/lib/useProcessor";
import "./CodeCard.css";
import { motion } from "framer-motion";

export interface CodeCardProps {
  code: string;
  language: string;
  theme?: string;
  cardRef: React.RefObject<HTMLDivElement | null>;
  onLineClick: (lineNumber: number) => void;
  highlightedLines: Set<number>;
  /** Padding around code (e.g. 16, 24, 32) for adjustable card padding */
  padding?: number;
}

export default function CodeCard({
  code,
  language,
  theme = "dracula",
  cardRef,
  onLineClick,
  highlightedLines,
  padding = 24,
}: CodeCardProps) {
  const { highlightedHtml, isReady } = useProcessor(code, language, highlightedLines, { theme });

  const handleCodeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const lineEl = target.closest(".code-line");
    if (lineEl) {
      const num = parseInt(lineEl.getAttribute("data-line-number") ?? "", 10);
      if (!isNaN(num)) onLineClick(num);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="code-card-container relative overflow-hidden rounded-3xl border border-white/10 shadow-silk silk-outline"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Dynamic mesh gradient background */}
      <div
        className="code-card-mesh absolute inset-0 pointer-events-none"
        aria-hidden
      />
      <div className="window-frame relative glass-surface silk-outline rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* macOS-style window header */}
        <div className="window-header flex items-center px-4 py-3 border-b border-white/10">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.5)" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.5)" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.5)" />
          </div>
          <span className="flex-1 text-center text-xs text-white/50 font-medium tracking-wide">
            {language}
          </span>
        </div>

        {/* Code area with adjustable padding */}
        <pre
          className="code-pre text-left text-sm leading-relaxed bg-transparent rounded-b-2xl"
          style={{ padding: `${padding}px` }}
          onClick={handleCodeClick}
        >
          <code
            className={`font-mono block ${!isReady || !code ? "animate-pulse" : ""}`}
            dangerouslySetInnerHTML={{
              __html:
                isReady && code
                  ? highlightedHtml
                  : '<div class="text-gray-400">Paste code to preview…</div>',
            }}
          />
        </pre>
      </div>
    </motion.div>
  );
}
