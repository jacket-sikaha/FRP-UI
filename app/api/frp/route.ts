import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const res = await fetch("http://localhost:3000/api/test");
  const data = await res.json();

  return NextResponse.json({ data });
}
