import type { NextApiRequest, NextApiResponse } from "next";
import { adminClient, checkAdminAuth } from "../../../lib/sanityAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!checkAdminAuth(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const authors = await adminClient.fetch(
        `*[_type == "author"] | order(name asc) {
          _id, name, slug,
          "imageUrl": image.asset->url
        }`
      );
      return res.status(200).json(authors);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch authors", details: err });
    }
  }

  if (req.method === "POST") {
    try {
      const { name, bio, imageAssetId } = req.body;
      if (!name) return res.status(400).json({ error: "name is required" });

      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const doc: { _type: string; [key: string]: any } = {
        _type: "author",
        name,
        slug: { _type: "slug", current: slug },
      };

      if (bio) {
        doc.bio = [
          {
            _type: "block",
            _key: "bio1",
            style: "normal",
            markDefs: [],
            children: [{ _type: "span", _key: "bio1s", text: bio, marks: [] }],
          },
        ];
      }

      if (imageAssetId) {
        doc.image = {
          _type: "image",
          asset: { _type: "reference", _ref: imageAssetId },
        };
      }

      const created = await adminClient.create(doc);
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: "Failed to create author", details: err });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id is required" });
      await adminClient.delete(id);
      return res.status(200).json({ message: "Deleted" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete author", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
