import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../lib/adminAuth";

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const res = await adminFetch("/api/admin/posts");
      if (res.ok) setPosts(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await adminFetch("/api/admin/posts", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      } else {
        alert("Failed to delete post");
      }
    } catch {
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Posts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all published articles</p>
        </div>
        <Link href="/admin/new-post" className="btn-primary">
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-slate-500">No posts yet</p>
          <Link href="/admin/new-post" className="text-brand-600 text-sm font-medium mt-2 inline-block hover:underline">
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {posts.map((post: any) => (
            <div key={post._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              {post.mainImageUrl ? (
                <img src={post.mainImageUrl} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                  </svg>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">{post.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  by {post.author?.name || "Unknown"} &middot; {new Date(post._createdAt).toLocaleDateString()}
                </p>
                {post.description && (
                  <p className="text-xs text-slate-400 mt-1 truncate">{post.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={`/post/${post.slug?.current}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(post._id, post.title)}
                  disabled={deleting === post._id}
                  className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deleting === post._id ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
