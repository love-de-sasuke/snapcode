"use client";

import { useState, useRef, useCallback } from "react";
import CodeCard from "@/components/CodeCard";
import { exportImage } from "@/lib/exportImage";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Code, Zap, CheckCircle, SlidersHorizontal } from "lucide-react";
import { tinyld } from "tinyld";
import Script from "next/script";

const placeholderCode = `function greetings(name) {
  console.log("Hello, " + name + "!");
  // Click a line to highlight it
}`;

export default function Home() {
  const [code, setCode] = useState<string>(placeholderCode);
  const [language, setLanguage] = useState<string>("javascript");
  const [highlightedLines, setHighlightedLines] = useState<Set<number>>(() => new Set([3]));
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);
  const [cardPadding, setCardPadding] = useState<number>(24);
  const [popKey, setPopKey] = useState(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    const detected = tinyld(newCode);
    if (detected && language !== detected) setLanguage(detected);
  };

  const handlePaste = () => {
    setPopKey((k) => k + 1);
  };

  const handleLineClick = useCallback((lineNumber: number) => {
    setHighlightedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineNumber)) next.delete(lineNumber);
      else next.add(lineNumber);
      return next;
    });
  }, []);

  const handleExport = useCallback(() => {
    if (!cardRef.current) return;
    exportImage(cardRef.current, { pixelRatio: 4, cacheBust: true })
      .then(() => {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 1200);
      })
      .catch((err) => console.error("Export failed:", err));
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-8 md:px-12 font-sans overflow-hidden">
      <div className="mesh-gradient" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />

      <Script
        id="softwareapplication-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "SnapCode - Beautiful Code Snippets",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web",
            description: "Convert code to high-resolution shareable images with Dracula syntax highlighting and a modern 2026 UI.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 space-y-3"
      >
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-emerald-200/90 backdrop-blur-md shadow-md shadow-emerald-400/15">
          High-res code cards · Dracula theme · 4× export
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-cyan-200 drop-shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
          SnapCode <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-amber-200 to-cyan-200">2026</span>
        </h1>
        <p className="text-gray-200/80 mt-2 text-base sm:text-lg max-w-2xl mx-auto">
          Beautiful code snippets as high-resolution images. Glassmorphism, mesh gradients, and micro-interactions.
        </p>
      </motion.div>

      {/* Bento Grid: Left = Input & controls, Right = Live Preview */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-8">
        {/* Left — Input & controls (glassmorphism) */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="relative overflow-hidden rounded-3xl glass-surface silk-outline border border-white/10 shadow-silk p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
            <div className="absolute -top-10 -right-6 h-48 w-48 rounded-full bg-cyan-400/30 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-4 h-56 w-56 rounded-full bg-fuchsia-400/25 blur-3xl animate-[pulse_9s_ease-in-out_infinite]" />
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bento-tile rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-silk backdrop-blur-xl"
            >
              <label htmlFor="language-display" className="text-xs uppercase tracking-[0.14em] text-emerald-100/80 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" /> Language
              </label>
              <input
                id="language-display"
                type="text"
                readOnly
                value={language}
                className="w-full rounded-xl bg-gradient-to-r from-slate-900/70 to-slate-800/70 border border-white/10 px-3 py-2.5 text-white/90 capitalize cursor-default shadow-inner shadow-black/30"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bento-tile rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-silk backdrop-blur-xl"
            >
              <label htmlFor="padding-select" className="text-xs uppercase tracking-[0.14em] text-emerald-100/80 mb-2 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Card padding
              </label>
              <select
                id="padding-select"
                value={cardPadding}
                onChange={(e) => setCardPadding(Number(e.target.value))}
                className="w-full rounded-xl bg-gradient-to-r from-slate-900/70 to-slate-800/70 border border-white/10 px-3 py-2.5 text-white focus:ring-2 focus:ring-emerald-300/60 focus:outline-none shadow-inner shadow-black/30"
              >
                <option value={16}>16px</option>
                <option value={24}>24px</option>
                <option value={32}>32px</option>
                <option value={40}>40px</option>
              </select>
            </motion.div>
          </div>

          {/* Editor container — glassmorphism */}
          <motion.div
            key={popKey}
            initial={{ scale: 1 }}
            animate={{ scale: 1 }}
            className="relative mt-5 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/70 via-slate-900/60 to-slate-950/70 shadow-silk backdrop-blur-xl glass-surface"
          >
            <div className="absolute right-4 top-3 text-[10px] tracking-[0.2em] text-emerald-100/60 uppercase">
              Canvas
            </div>
            <label htmlFor="code-input" className="sr-only">Paste Your Code</label>
            <div className="px-4 pt-4 pb-2 flex items-center gap-2 text-sm text-emerald-100/80 uppercase tracking-[0.18em]">
              <Zap className="w-4 h-4" /> Paste Your Code
            </div>
            <textarea
              id="code-input"
              value={code}
              onChange={handleCodeChange}
              onPaste={handlePaste}
              className="w-full bg-transparent border-0 outline-none px-4 pb-4 text-sm sm:text-base font-mono text-white placeholder:text-gray-400/80 min-h-[240px] resize-none focus:ring-0"
              rows={15}
              placeholder="Paste your code here..."
            />
          </motion.div>

          {/* Export button with success state animation */}
          <div className="mt-6 space-y-2">
            <motion.button
              onClick={handleExport}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400 px-5 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-400/25 transition-transform"
            >
              <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-2 text-lg">
                <Download className="w-5 h-5" />
                Export 4× Image
              </div>
            </motion.button>

            <AnimatePresence>
              {exportSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-center justify-center text-emerald-200 text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-emerald-300 animate-success-pop" />
                  Saved — card ready to share.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Right — Live Preview (card pops when code changes) */}
        <motion.section
          key={`preview-${popKey}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 360, damping: 25 }}
          className="relative rounded-3xl border border-white/10 glass-surface silk-outline shadow-silk p-4 sm:p-6"
        >
          <div className="pointer-events-none absolute -top-6 right-6 h-28 w-28 rounded-full bg-cyan-300/30 blur-2xl animate-[pulse_8s_ease-in-out_infinite]" />
          <CodeCard
            cardRef={cardRef}
            code={code}
            language={language}
            theme="dracula"
            onLineClick={handleLineClick}
            highlightedLines={highlightedLines}
            padding={cardPadding}
          />
        </motion.section>
      </div>

      <footer className="text-center mt-12 text-gray-400 text-sm space-y-1">
        <p>SnapCode — Next.js 15, Shiki (Dracula), Framer Motion. Vercel-ready.</p>
      </footer>
    </main>
  );
}
