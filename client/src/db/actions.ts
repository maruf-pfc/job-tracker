import { Post } from "@/types/Post";
import { db } from ".";
import { postsTable } from "./schema";
import { desc, eq } from "drizzle-orm";

// Create a post
export const createPost = async (post: Omit<Post, "id" | "created_at">) => {
  await db.insert(postsTable).values({
    title: post.title,
    content: post.content,
    author: post.author,
    author_id: post.author_id,
    slug: post.slug,
  });
};

// Get all posts
export const getAllPosts = async () => {
  return await db
    .select()
    .from(postsTable)
    .orderBy(desc(postsTable.created_at));
};

// Get single post by slug
export const getSinglePost = async (slug: string) => {
  return await db.query.postsTable.findFirst({
    where: (post, { eq }) => eq(post.slug, slug),
  });
};

// Delete post by id
export const deletePost = async (id: number) => {
  await db.delete(postsTable).where(eq(postsTable.id, id));
};

// Update post content
export const updatePost = async (content: string, id: number) => {
  await db.update(postsTable).set({ content }).where(eq(postsTable.id, id));
};
