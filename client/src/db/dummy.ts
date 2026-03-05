import { Post } from "@/types/Post";
import { slugifySentences } from "@/utils";

export const dummyPosts: Post[] = [
  {
    id: 1,
    title: "Welcome to Neon Tutorial",
    content: "This is a test post",
    author: "John Doe",
    author_id: "1",
    slug: slugifySentences("Welcome to Neon Tutorial"),
    created_at: new Date(),
  },
  {
    id: 2,
    title: "Hello World",
    content: "This is a test post",
    author: "Jane Doe",
    author_id: "1",
    slug: slugifySentences("Hello World"),
    created_at: new Date(),
  },
];
