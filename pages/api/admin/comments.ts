import type { NextApiRequest, NextApiResponse } from "next";
import { adminClient, checkAdminAuth } from "../../../lib/sanityAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!checkAdminAuth(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const comments = await adminClient.fetch(
        `*[_type == "comment"] | order(_createdAt desc) {
          _id, name, email, comment, approved, _createdAt,
          "postTitle": post->title
        }`
      );
      return res.status(200).json(comments);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch comments", details: err });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { id, approved } = req.body;
      if (!id) return res.status(400).json({ error: "id is required" });

      await adminClient.patch(id).set({ approved: !!approved }).commit();
      return res.status(200).json({ message: "Updated" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to update comment", details: err });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id is required" });
      await adminClient.delete(id);
      return res.status(200).json({ message: "Deleted" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete comment", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
