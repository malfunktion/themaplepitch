import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Maple Pitch | Canadian Soccer Intelligence",
  description: "Aggregator and scouting terminal for Canadian soccer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
