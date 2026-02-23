import type { NextApiRequest, NextApiResponse } from "next";
import { adminClient, checkAdminAuth } from "../../../lib/sanityAdmin";

export const config = {
  api: { bodyParser: { sizeLimit: "10mb" } },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers["x-admin-token"] as string | undefined;
  if (!checkAdminAuth(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { data, filename, contentType } = req.body;

    if (!data) {
      return res.status(400).json({ error: "data (base64) is required" });
    }

    const buffer = Buffer.from(data, "base64");
    const asset = await adminClient.assets.upload("image", buffer, {
      filename: filename || "upload.jpg",
      contentType: contentType || "image/jpeg",
    });

    return res.status(200).json({
      assetId: asset._id,
      url: asset.url,
    });
  } catch (err) {
    return res.status(500).json({ error: "Failed to upload image", details: err });
  }
}
