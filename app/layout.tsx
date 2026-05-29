import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Omer Zaadi — Software Developer",
  description: "Software developer focused on full-stack architecture and advanced LLM agents.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-[#e8e6e0] min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
