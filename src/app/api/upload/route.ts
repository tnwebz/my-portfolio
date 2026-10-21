import { NextResponse } from "next/server";
import crypto from "crypto";
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Try signed upload with Cloudinary credentials
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `timestamp=${timestamp}`;
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + CLOUDINARY_CONFIG.apiSecret)
      .digest("hex");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("api_key", CLOUDINARY_CONFIG.apiKey);
    uploadFormData.append("signature", signature);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    
    let res = await fetch(uploadUrl, {
      method: "POST",
      body: uploadFormData,
    });

    // If signed upload has issues (e.g. folder/preset mismatch), fallback to upload preset
    if (!res.ok) {
      const presetFormData = new FormData();
      presetFormData.append("file", file);
      presetFormData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

      res = await fetch(uploadUrl, {
        method: "POST",
        body: presetFormData,
      });
    }

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Cloudinary upload failed: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      url: data.secure_url || data.url,
      publicId: data.public_id,
    });
  } catch (err: any) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process upload" },
      { status: 500 }
    );
  }
}
