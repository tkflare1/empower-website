import Link from "next/link";

const footerLinks = {
  Platform: [
    { href: "/", label: "Home" },
    { href: "/our-story", label: "Our Story" },
    { href: "/our-programs", label: "Programs" },
    { href: "/get-involved", label: "Get Involved" },
  ],
  Community: [
    { href: "/get-involved#volunteer", label: "Volunteer" },
    { href: "/get-involved#donate", label: "Donate" },
    { href: "/get-involved#partner", label: "Partner With Us" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 text-white font-bold text-lg">
                E
              </span>
              <span className="text-xl font-bold text-white tracking-tight">
                Empower
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Amplifying stories from under-represented communities. Every voice
              matters, every story deserves to be heard.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Empower. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built with Next.js &amp; Sanity &mdash; open&nbsp;source on{" "}
            <a
              href="https://github.com/tkflare1/empower-website"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
