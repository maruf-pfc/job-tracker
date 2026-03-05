import { createPost } from "@/db/actions";
import { Post } from "@/types/Post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data: Omit<Post, "id" | "created_at"> = await req.json();

    // Validate input
    if (!data.title || !data.content || !data.author_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await createPost(data);

    return NextResponse.json(
      { message: "Post created successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/posts/create error:", err);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
