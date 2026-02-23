import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const roles = [
  {
    id: "volunteer",
    title: "Volunteer",
    desc: "Help moderate Story Circles, mentor emerging writers, or lead community events in your area.",
    cta: "Apply to Volunteer",
  },
  {
    id: "contribute",
    title: "Contribute Code",
    desc: "Empower is open-source. Pick up a good-first-issue on GitHub, submit a PR, and see your work deployed to production.",
    cta: "View on GitHub",
    href: "https://github.com/tkflare1/empower-website",
  },
  {
    id: "partner",
    title: "Partner With Us",
    desc: "Schools, nonprofits, and media organisations — let's collaborate on programmes that lift marginalised voices.",
    cta: "Reach Out",
  },
];

export default function GetInvolved() {
  return (
    <>
      <Head>
        <title>Get Involved — Empower</title>
        <meta name="description" content="Join the Empower community — volunteer, contribute code, donate, or partner with us." />
      </Head>

      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Get Involved
          </h1>
          <p className="mt-6 text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
            Empower is built by its community. However you want to help, there
            is a meaningful way for you to contribute.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              id={role.id}
              className="rounded-2xl border border-slate-200 p-8 flex flex-col hover:shadow-lg transition-shadow scroll-mt-32"
            >
              <h3 className="text-xl font-bold text-slate-900">{role.title}</h3>
              <p className="mt-3 text-slate-600 leading-relaxed flex-1">
                {role.desc}
              </p>
              {role.href ? (
                <a
                  href={role.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-6 text-center"
                >
                  {role.cta}
                </a>
              ) : (
                <a
                  href="mailto:hello@empower-platform.org"
                  className="btn-secondary mt-6 text-center"
                >
                  {role.cta}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Donate section */}
      <section id="donate" className="py-20 bg-accent-50 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block text-5xl mb-4">💛</span>
          <h2 className="section-heading">Support With a Donation</h2>
          <p className="section-subheading mx-auto">
            100% of donations fund writer stipends, accessibility audits, and
            community events. Empower is a volunteer-run, non-profit initiative.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                className="rounded-xl border-2 border-accent-300 bg-white px-6 py-3 text-lg font-bold text-accent-700 transition hover:bg-accent-100 hover:border-accent-400"
              >
                ${amount}
              </button>
            ))}
            <button className="rounded-xl border-2 border-accent-300 bg-white px-6 py-3 text-lg font-bold text-accent-700 transition hover:bg-accent-100 hover:border-accent-400">
              Custom
            </button>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            Payment integration coming soon. For now, reach out at{" "}
            <a href="mailto:hello@empower-platform.org" className="underline">
              hello@empower-platform.org
            </a>
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-white">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Stay in the loop</h2>
          <p className="mt-2 text-slate-600">
            Join our mailing list for programme updates and new stories.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm shadow-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
