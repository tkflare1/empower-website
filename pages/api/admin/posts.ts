import type { NextApiRequest, NextApiResponse } from "next";
import { adminClient, checkAdminAuth, generateKey } from "../../../lib/sanityAdmin";
import { markdownToBlocks } from "../../../lib/markdownToBlocks";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!checkAdminAuth(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const posts = await adminClient.fetch(
        `*[_type == "post"] | order(_createdAt desc) {
          _id, title, description, slug, publishedAt, _createdAt,
          author-> { _id, name },
          "mainImageUrl": mainImage.asset->url
        }`
      );
      return res.status(200).json(posts);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch posts", details: err });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description, slug, authorId, mainImageAssetId, body, publishedAt } = req.body;

      if (!title || !slug || !authorId) {
        return res.status(400).json({ error: "title, slug, and authorId are required" });
      }

      const blocks = body ? markdownToBlocks(body) : [];

      const doc: { _type: string; [key: string]: any } = {
        _type: "post",
        title,
        description: description || "",
        slug: { _type: "slug", current: slug },
        author: { _type: "reference", _ref: authorId },
        body: blocks,
        publishedAt: publishedAt || new Date().toISOString(),
      };

      if (mainImageAssetId) {
        doc.mainImage = {
          _type: "image",
          asset: { _type: "reference", _ref: mainImageAssetId },
        };
      }

      const created = await adminClient.create(doc);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: "Failed to create post", details: err });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id is required" });
      await adminClient.delete(id);
      return res.status(200).json({ message: "Deleted" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete post", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
