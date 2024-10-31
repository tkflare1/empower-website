import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>TKFLARE Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="flex justify-between items-center bg-blue-300 border-y border-black py-10 lg:py-0 relative">
        <div className="px-10 space-y-5 z-10">
          <h1 className="text-5xl max-w-xl font-serif text-white">
            <span className="underline decoration-black decoration-4 text-black">
              Empower
            </span>{" "}
            is your canvas for ideas, stories, and inspiration
          </h1>
          <h2 className="text-lg text-gray-100">
          Share your story, elevate marginalized perspectives, and engage with a community dedicated to amplifying underrepresented voices and fostering meaningful change.
          </h2>
        </div>

        <img
          className="hidden md:inline-flex h-32 lg:h-full opacity-90 shadow-lg"
          src="/tkfllare-logo.jpg" // Ensure this path is correct for the TKLARE logo
          alt="TKLARE Logo"
          width={120}
          height={120}
        />
        
        {/* Sparkles effect for background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-80 z-0" />
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
        {posts.map((post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className="border rounded-lg group cursor-pointer overflow-hidden">
              <img
                className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                src={urlFor(post.mainImage).url()!}
                alt={post.title}
              />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs text-gray-600">
                    {post.description} by {post.author.name}
                  </p>
                </div>

                <img
                  className="h-12 w-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt={post.author.name}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
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

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    },
  };
};
