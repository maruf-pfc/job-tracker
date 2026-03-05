import { deletePost } from "@/db/actions";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
  try {
    await deletePost(id);
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error occurred", err },
      { status: 400 }
    );
  }
}
