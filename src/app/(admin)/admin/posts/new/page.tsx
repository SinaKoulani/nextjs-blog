"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPostSchema } from "@/lib/validations/post-test";

type FormMessage = { type: "error" | "success"; text: string };

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<FormMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function clearImage() {
    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      clearImage();
      return;
    }

    if (!file.type.startsWith("image/")) {
      clearImage();
      setMessage({ type: "error", text: "Please choose an image file." });
      return;
    }

    setMessage(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const result = createPostSchema.safeParse({
      title,
      slug: slug.trim() || undefined,
      excerpt: excerpt.trim() || undefined,
      isPublished,
    });

    if (!result.success) {
      setMessage({
        type: "error",
        text: result.error.issues[0]?.message ?? "Invalid form data",
      });
      return;
    }

    setMessage({
      type: "success",
      text: "Mock mode: the post is valid, but nothing was saved.",
    });
    setTitle("");
    setSlug("");
    setExcerpt("");
    setIsPublished(false);
    clearImage();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">New Post</h1>
          <p className="mt-1 text-sm text-[#828997]">
            Create a new blog post.
          </p>
        </div>

        <Link
          href="/admin/posts"
          className="rounded-lg border border-[#3e4451] px-4 py-2.5 text-sm font-medium text-[#abb2bf] transition-colors hover:border-[#d19a66]/40 hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 shadow-lg shadow-black/20 md:p-8">
        {message ? (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={
              message.type === "error"
                ? "rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                : "rounded-lg border border-[#d19a66]/20 bg-[#d19a66]/10 px-3 py-2 text-sm text-[#d19a66]"
            }
          >
            {message.text}
          </p>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-[#abb2bf]">
            Title
          </label>

          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition focus:border-[#d19a66]/60 focus:ring-2 focus:ring-[#d19a66]/20"
            placeholder="Enter post title"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium text-[#abb2bf]">
            Slug (optional)
          </label>

          <input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition focus:border-[#d19a66]/60 focus:ring-2 focus:ring-[#d19a66]/20"
            placeholder="enter-post-slug"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="excerpt" className="text-sm font-medium text-[#abb2bf]">
            Excerpt
          </label>

          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition focus:border-[#d19a66]/60 focus:ring-2 focus:ring-[#d19a66]/20"
            placeholder="Write a short excerpt..."
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium text-[#abb2bf]">
            Cover image
          </label>

          <input
            id="image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-[#828997] file:mr-4 file:rounded-lg file:border file:border-[#3e4451] file:bg-[#282c34] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#abb2bf] hover:file:border-[#d19a66]/40 hover:file:bg-[#d19a66]/10"
          />

          <p className="text-xs text-[#828997]">
            Preview only: the API has no cover image field yet.
          </p>

          {previewUrl ? (
            <div className="space-y-2">
              <div className="relative h-48 w-full overflow-hidden rounded-xl border border-[#3e4451]">
                <Image
                  src={previewUrl}
                  alt="Cover image preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <button
                type="button"
                onClick={clearImage}
                className="text-xs font-medium text-[#828997] hover:text-[#d19a66]"
              >
                Remove image
              </button>
            </div>
          ) : null}
        </div>

        <label className="flex items-center gap-3 text-[#abb2bf]">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="accent-[#d19a66]"
          />

          <span className="text-sm font-medium">Publish immediately</span>
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#d19a66] px-4 py-2.5 text-sm font-semibold text-[#282c34] transition-colors hover:bg-[#e5ad7b]"
          >
            Create Post
          </button>

          <Link
            href="/admin/posts"
            className="rounded-lg border border-[#3e4451] px-4 py-2.5 text-sm font-medium text-[#abb2bf] transition-colors hover:border-[#d19a66]/40 hover:bg-[#d19a66]/10 hover:text-[#d19a66]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
