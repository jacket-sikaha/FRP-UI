import { optJSONPath } from "@/lib/getBaseUrl";
import { readJSONFile, updateFile } from "@/lib/getBaseUrl";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json(readJSONFile(optJSONPath));
}

export async function POST(request: Request) {
  updateFile(optJSONPath, JSON.stringify(await request.json()));
  return NextResponse.json({ res: "success" });
}
