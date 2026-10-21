import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data", "portfolio-custom.json");

export async function GET() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf-8");
      const data = JSON.parse(content);
      return NextResponse.json({ success: true, data });
    }
    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    console.error("Error reading portfolio custom data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ success: true, message: "Portfolio data saved successfully" });
  } catch (error: any) {
    console.error("Error saving portfolio custom data:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
