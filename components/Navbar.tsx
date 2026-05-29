"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const links = [
  { href: "#home",     label: "Home" },
  { href: "#about",    label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#resume",   label: "Resume" },
  { href: "#contact",  label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const sections = links.map(l => l.href.slice(1));
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4 transition-all duration-300 ${
      scrolled ? "bg-[rgba(10,10,15,0.95)] backdrop-blur-md border-b border-white/[0.07]" : "bg-transparent"
    }`}>
      <a href="#home" onClick={e => scrollTo(e, "#home")} className="flex items-center">
        <Image src="/logo.png" alt="OZ" width={40} height={40} className="h-10 w-auto object-contain" />
      </a>

      <ul className="flex items-center gap-1">
        {links.map(({ href, label }) => {
          const id = href.slice(1);
          const isActive = active === id;
          return (
            <li key={href}>
              <a
                href={href}
                onClick={e => scrollTo(e, href)}
                className={`relative block px-5 py-2 text-[13px] font-medium tracking-[0.06em] rounded-sm transition-all duration-200 ${
                  isActive ? "text-[#f0ede6] bg-white/[0.05]" : "text-[#7a7870] hover:text-[#e8e6e0] hover:bg-white/[0.04]"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[#d4a853]" />
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
