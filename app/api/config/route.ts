import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  console.log(await request.text());
  return NextResponse.json("await request.text()");
}
