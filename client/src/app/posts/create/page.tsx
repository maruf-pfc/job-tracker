"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { slugifySentences } from "@/utils";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// Dynamically import MDEditor to prevent SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function PostCreate() {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishing, setPublishing] = useState(false);

  if (!isLoaded) return <p className="text-center py-10">Loading...</p>;

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast("Title and content cannot be empty");
      return;
    }

    setPublishing(true);
    try {
      const slug = slugifySentences(trimmedTitle);

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          author: user.firstName || "Unknown",
          author_id: user.id,
          slug,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create post");

      toast.success(data.message);
      router.push(`/posts/${slug}`);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) toast.error(err.message);
      else toast.error("Failed to create post");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-slate-50 dark:bg-slate-900">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 dark:text-blue-400 mb-10">
          Create a New Post
        </h1>

        <form
          onSubmit={handleCreatePost}
          className="flex flex-col w-full bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-slate-700"
        >
          {/* Title */}
          <label
            htmlFor="title"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Post Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title..."
            className="mb-6 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-slate-100 transition"
          />

          {/* Content */}
          <label
            htmlFor="content"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Content
          </label>
          <div className="mb-6">
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")} // ✅ fixed typing issue
              height={300}
              preview="edit"
              className="bg-white dark:bg-slate-800 rounded-lg"
            />
          </div>

          {/* Publish Button */}
          <button
            type="submit"
            disabled={publishing}
            className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {publishing ? "Publishing... please wait" : "Publish Post"}
          </button>
        </form>
      </main>
    </div>
  );
}
