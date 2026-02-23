import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../lib/adminAuth";

export default function NewPost() {
  const router = useRouter();
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    slug: "",
    authorId: "",
    body: "",
    mainImageAssetId: "",
  });

  useEffect(() => {
    adminFetch("/api/admin/authors")
      .then((r) => r.json())
      .then(setAuthors)
      .catch(() => {});
  }, []);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: slugify(title) }));
  };

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
        body: JSON.stringify({
          data: base64,
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (res.ok) {
        const { assetId } = await res.json();
        setForm((f) => ({ ...f, mainImageAssetId: assetId }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.slug || !form.authorId) {
      alert("Title, slug, and author are required");
      return;
    }

    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/admin/posts");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create post");
      }
    } catch {
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdownPreview = (md: string) => {
    return md
      .split("\n")
      .map((line) => {
        if (line.startsWith("#### ")) return `<h4 class="text-base font-bold mt-4 mb-1">${line.slice(5)}</h4>`;
        if (line.startsWith("### ")) return `<h3 class="text-lg font-bold mt-5 mb-2">${line.slice(4)}</h3>`;
        if (line.startsWith("## ")) return `<h2 class="text-xl font-bold mt-6 mb-2">${line.slice(3)}</h2>`;
        if (line.startsWith("# ")) return `<h1 class="text-2xl font-bold mt-6 mb-3">${line.slice(2)}</h1>`;
        if (line.startsWith("> ")) return `<blockquote class="border-l-4 border-brand-300 pl-4 italic text-slate-600 my-2">${line.slice(2)}</blockquote>`;
        if (line.match(/^[\-\*]\s/)) return `<li class="ml-5 list-disc text-slate-700">${line.slice(2)}</li>`;
        if (line.trim() === "") return "<br/>";
        let html = line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-brand-600 underline">$1</a>');
        return `<p class="text-slate-700 leading-relaxed my-1">${html}</p>`;
      })
      .join("");
  };

  const insertMarkdown = useCallback((prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("body-editor") as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = form.body.slice(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    const newBody = form.body.slice(0, start) + replacement + form.body.slice(end);
    setForm((f) => ({ ...f, body: newBody }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
    }, 0);
  }, [form.body]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Create New Post</h1>
        <p className="text-sm text-slate-500 mt-1">Write and publish a new article</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Your article title"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-semibold focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
            required
          />
        </div>

        {/* Slug (auto-generated) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Slug
            <span className="text-slate-400 font-normal ml-1">(auto-generated from title)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">/post/</span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none font-mono"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief summary of the article"
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
          <select
            value={form.authorId}
            onChange={(e) => setForm((f) => ({ ...f, authorId: e.target.value }))}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none bg-white"
            required
          >
            <option value="">Select an author</option>
            {authors.map((a: any) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Don&apos;t see the author?{" "}
            <a href="/admin/authors" className="text-brand-600 underline" target="_blank">
              Create one first
            </a>
          </p>
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-brand-400 transition-colors">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-cover" />
                {uploadingImage && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                    <span className="text-sm text-brand-600 font-medium animate-pulse">Uploading...</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setForm((f) => ({ ...f, mainImageAssetId: "" }));
                  }}
                  className="mt-3 text-sm text-red-500 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <svg className="w-10 h-10 text-slate-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                <p className="text-sm text-slate-500">Click to upload an image</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP up to 10MB</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Body editor */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">Body</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPreviewMode(false)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  !previewMode ? "bg-brand-100 text-brand-700" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode(true)}
                className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                  previewMode ? "bg-brand-100 text-brand-700" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Formatting toolbar */}
          {!previewMode && (
            <div className="flex flex-wrap gap-1 mb-2 p-2 bg-slate-50 rounded-t-lg border border-b-0 border-slate-300">
              <button type="button" onClick={() => insertMarkdown("# ")} className="px-2 py-1 text-xs font-bold bg-white rounded border border-slate-200 hover:bg-slate-100" title="Heading 1">H1</button>
              <button type="button" onClick={() => insertMarkdown("## ")} className="px-2 py-1 text-xs font-bold bg-white rounded border border-slate-200 hover:bg-slate-100" title="Heading 2">H2</button>
              <button type="button" onClick={() => insertMarkdown("### ")} className="px-2 py-1 text-xs font-bold bg-white rounded border border-slate-200 hover:bg-slate-100" title="Heading 3">H3</button>
              <span className="w-px h-6 bg-slate-200 mx-1" />
              <button type="button" onClick={() => insertMarkdown("**", "**")} className="px-2 py-1 text-xs font-bold bg-white rounded border border-slate-200 hover:bg-slate-100" title="Bold"><strong>B</strong></button>
              <button type="button" onClick={() => insertMarkdown("*", "*")} className="px-2 py-1 text-xs italic bg-white rounded border border-slate-200 hover:bg-slate-100" title="Italic"><em>I</em></button>
              <button type="button" onClick={() => insertMarkdown("[", "](url)")} className="px-2 py-1 text-xs bg-white rounded border border-slate-200 hover:bg-slate-100" title="Link">Link</button>
              <span className="w-px h-6 bg-slate-200 mx-1" />
              <button type="button" onClick={() => insertMarkdown("> ")} className="px-2 py-1 text-xs bg-white rounded border border-slate-200 hover:bg-slate-100" title="Quote">Quote</button>
              <button type="button" onClick={() => insertMarkdown("- ")} className="px-2 py-1 text-xs bg-white rounded border border-slate-200 hover:bg-slate-100" title="Bullet list">List</button>
            </div>
          )}

          {previewMode ? (
            <div
              className="min-h-[300px] rounded-lg border border-slate-300 p-5 bg-white prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(form.body) || '<p class="text-slate-400">Nothing to preview yet...</p>' }}
            />
          ) : (
            <textarea
              id="body-editor"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder={"Write your article here using markdown...\n\n# Heading\n\nA paragraph with **bold** and *italic* text.\n\n> A blockquote\n\n- Bullet point\n- Another point\n\n[Link text](https://example.com)"}
              rows={18}
              className="w-full rounded-b-lg border border-slate-300 px-4 py-3 text-sm font-mono leading-relaxed focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-y"
            />
          )}
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
