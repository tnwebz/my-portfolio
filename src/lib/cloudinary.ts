// Cloudinary Configuration & Upload Helpers
export const CLOUDINARY_CONFIG = {
  cloudName: "ddq8m4oec",
  uploadPreset: "My-Portfolio",
  apiKey: "922899947654833",
  apiSecret: "DCm8hiANZAr7jfXrtSOFpgbNmVI",
};

/**
 * Uploads an image file to Cloudinary.
 * First tries the server-side /api/upload endpoint for reliability & security.
 * Falls back to direct client-side upload if the endpoint fails.
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  // 1. Try server-side API route first
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return data.url;
      }
    }
  } catch (err) {
    console.warn("Server upload failed, trying direct Cloudinary upload:", err);
  }

  // 2. Direct client-side upload fallback to Cloudinary API
  const directFormData = new FormData();
  directFormData.append("file", file);
  directFormData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  const directRes = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
    {
      method: "POST",
      body: directFormData,
    }
  );

  if (!directRes.ok) {
    const errData = await directRes.json().catch(() => ({}));
    throw new Error(
      errData?.error?.message ||
        `Cloudinary upload failed with status ${directRes.status}`
    );
  }

  const directData = await directRes.json();
  return directData.secure_url || directData.url;
}
