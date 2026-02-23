"use client";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Headroom from "react-headroom";

const navLinks = [
  { href: "/our-story", label: "Our Story" },
  { href: "/our-programs", label: "Programs" },
  { href: "/get-involved", label: "Get Involved" },
];

function Header() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) close();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <Headroom>
      <header className="relative z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-5 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={close}>
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-600 text-white font-bold text-lg transition-transform group-hover:scale-105">
              E
            </span>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Empower
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/get-involved#donate" className="btn-primary text-sm">
              Donate
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden relative z-50 w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 ${
                open ? "rotate-45 translate-y-[4px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-800 transition-all duration-300 ${
                open ? "-rotate-45 -translate-y-[4px]" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile overlay + menu */}
        {open && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-slate-900/40" onClick={close} />
            <nav className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl animate-slide-down flex flex-col pt-20 px-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-lg font-medium text-slate-700 hover:text-brand-600 border-b border-slate-100 transition-colors"
                  onClick={close}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/get-involved#donate"
                className="btn-primary mt-6 text-center"
                onClick={close}
              >
                Donate
              </Link>
            </nav>
          </div>
        )}
      </header>
    </Headroom>
  );
}

export default Header;
