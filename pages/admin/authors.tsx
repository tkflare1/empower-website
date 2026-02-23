import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../lib/adminAuth";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState({ name: "", bio: "", imageAssetId: "" });

  useEffect(() => {
    loadAuthors();
  }, []);

  async function loadAuthors() {
    try {
      const res = await adminFetch("/api/admin/authors");
      if (res.ok) setAuthors(await res.json());
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImagePreview(URL.createObjectURL(file));

    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      const res = await adminFetch("/api/admin/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64, filename: file.name, contentType: file.type }),
      });

      if (res.ok) {
        const { assetId } = await res.json();
        setForm((f) => ({ ...f, imageAssetId: assetId }));
      } else {
        alert("Image upload failed");
        setImagePreview(null);
      }
    } catch {
      alert("Image upload failed");
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;

    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/authors", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", bio: "", imageAssetId: "" });
        setImagePreview(null);
        setShowForm(false);
        loadAuthors();
      } else {
        alert("Failed to create author");
      }
    } catch {
      alert("Failed to create author");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete author "${name}"? This may break posts referencing this author.`)) return;
    try {
      const res = await adminFetch("/api/admin/authors", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAuthors((prev) => prev.filter((a) => a._id !== id));
      }
    } catch {
      alert("Failed to delete author");
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Authors</h1>
          <p className="text-sm text-slate-500 mt-1">Manage writer profiles</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "Add Author"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-slate-200 p-6 mb-8 space-y-4">
          <h3 className="font-bold text-slate-900">New Author</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Author name"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Profile Photo</label>
              {imagePreview ? (
                <div className="flex items-center gap-3">
                  <img src={imagePreview} alt="" className="w-10 h-10 rounded-full object-cover" />
                  {uploadingImage ? (
                    <span className="text-xs text-brand-600 animate-pulse">Uploading...</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setForm(f => ({...f, imageAssetId: ""})); }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ) : (
                <label className="flex items-center gap-2 cursor-pointer text-sm text-brand-600 hover:text-brand-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Short author bio"
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={saving || uploadingImage}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "Creating..." : "Create Author"}
          </button>
        </form>
      )}

      {/* Authors list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <p className="text-slate-500">No authors yet</p>
          <button onClick={() => setShowForm(true)} className="text-brand-600 text-sm font-medium mt-2 hover:underline">
            Create your first author
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {authors.map((author: any) => (
            <div key={author._id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
              {author.imageUrl ? (
                <img src={author.imageUrl} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-600 font-bold text-lg">
                    {author.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm">{author.name}</p>
                <p className="text-xs text-slate-400">/{author.slug?.current}</p>
              </div>
              <button
                onClick={() => handleDelete(author._id, author.name)}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
