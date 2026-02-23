import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  return (
    <>
      <Head>
        <title>Empower — Amplifying Under-represented Voices</title>
        <meta
          name="description"
          content="Empower is an open-source publishing platform that elevates stories from under-represented communities."
        />

      </Head>

      <Header />

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <p className="text-brand-200 font-semibold tracking-wide uppercase text-sm mb-4 animate-fade-in">
              Every voice matters
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight animate-slide-up">
              Amplifying stories from{" "}
              <span className="text-accent-300">under-represented</span>{" "}
              communities
            </h1>
            <p className="mt-6 text-lg md:text-xl text-brand-100 leading-relaxed max-w-2xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Empower is an open publishing platform where writers from
              historically marginalised groups share, discover, and discuss
              authentic stories that foster meaningful change.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/our-story" className="btn-accent px-8 py-3 text-base">
                Learn More
              </Link>
              <Link href="/get-involved" className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white/10">
                Get Involved
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Mission strip ──────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: "✍️",
                title: "Publish Freely",
                desc: "A rich-text editor with media support so every story can be told in full colour.",
              },
              {
                icon: "🤝",
                title: "Build Community",
                desc: "Comment threads and reactions let readers engage with writers on a human level.",
              },
              {
                icon: "🌍",
                title: "Reach Everyone",
                desc: "Accessible-first design, blazing-fast pages, and SEO built in from day one.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-3">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Posts grid ─────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="section-heading">Latest Stories</h2>
            <p className="section-subheading mx-auto">
              Read the newest perspectives from our community of writers.
            </p>
          </div>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post._id} href={`/post/${post.slug.current}`}>
                  <article className="card group cursor-pointer h-full flex flex-col">
                    <div className="relative overflow-hidden">
                      <img
                        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={urlFor(post.mainImage).url()!}
                        alt={post.title}
                      />
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2 flex-1">
                        {post.description}
                      </p>
                      <div className="mt-4 flex items-center gap-3 pt-4 border-t border-slate-100">
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={urlFor(post.author.image).url()!}
                          alt={post.author.name}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {post.author.name}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">
                No stories yet — be the first to publish on Empower.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────── */}
      <section className="bg-brand-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Your story deserves to be heard
          </h2>
          <p className="mt-4 text-lg text-brand-100 max-w-xl mx-auto">
            Whether you want to write, volunteer, or donate — there is a place
            for you at Empower.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/get-involved" className="btn-accent px-8 py-3 text-base">
              Get Involved
            </Link>
            <Link href="/our-programs" className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-white/10">
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    author-> {
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

  let posts: Post[] = [];
  try {
    posts = await sanityClient.fetch(query);
  } catch {
    posts = [];
  }

  return { props: { posts } };
};
