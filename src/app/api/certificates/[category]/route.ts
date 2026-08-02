import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCategoryById } from "@/data/certificates";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".svg"]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const cat = getCategoryById(category);

  if (!cat) {
    return NextResponse.json(
      { error: "Category not found" },
      { status: 404 }
    );
  }

  const dirPath = path.join(process.cwd(), "public", "images", cat.folder);

  try {
    const entries = fs.readdirSync(dirPath);
    const images = entries
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.has(ext);
      })
      .sort((a, b) => {
        // Natural numeric sort: 1.png, 2.png, ... 10.png
        const numA = parseInt(a.replace(/\D/g, ""), 10) || 0;
        const numB = parseInt(b.replace(/\D/g, ""), 10) || 0;
        return numA - numB;
      })
      .map((file) => {
        // URL-encode folder name for spaces/special chars
        const encodedFolder = encodeURIComponent(cat.folder);
        const encodedFile = encodeURIComponent(file);
        return `/images/${encodedFolder}/${encodedFile}`;
      });

    return NextResponse.json({ images, category: cat });
  } catch {
    return NextResponse.json(
      { error: "Could not read certificate folder" },
      { status: 500 }
    );
  }
}
