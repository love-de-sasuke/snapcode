import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains-mono",
});

const title = "SnapCode - Beautiful Code Snippets";
const description =
  "Convert code to high-resolution, shareable images. Dracula syntax highlighting, 4× export, glassmorphism UI. The 2026 code-to-card tool.";
const url = "https://snapcode.app";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "code to image",
    "snapcode",
    "code snippets",
    "syntax highlighting",
    "Dracula theme",
    "developer tools",
    "code card",
  ],
  authors: [{ name: "SnapCode" }],
  creator: "SnapCode",
  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName: "SnapCode",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: "index, follow",
  metadataBase: new URL(url),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
