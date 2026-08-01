import type { Metadata, Viewport } from "next";
import Header from "@/components/layout/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Maple Pitch — Canadian Soccer, Home and Abroad",
  description:
    "News, stats, and profiles covering the Canadian soccer pyramid, MLS, and Canadians playing abroad.",
};

export const viewport: Viewport = {
  width: 1280,
  initialScale: 0.8,
},

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
