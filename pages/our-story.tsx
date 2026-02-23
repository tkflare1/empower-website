import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const values = [
  {
    title: "Authenticity",
    desc: "We publish real stories from real people — no filters, no gatekeeping.",
  },
  {
    title: "Inclusivity",
    desc: "Our platform is built to be welcoming, accessible, and safe for writers of every background.",
  },
  {
    title: "Equity",
    desc: "We actively work to remove barriers that keep marginalised voices from being heard.",
  },
  {
    title: "Community",
    desc: "We believe meaningful change happens when people connect through shared experience.",
  },
];

const milestones = [
  { year: "2024", event: "Idea born at a community storytelling workshop" },
  { year: "2024", event: "First prototype built with Next.js & Sanity CMS" },
  { year: "2025", event: "Open-sourced on GitHub; first volunteer cohort" },
  { year: "2026", event: "Launched at Content Hackathon — growing every day" },
];

export default function OurStory() {
  return (
    <>
      <Head>
        <title>Our Story — Empower</title>
        <meta name="description" content="Learn why Empower exists and the values that drive us." />
      </Head>

      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Our Story
          </h1>
          <p className="mt-6 text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
            Empower began with a simple belief: the stories that go untold are
            often the ones the world most needs to hear.
          </p>
        </div>
      </section>

      {/* Origin */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 space-y-6 text-slate-700 leading-relaxed text-lg">
          <p>
            In 2024, a small group of writers, engineers, and community
            organisers sat in a circle at a neighbourhood storytelling night.
            Person after person shared experiences that were powerful, raw, and
            profoundly under-represented in mainstream media.
          </p>
          <p>
            The question became obvious:{" "}
            <strong className="text-slate-900">
              What if there were a platform purpose-built to amplify these
              voices?
            </strong>{" "}
            Not another social network optimising for engagement, but a calm,
            respectful space where authentic storytelling is the product.
          </p>
          <p>
            That conversation became Empower — an open-source publishing
            platform pairing modern web technology with an
            accessibility-first, community-driven ethos.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="section-heading text-center">Our Values</h2>
          <p className="section-subheading text-center mx-auto">
            Every decision we make is guided by these principles.
          </p>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-slate-900/5"
              >
                <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="section-heading text-center">Our Journey</h2>
          <div className="mt-12 relative border-l-2 border-brand-200 ml-4 space-y-10">
            {milestones.map((m, i) => (
              <div key={i} className="pl-8 relative">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-brand-600 ring-4 ring-white" />
                <p className="text-sm font-bold text-brand-600">{m.year}</p>
                <p className="text-slate-700 mt-1">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Ready to join us?
          </h2>
          <p className="mt-3 text-brand-100">
            Whether you write, code, or simply care — there is a seat for you.
          </p>
          <Link href="/get-involved" className="btn-accent mt-8 inline-block px-8 py-3 text-base">
            Get Involved
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
