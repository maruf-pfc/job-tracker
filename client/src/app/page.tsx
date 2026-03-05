import Link from "next/link";
import { getAllPosts } from "@/db/actions";
import { formatDateString } from "@/utils";
import Metadata from "next";

export const metadata: Metadata = {
  title: "Latest Posts | Neon Blog",
  description: "A modern, professional blog layout built with Next.js.",
};

export default async function Home() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          No Posts Yet
        </h2>
        <p className="text-slate-500 mb-6">
          There&apos;s nothing here. Why not be the first to create a post?
        </p>
        <Link
          href="/posts/create"
          className="inline-block px-5 py-2.5 font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-all duration-200"
        >
          Create Post
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Latest Posts
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore the latest ideas, tutorials, and stories from our community.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group flex flex-col bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* Card Body */}
            <div className="p-6 flex-grow">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-500 transition-colors duration-200 mb-2">
                {post.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Card Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-3 text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span>{formatDateString(post.created_at)}</span>
              {post.author && (
                <span className="font-medium">By {post.author}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
