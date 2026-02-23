import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../lib/adminAuth";

interface Stats {
  posts: number;
  authors: number;
  comments: number;
  pending: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ posts: 0, authors: 0, comments: 0, pending: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, authorsRes, commentsRes] = await Promise.all([
          adminFetch("/api/admin/posts"),
          adminFetch("/api/admin/authors"),
          adminFetch("/api/admin/comments"),
        ]);
        const posts = postsRes.ok ? await postsRes.json() : [];
        const authors = authorsRes.ok ? await authorsRes.json() : [];
        const comments = commentsRes.ok ? await commentsRes.json() : [];

        setStats({
          posts: posts.length,
          authors: authors.length,
          comments: comments.length,
          pending: comments.filter((c: any) => !c.approved).length,
        });
        setRecentPosts(posts.slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    { label: "Posts", value: stats.posts, color: "bg-brand-50 text-brand-700", href: "/admin/posts" },
    { label: "Authors", value: stats.authors, color: "bg-emerald-50 text-emerald-700", href: "/admin/authors" },
    { label: "Comments", value: stats.comments, color: "bg-amber-50 text-amber-700", href: "/admin/comments" },
    { label: "Pending Review", value: stats.pending, color: "bg-red-50 text-red-700", href: "/admin/comments" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of your Empower content</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {statCards.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className={`${card.color} rounded-xl p-5 transition-shadow hover:shadow-md`}
              >
                <p className="text-3xl font-bold">{card.value}</p>
                <p className="text-sm font-medium mt-1 opacity-80">{card.label}</p>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Link
              href="/admin/new-post"
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-100 text-brand-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">New Post</p>
                <p className="text-xs text-slate-500">Write an article</p>
              </div>
            </Link>
            <Link
              href="/admin/authors"
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Add Author</p>
                <p className="text-xs text-slate-500">Create a profile</p>
              </div>
            </Link>
            <Link
              href="/admin/comments"
              className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 text-amber-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Moderate</p>
                <p className="text-xs text-slate-500">{stats.pending} comments pending</p>
              </div>
            </Link>
          </div>

          {recentPosts.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Recent Posts</h2>
                <Link href="/admin/posts" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                  View all
                </Link>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                {recentPosts.map((post: any) => (
                  <div key={post._id} className="flex items-center gap-4 px-5 py-4">
                    {post.mainImageUrl && (
                      <img src={post.mainImageUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">{post.title}</p>
                      <p className="text-xs text-slate-500">
                        by {post.author?.name || "Unknown"} &middot;{" "}
                        {new Date(post._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </AdminLayout>
  );
}
