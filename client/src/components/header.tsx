"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Feather } from "lucide-react"; // Awesome icons!
import { ModeToggle } from "./ModeToggle";

// A reusable link component for consistency
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200"
  >
    {children}
  </Link>
);

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Feather className="h-7 w-7 text-sky-500" />
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Neon
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav>
            <Link href="/jobs" className="mx-2">
              Jobs
            </Link>
            <Link href="/messages" className="mx-2">
              Messages
            </Link>
            <Link href="/interview-questions" className="mx-2">
              Interview Q&A
            </Link>
          </nav>
          <UserButton afterSignOutUrl="/" />

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4 px-4 pt-2 pb-4 border-t border-slate-200 dark:border-slate-800">
          <SignedIn>
            <NavLink href="/posts/create">Create Post</NavLink>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <UserButton
                showName
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                  },
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-all duration-200">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
