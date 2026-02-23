import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../lib/adminAuth";

export default function AdminComments() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    try {
      const res = await adminFetch("/api/admin/comments");
      if (res.ok) setComments(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id: string, approved: boolean) {
    try {
      const res = await adminFetch("/api/admin/comments", {
        method: "PATCH",
        body: JSON.stringify({ id, approved }),
      });
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, approved } : c))
        );
      }
    } catch {
      alert("Failed to update comment");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this comment permanently?")) return;
    try {
      const res = await adminFetch("/api/admin/comments", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== id));
      }
    } catch {
      alert("Failed to delete comment");
    }
  }

  const filtered = comments.filter((c) => {
    if (filter === "pending") return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  const pendingCount = comments.filter((c) => !c.approved).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comments</h1>
          <p className="text-sm text-slate-500 mt-1">
            {pendingCount > 0
              ? `${pendingCount} comment${pendingCount !== 1 ? "s" : ""} awaiting review`
              : "All comments reviewed"}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
              filter === f
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {f}
            {f === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-100 text-red-600 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <p className="text-slate-500">
            {filter === "all" ? "No comments yet" : `No ${filter} comments`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((comment: any) => (
            <div
              key={comment._id}
              className={`bg-white rounded-xl border p-5 transition-colors ${
                comment.approved ? "border-slate-200" : "border-amber-200 bg-amber-50/30"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-slate-900">
                      {comment.name}
                    </span>
                    {!comment.approved && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        Pending
                      </span>
                    )}
                    {comment.approved && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                        Approved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2">
                    {comment.email} &middot;{" "}
                    {new Date(comment._createdAt).toLocaleDateString()} &middot;{" "}
                    on <span className="text-slate-600">{comment.postTitle || "Unknown post"}</span>
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {comment.comment}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {!comment.approved ? (
                    <button
                      onClick={() => handleApprove(comment._id, true)}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(comment._id, false)}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
