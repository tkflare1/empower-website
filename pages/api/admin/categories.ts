import type { NextApiRequest, NextApiResponse } from "next";
import { adminClient, checkAdminAuth } from "../../../lib/sanityAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers["x-admin-token"] as string | undefined;
  if (!checkAdminAuth(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const categories = await adminClient.fetch(
        `*[_type == "category"] | order(title asc) { _id, title, description }`
      );
      return res.status(200).json(categories);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch categories", details: err });
    }
  }

  if (req.method === "POST") {
    try {
      const { title, description } = req.body;
      if (!title) return res.status(400).json({ error: "title is required" });

      const created = await adminClient.create({
        _type: "category",
        title,
        description: description || "",
      });
      return res.status(201).json(created);
    } catch (err) {
      return res.status(500).json({ error: "Failed to create category", details: err });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
