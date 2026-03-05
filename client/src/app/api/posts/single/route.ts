import { getSinglePost } from "@/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { slug } = await req.json();
  try {
    const data = await getSinglePost(slug);
    if (!data)
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    return NextResponse.json(
      { message: "Post fetched", data },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Post not available", err },
      { status: 400 }
    );
  }
}
