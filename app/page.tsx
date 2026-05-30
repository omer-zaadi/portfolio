"use client";

import { useEffect, useRef, useState } from "react";
import { siteData } from "@/lib/data";

const { name, contact, skills, projects, experience, education } = siteData;
const roles = ["Full-Stack Engineer", "Software Developer", "LLM Agent Builder", "Cloud Security Enthusiast"];

const contactLinks = [
  { href: `mailto:${contact.email}`, label: "Email", value: contact.email,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg> },
  { href: `tel:+972${contact.phone.replace(/-/g,"").slice(1)}`, label: "Phone", value: contact.phone,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 11.9 19.79 19.79 0 0 1 1.61 3.22 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.12.98.32 1.94.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.87.38 1.83.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
  { href: contact.linkedin, label: "LinkedIn", value: "linkedin.com/in/omer-zaadi", target: "_blank",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
  { href: contact.github, label: "GitHub", value: "github.com/omer-zaadi", target: "_blank",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg> },
];

/* ═══════════════════════════════════════════════════
   NEURAL NETWORK PARTICLE ANIMATION
═══════════════════════════════════════════════════ */
function NeuralNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, clicking: false });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    /* ── particle config ── */
    const COUNT = 68;
    const CONNECT_DIST = 130;
    const MOUSE_ATTRACT = 140;
    const MOUSE_REPEL_CLICK = 180;

    type Particle = {
      x: number; y: number;
      vx: number; vy: number;
      baseVx: number; baseVy: number;
      r: number;
      opacity: number;
      pulsePhase: number;
      pulseSpeed: number;
      hue: number; // slight hue variation
    };

    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.18 + Math.random() * 0.22;
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        r: 1.8 + Math.random() * 2.2,
        opacity: 0.5 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        hue: 38 + (Math.random() - 0.5) * 14,
      };
    });

    /* pulse ring pool for click effect */
    type Ring = { x: number; y: number; r: number; maxR: number; alpha: number };
    const rings: Ring[] = [];

    /* ── mouse events ── */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };
    const onLeave = () => { mouseRef.current.x = -9999; mouseRef.current.y = -9999; };
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      rings.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 0, maxR: MOUSE_REPEL_CLICK, alpha: 0.6 });
      // push nearby particles outward
      particles.forEach(p => {
        const dx = p.x - (e.clientX - rect.left);
        const dy = p.y - (e.clientY - rect.top);
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_REPEL_CLICK && d > 0) {
          const force = (1 - d / MOUSE_REPEL_CLICK) * 3.5;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }
      });
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    canvas.addEventListener("click", onClick);

    let raf: number;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      /* ── update particles ── */
      particles.forEach(p => {
        // dampen velocity back to base
        p.vx += (p.baseVx - p.vx) * 0.02;
        p.vy += (p.baseVy - p.vy) * 0.02;

        // mouse attract
        const dx = mx - p.x;
        const dy = my - p.y;
        const d = Math.hypot(dx, dy);
        if (d < MOUSE_ATTRACT && d > 0) {
          const force = (1 - d / MOUSE_ATTRACT) * 0.08;
          p.vx += (dx / d) * force;
          p.vy += (dy / d) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;

        // bounce walls softly
        if (p.x < 0)  { p.x = 0;  p.vx = Math.abs(p.vx); p.baseVx = Math.abs(p.baseVx); }
        if (p.x > W)  { p.x = W;  p.vx = -Math.abs(p.vx); p.baseVx = -Math.abs(p.baseVx); }
        if (p.y < 0)  { p.y = 0;  p.vy = Math.abs(p.vy); p.baseVy = Math.abs(p.baseVy); }
        if (p.y > H)  { p.y = H;  p.vy = -Math.abs(p.vy); p.baseVy = -Math.abs(p.baseVy); }
      });

      /* ── draw edges ── */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(212,168,83,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      /* ── draw cursor grab lines ── */
      if (mx > 0 && mx < W && my > 0 && my < H) {
        particles.forEach(p => {
          const d = Math.hypot(mx - p.x, my - p.y);
          if (d < MOUSE_ATTRACT) {
            const alpha = (1 - d / MOUSE_ATTRACT) * 0.55;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(212,168,83,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });

        // cursor dot
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 16);
        g.addColorStop(0, "rgba(212,168,83,0.25)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(mx, my, 16, 0, Math.PI * 2); ctx.fill();
      }

      /* ── draw nodes ── */
      particles.forEach(p => {
        const pulse = 0.7 + 0.3 * Math.sin(p.pulsePhase);
        const proximityBoost = (() => {
          const d = Math.hypot(mx - p.x, my - p.y);
          return d < MOUSE_ATTRACT ? 0.5 * (1 - d / MOUSE_ATTRACT) : 0;
        })();
        const finalOpacity = Math.min(1, p.opacity * pulse + proximityBoost);
        const finalR = p.r * (1 + proximityBoost * 0.4);

        // outer glow
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, finalR * 4.5);
        glow.addColorStop(0, `hsla(${p.hue},65%,55%,${finalOpacity * 0.3})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(p.x, p.y, finalR * 4.5, 0, Math.PI * 2); ctx.fill();

        // core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, finalR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},75%,68%,${finalOpacity})`;
        ctx.fill();
      });

      /* ── pulse rings ── */
      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += 4.5;
        ring.alpha *= 0.93;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212,168,83,${ring.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        if (ring.alpha < 0.01 || ring.r > ring.maxR) rings.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIVE BACKGROUND
═══════════════════════════════════════════════════ */
function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;

    type Orb = { x: number; y: number; r: number; vx: number; vy: number; hue: number; phase: number; phaseSpeed: number };
    const orbs: Orb[] = [
      { x: W * 0.75, y: H * 0.2,  r: 420, vx:  0.28, vy:  0.18, hue: 40, phase: 0,    phaseSpeed: 0.008 },
      { x: W * 0.2,  y: H * 0.7,  r: 340, vx: -0.22, vy: -0.14, hue: 36, phase: 1.5,  phaseSpeed: 0.011 },
      { x: W * 0.5,  y: H * 0.5,  r: 500, vx:  0.12, vy:  0.20, hue: 38, phase: 3.1,  phaseSpeed: 0.006 },
      { x: W * 0.88, y: H * 0.78, r: 280, vx: -0.30, vy:  0.22, hue: 42, phase: 0.8,  phaseSpeed: 0.014 },
    ];

    // moving dots for subtle depth
    type Dot = { x: number; y: number; vx: number; vy: number };
    const dots: Dot[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
    }));

    let raf: number;
    let frame = 0;

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, W, H);

      // breathing orbs
      orbs.forEach(o => {
        o.phase += o.phaseSpeed;
        const breathe = 1 + 0.12 * Math.sin(o.phase);
        const r = o.r * breathe;
        const opacity = (0.042 + 0.018 * Math.sin(o.phase * 1.3)) ;
        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, r);
        g.addColorStop(0,   `hsla(${o.hue},62%,46%,${opacity * 1.6})`);
        g.addColorStop(0.4, `hsla(${o.hue},55%,38%,${opacity})`);
        g.addColorStop(1,   "transparent");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(o.x, o.y, r, 0, Math.PI * 2); ctx.fill();
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r || o.x > W + o.r) o.vx *= -1;
        if (o.y < -o.r || o.y > H + o.r) o.vy *= -1;
      });

      // animated grid — opacity pulses subtly
      const gridOpacity = 0.022 + 0.008 * Math.sin(frame * 0.012);
      ctx.strokeStyle = `rgba(212,168,83,${gridOpacity})`;
      ctx.lineWidth = 0.8;
      const spacing = 90;
      for (let x = 0; x < W; x += spacing) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += spacing) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // grid intersection dots
      ctx.fillStyle = `rgba(212,168,83,${gridOpacity * 2.5})`;
      for (let x = 0; x < W; x += spacing) {
        for (let y = 0; y < H; y += spacing) {
          ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
        }
      }

      // subtle floating dots
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath(); ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(212,168,83,0.08)"; ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
export default function SinglePage() {
  useReveal();

  /* typewriter */
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  useEffect(() => {
    const current = roles[roleIndex];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && charIndex <= current.length) {
      t = setTimeout(() => { setDisplayed(current.slice(0, charIndex)); setCharIndex(c => c + 1); }, 60);
    } else if (!deleting && charIndex > current.length) {
      t = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIndex >= 0) {
      t = setTimeout(() => { setDisplayed(current.slice(0, charIndex)); setCharIndex(c => c - 1); }, 35);
    } else {
      setDeleting(false); setRoleIndex(i => (i + 1) % roles.length); setCharIndex(0);
    }
    return () => clearTimeout(t);
  }, [charIndex, deleting, roleIndex]);

  return (
    <>
      <LiveBackground />

      {/* ══════════════ HOME ══════════════ */}
      <section id="home" className="relative z-10 min-h-screen flex items-center px-6 md:px-16 pt-24 pb-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

          {/* LEFT: name + text */}
          <div>
            <p className="animate-fade-up flex items-center gap-3 font-mono text-[11px] text-[#d4a853] tracking-[0.16em] uppercase mb-5 before:content-[''] before:block before:w-8 before:h-px before:bg-[#d4a853]">
              Available for opportunities
            </p>
            <h1 className="animate-fade-up-1 font-serif leading-[0.92] tracking-[-0.03em] text-[#f0ede6] mb-4"
              style={{ fontSize: "clamp(3.2rem,12vw,7.5rem)" }}>
              {name.split(" ")[0]}<br />
              <em className="not-italic text-[#d4a853]">{name.split(" ")[1]}</em>
            </h1>
            <div className="animate-fade-up-1 flex items-center gap-2 h-7 mb-6">
              <span className="font-mono text-sm text-[#d4a853]">/</span>
              <span className="font-mono text-sm text-[#a89070]">{displayed}</span>
              <span className="inline-block w-[2px] h-4 bg-[#d4a853] animate-pulse" />
            </div>
            <p className="animate-fade-up-2 text-[14px] md:text-[15px] text-[#6e6b64] leading-[1.85] mb-8">
              Software developer focused on the intersection of{" "}
              <span className="text-[#f0ede6] font-medium">full-stack architecture</span> and{" "}
              <span className="text-[#f0ede6] font-medium">advanced LLM agents</span>, transforming complex operational logic into scalable, secure, production-ready software.
            </p>
            <div className="animate-fade-up-3 flex gap-3">
              {contactLinks.map(({ href, label, target, icon }) => (
                <a key={label} href={href} target={target} rel={target ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className="group relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 border border-white/[0.12] rounded-sm text-[#5a5850] transition-all duration-200 hover:border-[#d4a853] hover:text-[#d4a853] hover:bg-[rgba(212,168,83,0.08)]">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: neural network — hidden on mobile */}
          <div className="hidden md:block animate-fade-up-2 h-[480px]">
            <NeuralNetwork />
          </div>

        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section id="about" className="relative z-10 py-20 md:py-32 px-6 md:px-16">
        <div className="max-w-[1080px] mx-auto">
          <p className="reveal font-mono text-[11px] text-[#d4a853] tracking-[0.16em] uppercase mb-3 flex items-center gap-2 after:content-[''] after:block after:w-10 after:h-px after:bg-white/20">Who I am</p>
          <h2 className="reveal font-serif text-[clamp(2rem,4vw,3.5rem)] text-[#f0ede6] leading-[1.1] mb-10 md:mb-16">About Me</h2>

          {/* photo — shown on mobile above text */}
          <div className="reveal flex flex-col items-center gap-4 mb-10 md:hidden">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-25"
                style={{ background: "radial-gradient(circle, rgba(212,168,83,0.6) 0%, transparent 70%)" }} />
              <div className="relative w-[200px] h-[200px] rounded-full overflow-hidden"
                style={{ border: "2px solid rgba(212,168,83,0.6)", boxShadow: "0 0 40px rgba(212,168,83,0.15)" }}>
                <img src="/photo.png" alt="Omer Zaadi"
                  className="absolute w-[170%] max-w-none"
                  style={{ top: "-8%", left: "-35%" }} />
              </div>
            </div>
            <div className="text-center">
              <p className="font-serif text-[1rem] text-[#f0ede6]">{name}</p>
              <p className="font-mono text-[11px] text-[#d4a853] tracking-[0.1em] mt-1">Software Developer</p>
            </div>
            <div className="px-4 py-2 border border-white/[0.07] rounded-sm bg-[#0d0d14] text-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              <span className="text-[12px] text-[#6e6b64]">Open to opportunities</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10 md:gap-20 items-start">
            <div>
              <p className="reveal text-[16px] text-[#7a7870] leading-[2] mb-0" style={{ letterSpacing: "0.01em" }}>
                I am a{" "}
                <span className="text-[#e8e6e0] font-medium">Computer Science graduate</span>
                {" "}and a{" "}
                <span className="text-[#e8e6e0] font-medium">former military commander</span>
                {" "}— a combination that shaped my approach to software engineering: highly disciplined, analytical, and execution-oriented.
              </p>

              <div className="reveal reveal-delay-1 my-8 h-px" style={{ background: "linear-gradient(to right, rgba(212,168,83,0.35), transparent)" }} />

              <p className="reveal reveal-delay-1 text-[16px] text-[#7a7870] leading-[2] mb-0" style={{ letterSpacing: "0.01em" }}>
                I specialize in building robust{" "}
                <span className="text-[#d4a853] font-medium">full-stack architectures</span>
                , with a deep focus on the intersection of{" "}
                <span className="text-[#d4a853] font-medium">Python</span>
                {" "}backends, dynamic{" "}
                <span className="text-[#d4a853] font-medium">React</span>
                {" "}frontends, and intelligent, AI-driven systems.
              </p>

              <div className="reveal reveal-delay-2 my-8 h-px" style={{ background: "linear-gradient(to right, rgba(212,168,83,0.35), transparent)" }} />

              <p className="reveal reveal-delay-2 text-[16px] text-[#7a7870] leading-[2]" style={{ letterSpacing: "0.01em" }}>
                I thrive on turning complex operational logic into scalable, secure, and production-ready code — constantly pushing the boundaries of what automated{" "}
                <span className="text-[#d4a853] font-medium">LLM agents</span>
                {" "}can achieve.
              </p>


              <div className="mt-14">
                <p className="reveal font-mono text-[10px] text-[#d4a853] tracking-[0.18em] uppercase mb-8 flex items-center gap-3 after:content-[''] after:block after:h-px after:w-12 after:bg-[rgba(212,168,83,0.3)]">
                  Technical Skills
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      category: "AI & Data",
                      icon: "⬡",
                      tags: ["LLM Agents", "LangChain", "RAG Systems", "Prompt Engineering"],
                    },
                    {
                      category: "Backend",
                      icon: "⬡",
                      tags: ["Python", "FastAPI", "Flask", "C", "SQL"],
                    },
                    {
                      category: "Frontend",
                      icon: "⬡",
                      tags: ["React", "JavaScript", "HTML5 / CSS3"],
                    },
                    {
                      category: "Databases & Cloud",
                      icon: "⬡",
                      tags: ["MySQL", "MongoDB", "AWS (IAM)", "Docker"],
                    },
                    {
                      category: "Tools & Research",
                      icon: "⬡",
                      tags: ["Git", "GitHub", "Linux", "Cybersecurity Research"],
                      wide: true,
                    },
                  ].map((group, i) => (
                    <div
                      key={group.category}
                      className={`reveal reveal-delay-${Math.min(i+1,4)} group relative rounded-md p-5 transition-all duration-300 ${group.wide ? "col-span-2" : ""}`}
                      style={{
                        background: "linear-gradient(135deg, rgba(212,168,83,0.03) 0%, rgba(10,10,15,0.0) 100%)",
                        border: "1px solid rgba(212,168,83,0.08)",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(212,168,83,0.22)";
                        (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(212,168,83,0.06) 0%, rgba(10,10,15,0.0) 100%)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(212,168,83,0.08)";
                        (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, rgba(212,168,83,0.03) 0%, rgba(10,10,15,0.0) 100%)";
                      }}
                    >
                      {/* subtle top-left glow on hover */}
                      <div className="absolute top-0 left-0 w-24 h-24 rounded-tl-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ background: "radial-gradient(circle at top left, rgba(212,168,83,0.08) 0%, transparent 70%)" }} />

                      <p className="font-mono text-[10px] text-[#d4a853] tracking-[0.15em] uppercase mb-4 opacity-70">
                        {group.category}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {group.tags.map(tag => (
                          <span
                            key={tag}
                            className="skill-tag text-[12px] font-medium px-3 py-1.5 rounded-md cursor-default select-none transition-all duration-200"
                            style={{
                              color: "#9a8f78",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid rgba(212,168,83,0.1)",
                            }}
                            onMouseEnter={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.color = "#d4a853";
                              el.style.border = "1px solid rgba(212,168,83,0.45)";
                              el.style.background = "rgba(212,168,83,0.08)";
                              el.style.boxShadow = "0 0 12px rgba(212,168,83,0.15)";
                            }}
                            onMouseLeave={e => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.color = "#9a8f78";
                              el.style.border = "1px solid rgba(212,168,83,0.1)";
                              el.style.background = "rgba(255,255,255,0.03)";
                              el.style.boxShadow = "none";
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* circular photo — desktop only */}
            <div className="reveal sticky top-28 flex-col items-center gap-5 hidden md:flex">
              <div className="relative">
                <div className="absolute inset-0 rounded-full blur-2xl opacity-25"
                  style={{ background: "radial-gradient(circle, rgba(212,168,83,0.6) 0%, transparent 70%)" }} />
                <div className="relative w-[260px] h-[260px] rounded-full overflow-hidden"
                  style={{ border: "2px solid rgba(212,168,83,0.6)", boxShadow: "0 0 40px rgba(212,168,83,0.15), inset 0 0 20px rgba(0,0,0,0.3)" }}>
                  <img src="/photo.png" alt="Omer Zaadi"
                    className="absolute w-[170%] max-w-none"
                    style={{ top: "-8%", left: "-35%", filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.5))" }} />
                </div>
              </div>
              <div className="text-center">
                <p className="font-serif text-[1.1rem] text-[#f0ede6]">{name}</p>
                <p className="font-mono text-[11px] text-[#d4a853] tracking-[0.1em] mt-1">Software Developer</p>
              </div>
              <div className="w-full p-4 border border-white/[0.07] rounded-sm bg-[#0d0d14] text-center">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                <span className="text-[13px] text-[#6e6b64]">Open to opportunities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ PROJECTS ══════════════ */}
      <section id="projects" className="relative z-10 py-20 md:py-32 px-6 md:px-16">
        <div className="max-w-[1080px] mx-auto">
          <p className="reveal font-mono text-[11px] text-[#d4a853] tracking-[0.16em] uppercase mb-3 flex items-center gap-2 after:content-[''] after:block after:w-10 after:h-px after:bg-white/20">Work</p>
          <h2 className="reveal font-serif text-[clamp(2rem,4vw,3.5rem)] text-[#f0ede6] leading-[1.1] mb-10 md:mb-16">Projects</h2>
          <div className="flex flex-col gap-4">
            {projects.map((p, i) => (
              <div key={p.number} className={`reveal reveal-delay-${i+1} group bg-[#0d0d14] border border-white/[0.07] rounded-sm overflow-hidden hover:border-[rgba(212,168,83,0.3)] transition-all duration-300`}>
                {/* mobile: stacked layout */}
                <div className="flex flex-col md:grid md:grid-cols-[1fr_380px] md:min-h-[280px]">
                  {/* image on top for mobile */}
                  <div className="relative bg-[#111118] overflow-hidden h-[200px] md:hidden md:order-2">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                        <div className="w-10 h-10 border border-[rgba(212,168,83,0.3)] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-[#d4a853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        </div>
                        <span className="font-mono text-[11px] text-[#d4a853] bg-[rgba(212,168,83,0.1)] border border-[rgba(212,168,83,0.2)] px-3 py-1 rounded-sm">Coming Soon</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8 flex flex-col justify-between md:border-r border-white/[0.07]">
                    <div>
                      <p className="font-mono text-[11px] text-[#5a5850] mb-2">{p.number}</p>
                      <h3 className="font-serif text-[1.4rem] md:text-[1.7rem] text-[#f0ede6] leading-[1.2] mb-3">{p.title}</h3>
                      <p className="text-[13px] md:text-[13.5px] text-[#6e6b64] leading-[1.8] mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {p.tags.map(t => <span key={t} className="font-mono text-[11px] px-2.5 py-1 bg-[#1a1a24] border border-white/[0.1] rounded-sm text-[rgba(212,168,83,0.7)]">{t}</span>)}
                      </div>
                    </div>
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 self-start font-mono text-[12px] text-[#d4a853] border border-[rgba(212,168,83,0.3)] px-4 py-2 rounded-sm transition-all duration-200 hover:bg-[rgba(212,168,83,0.1)] hover:border-[#d4a853]">
                      View on GitHub
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>

                  {/* image on right for desktop */}
                  <div className="relative bg-[#111118] overflow-hidden hidden md:block">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                        <div className="w-12 h-12 border border-[rgba(212,168,83,0.3)] rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#d4a853]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        </div>
                        {[100,72,86,58].map((w,j)=><div key={j} className="h-[4px] rounded-full bg-white/[0.05]" style={{width:`${w}%`}}/>)}
                        <span className="font-mono text-[11px] text-[#d4a853] bg-[rgba(212,168,83,0.1)] border border-[rgba(212,168,83,0.2)] px-3 py-1 rounded-sm">Coming Soon</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ RESUME ══════════════ */}
      <section id="resume" className="relative z-10 py-20 md:py-32 px-6 md:px-16">
        <div className="max-w-[900px] mx-auto">

          <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10 md:mb-12">
            <div>
              <p className="font-mono text-[11px] text-[#d4a853] tracking-[0.16em] uppercase mb-3 flex items-center gap-2 after:content-[''] after:block after:w-10 after:h-px after:bg-white/20">Background</p>
              <h2 className="font-serif text-[clamp(2rem,4vw,3.5rem)] text-[#f0ede6] leading-[1.1]">Résumé</h2>
            </div>
            <a href="/CV_Omer_Zaadi.pdf" download
              className="flex items-center gap-2 font-mono text-[12px] tracking-[0.06em] px-5 py-3 rounded-sm self-start sm:self-auto transition-all duration-300"
              style={{ color: "#d4a853", border: "1px solid rgba(212,168,83,0.4)", background: "rgba(212,168,83,0.04)" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(212,168,83,0.12)"; el.style.boxShadow = "0 0 20px rgba(212,168,83,0.15)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(212,168,83,0.04)"; el.style.boxShadow = "none"; }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Resume (PDF)
            </a>
          </div>

          {/* PDF viewer */}
          <div className="reveal reveal-delay-1 relative rounded-md overflow-hidden"
            style={{ border: "1px solid rgba(212,168,83,0.12)", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}>
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: "rgba(212,168,83,0.04)", borderBottom: "1px solid rgba(212,168,83,0.08)" }}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[11px] text-[#5a5850] tracking-wider">CV_Omer_Zaadi.pdf</span>
              <a href="/CV_Omer_Zaadi.pdf" target="_blank" rel="noopener noreferrer"
                className="font-mono text-[10px] text-[#d4a853] opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                <span className="hidden sm:inline">Open in new tab</span>
              </a>
            </div>
            <iframe
              src="/CV_Omer_Zaadi.pdf"
              title="Omer Zaadi — Resume"
              className="w-full"
              style={{ height: "75vh", minHeight: "500px", background: "#0d0d14", border: "none", display: "block" }}
            />
          </div>

        </div>
      </section>

      {/* ══════════════ CONTACT ══════════════ */}
      <section id="contact" className="relative z-10 py-20 md:py-32 px-6 md:px-16">
        <div className="max-w-[1080px] mx-auto">
          <p className="reveal font-mono text-[11px] text-[#d4a853] tracking-[0.16em] uppercase mb-3 flex items-center gap-2 after:content-[''] after:block after:w-10 after:h-px after:bg-white/20">Reach out</p>
          <h2 className="reveal font-serif text-[clamp(2rem,4vw,3.5rem)] text-[#f0ede6] leading-[1.1] mb-4">Let&apos;s Connect</h2>
          <p className="reveal text-[14px] md:text-[15px] text-[#6e6b64] max-w-[480px] leading-[1.8] mb-10 md:mb-16">
            Open to new opportunities, collaborations, or just a good conversation about software and AI.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contactLinks.map((cl, i) => (
              <a key={cl.label} href={cl.href} target={cl.target} rel={cl.target?"noopener noreferrer":undefined}
                className={`reveal reveal-delay-${i+1} group flex items-center gap-4 bg-[#0d0d14] border border-white/[0.07] p-5 md:p-7 rounded-sm hover:bg-[#111118] hover:border-[rgba(212,168,83,0.3)] transition-all duration-200`}>
                <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 border border-white/[0.1] rounded-sm text-[#5a5850] group-hover:border-[#d4a853] group-hover:text-[#d4a853] transition-all shrink-0">{cl.icon}</span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] text-[#5a5850] tracking-[0.1em] uppercase mb-1 group-hover:text-[#d4a853] transition-colors">{cl.label}</p>
                  <p className="text-[13px] md:text-[14px] text-[#e8e6e0] truncate">{cl.value}</p>
                </div>
                <svg className="w-4 h-4 text-[#5a5850] ml-auto opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-white/[0.07] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-mono text-[11px] text-[#3a3830]">© 2025 Omer Zaadi</p>
            <p className="font-mono text-[11px] text-[#3a3830]">Built with Next.js · Deployed on Vercel</p>
          </div>
        </div>
      </section>
    </>
  );
}
