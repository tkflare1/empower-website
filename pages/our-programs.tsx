import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const programs = [
  {
    title: "Community Writers' Fellowship",
    tag: "Writing",
    desc: "A 12-week programme that pairs emerging writers from under-represented backgrounds with experienced mentors. Fellows receive editorial guidance, a publishing stipend, and a guaranteed feature on Empower.",
    features: ["1-on-1 mentorship", "Editorial workshops", "Publishing stipend", "Guaranteed feature"],
  },
  {
    title: "Story Circles",
    tag: "Community",
    desc: "Monthly in-person and virtual storytelling events where community members gather to share lived experiences in a safe, moderated space. Stories are transcribed and published with the author's permission.",
    features: ["Monthly gatherings", "Safe-space moderation", "Hybrid (in-person + Zoom)", "Transcription & publishing"],
  },
  {
    title: "Tech for Impact Lab",
    tag: "Engineering",
    desc: "An open-source sprint programme where developers, designers, and product thinkers collaborate to improve the Empower platform. Contributions are credited and celebrated publicly.",
    features: ["Open-source sprints", "Beginner-friendly issues", "Design collaborations", "Public recognition"],
  },
  {
    title: "Youth Voices Initiative",
    tag: "Education",
    desc: "A school-outreach programme that teaches young people from marginalised communities how to tell their stories through writing and multimedia, building confidence and digital literacy.",
    features: ["Workshop curriculum", "Multimedia storytelling", "School partnerships", "Student showcases"],
  },
];

export default function OurPrograms() {
  return (
    <>
      <Head>
        <title>Our Programs — Empower</title>
        <meta name="description" content="Explore Empower's programmes that uplift under-represented voices through writing, community, and technology." />
      </Head>

      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Our Programs
          </h1>
          <p className="mt-6 text-lg text-brand-100 max-w-2xl mx-auto leading-relaxed">
            From fellowships to open-source sprints, every programme is designed
            to lower barriers and elevate voices.
          </p>
        </div>
      </section>

      {/* Programs list */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          {programs.map((prog, i) => (
            <div
              key={prog.title}
              className={`flex flex-col lg:flex-row gap-10 ${
                i % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Color accent block */}
              <div className="flex-shrink-0 w-full lg:w-72 h-48 lg:h-auto rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
                <span className="text-brand-600 font-bold text-sm uppercase tracking-widest">
                  {prog.tag}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900">{prog.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed">{prog.desc}</p>
                <ul className="mt-5 grid grid-cols-2 gap-2">
                  {prog.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                      <svg className="w-4 h-4 text-brand-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="section-heading">Want to participate?</h2>
          <p className="section-subheading mx-auto">
            All programmes are free for participants. Reach out or sign up
            through our Get Involved page.
          </p>
          <Link href="/get-involved" className="btn-primary mt-8 inline-block px-8 py-3 text-base">
            Get Involved
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
