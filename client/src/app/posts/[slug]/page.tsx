"use client";

import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { useEffect, useState, useCallback, useRef } from "react";
import remarkGfm from "remark-gfm";
import { formatDateString } from "@/utils";
import type { Post } from "@/types/Post";
import { useUser } from "@clerk/nextjs";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { User, Calendar, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

//=========================//
// Skeleton Loading State  //
//=========================//
function PostSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4 mb-4" />
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2 mb-12" />
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-full" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6" />
        </div>
        <div className="space-y-3">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-full" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-full" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4" />
        </div>
      </div>
    </div>
  );
}

//=========================//
// Code Block Component    //
//=========================//
function CodeBlock({
  inline,
  className,
  children,
  ...props
}: {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  // Highlight code whenever children or className changes
  useEffect(() => {
    if (codeRef.current && !inline) {
      hljs.highlightElement(codeRef.current);
    }
  }, [children, inline]);

  const handleCopy = () => {
    if (codeRef.current?.textContent) {
      navigator.clipboard.writeText(codeRef.current.textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!inline) {
    const languageMatch = /language-(\w+)/.exec(className || "");
    const language = languageMatch ? languageMatch[1] : "text";

    return (
      <div className="my-6 rounded-xl border dark:border-slate-800 bg-slate-900/70 text-sm">
        <div className="flex items-center justify-between px-4 py-2 border-b dark:border-slate-800">
          <span className="text-xs font-mono text-slate-400">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check size={14} className="text-emerald-400" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code ref={codeRef} {...props} className={`hljs ${className}`}>
            {children}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <code
      className="bg-slate-200 dark:bg-slate-700/50 rounded-md px-1.5 py-1 text-sm font-mono"
      {...props}
    >
      {children}
    </code>
  );
}

//=========================//
// Main Post Page          //
//=========================//
export default function Post() {
  const router = useRouter();
  const { isLoaded, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const params = useParams<{ slug: string }>();

  const fetchPostDetails = useCallback(async () => {
    if (!params.slug) return;

    setLoading(true);
    try {
      const res = await fetch("/api/posts/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: params.slug }),
      });
      if (!res.ok) throw new Error("Failed to fetch post");
      const { data } = await res.json();
      setPost(data);
    } catch (err) {
      console.error(err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [params.slug]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  const deletePost = async () => {
    if (!post) return;
    if (
      confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      try {
        const res = await fetch("/api/posts/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: post.id }),
        });
        const { message } = await res.json();
        toast.success(message);
        router.push("/");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete post.");
      }
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:py-12">
        <PostSkeleton />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold">Post not found</h2>
        <p className="text-slate-500 mt-4">
          Sorry, we couldn&apos;t find the post you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-10 border-b pb-8 border-slate-200 dark:border-slate-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-4">
          <div className="flex items-center gap-x-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDateString(post.created_at)}</span>
            </div>
          </div>
          {user?.id === post.author_id && (
            <button
              onClick={deletePost}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-red-600 dark:text-red-500 hover:bg-red-500/10 rounded-md transition-colors self-start"
            >
              <Trash2 size={14} />
              Delete Post
            </button>
          )}
        </div>
      </header>

      <div className="prose prose-slate dark:prose-invert lg:prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{ code: CodeBlock }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
