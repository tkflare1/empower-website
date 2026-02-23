import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { sanityClient, urlFor } from "../../sanity";
import type { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

function PostPage({ post }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitted(false));
  };

  return (
    <>
      <Head>
        <title>{post.title} — Empower</title>
        <meta name="description" content={post.description} />
      </Head>

      <Header />

      {/* Hero image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={urlFor(post.mainImage).url() || undefined}
          alt={post.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
      </div>

      <main className="relative -mt-20 z-10">
        <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Stories
          </Link>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>
          <p className="mt-3 text-lg text-slate-500">{post.description}</p>

          <div className="flex items-center gap-3 mt-6 pb-8 border-b border-slate-100">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={urlFor(post.author.image).url() || undefined}
              alt={post.author.name}
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">{post.author.name}</p>
              <p className="text-xs text-slate-400">
                {new Date(post._createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="prose prose-slate prose-lg max-w-none mt-8">
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              content={post.body}
              serializers={{
                h1: (props: any) => <h1 className="text-3xl font-bold mt-10 mb-4" {...props} />,
                h2: (props: any) => <h2 className="text-2xl font-bold mt-8 mb-3" {...props} />,
                h3: (props: any) => <h3 className="text-xl font-bold mt-6 mb-2" {...props} />,
                li: ({ children }: any) => <li className="ml-4 list-disc">{children}</li>,
                link: ({ href, children }: any) => (
                  <a href={href} className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                blockquote: ({ children }: any) => (
                  <blockquote className="border-l-4 border-brand-400 pl-4 italic text-slate-600">{children}</blockquote>
                ),
              }}
            />
          </div>
        </article>

        {/* ── Comments section ──────────────────────── */}
        <div className="max-w-3xl mx-auto mt-12 mb-20 px-4">
          <hr className="border-slate-200 mb-12" />

          {submitted ? (
            <div className="rounded-2xl bg-brand-50 border border-brand-200 p-8 text-center">
              <h3 className="text-2xl font-bold text-brand-800">
                Thank you for your comment!
              </h3>
              <p className="mt-2 text-brand-600">
                Once approved, it will appear below.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Leave a comment</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Enjoyed this article? We&apos;d love to hear your thoughts.
                </p>
              </div>

              <input {...register("_id")} type="hidden" value={post._id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Name</span>
                  <input
                    {...register("name", { required: true })}
                    type="text"
                    placeholder="Your name"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                  {errors.name && <span className="text-xs text-red-500 mt-1">Name is required</span>}
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  />
                  {errors.email && <span className="text-xs text-red-500 mt-1">Email is required</span>}
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Comment</span>
                <textarea
                  {...register("comment", { required: true })}
                  rows={5}
                  placeholder="Share your thoughts…"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm shadow-sm transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-y"
                />
                {errors.comment && <span className="text-xs text-red-500 mt-1">Comment is required</span>}
              </label>

              <button type="submit" className="btn-primary">
                Submit Comment
              </button>
            </form>
          )}

          {/* Existing comments */}
          {post.comments && post.comments.length > 0 && (
            <div className="mt-12 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">
                {post.comments.length} Comment{post.comments.length !== 1 && "s"}
              </h3>
              {post.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-xl bg-slate-50 border border-slate-100 p-5"
                >
                  <p className="text-sm font-semibold text-brand-600">
                    {comment.name}
                  </p>
                  <p className="mt-1 text-slate-700 text-sm leading-relaxed">
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default PostPage;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{ _id, slug { current } }`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author-> { name, image },
    'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
    description,
    mainImage,
    slug,
    body[]{
      ...,
      asset->{ _id, url }
    }
  }`;

  const post = await sanityClient.fetch(query, { slug: params?.slug });
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 60 };
};
