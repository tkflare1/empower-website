import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";

const client = createClient({
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2023-05-03",
});

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { _id, name, email, comment } = JSON.parse(req.body);

  try {
    await client.create({
      _type: "comment",
      post: { _type: "reference", _ref: _id },
      name,
      email,
      comment,
    });
  } catch (err) {
    return res.status(500).json({ message: "Could not submit comment", err });
  }

  return res.status(200).json({ message: "Comment submitted" });
}
