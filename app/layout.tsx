import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manga Recap - AI Video Generator",
  description: "Generate AI-powered video recaps of manga and manhwa with automatic narration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
