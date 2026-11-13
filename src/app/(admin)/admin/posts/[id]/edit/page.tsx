"use client";

import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAdminPost, updatePost } from "@/api/services/admin/posts.service";
import { SLUG_PATTERN } from "@/lib/validations/post-test";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadPost() {
      const id = Number(params.id);

      if (!Number.isInteger(id) || id <= 0) {
        setMessage("Invalid post ID.");
        setIsLoading(false);
        return;
      }

      const response = await fetchAdminPost(id);

      if (!response.isOK) {
        setMessage(response.error.displayMessage);
        setIsLoading(false);
        return;
      }

      setTitle(response.data.title);
      setSlug(response.data.slug);
      setExcerpt(response.data.excerpt ?? "");
      setIsLoading(false);
    }

    loadPost();
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    const trimmedExcerpt = excerpt.trim();

    if (!trimmedTitle) {
      setMessage("Title is required.");
      return;
    }

    if (trimmedTitle.length > 200) {
      setMessage("Title is too long.");
      return;
    }

    if (trimmedSlug && !SLUG_PATTERN.test(trimmedSlug)) {
      setMessage("Slug must use lowercase letters, numbers and dashes only.");
      return;
    }

    if (trimmedSlug.length > 250) {
      setMessage("Slug is too long.");
      return;
    }

    if (trimmedExcerpt.length > 500) {
      setMessage("Excerpt is too long.");
      return;
    }

    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      setMessage("Invalid post ID.");
      return;
    }

    setIsSubmitting(true);

    const response = await updatePost(id, {
      title: trimmedTitle,
      slug: trimmedSlug || undefined,
    });

    setIsSubmitting(false);

    if (!response.isOK) {
      setMessage(response.error.displayMessage);
      return;
    }

    setMessage("Post updated successfully.");
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-[#3e4451] bg-[#21252b] p-8 text-center text-sm text-[#828997]">
          Loading post...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
            Edit Post
          </h1>

          <p className="mt-1 text-sm text-[#828997]">Update your blog post.</p>
        </div>

        <Link
          href="/admin/posts"
          className="text-sm font-medium text-[#828997] transition-colors hover:text-[#d19a66]"
        >
          Back to posts
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#3e4451] bg-[#21252b] p-6 shadow-lg shadow-black/20"
      >
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Title
          </label>

          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition-colors placeholder:text-[#5c6370] focus:border-[#d19a66]"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Slug
          </label>

          <input
            id="slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition-colors placeholder:text-[#5c6370] focus:border-[#d19a66]"
            placeholder="post-slug"
          />

          <p className="mt-1.5 text-xs text-[#5c6370]">
            Use lowercase letters, numbers and dashes only.
          </p>
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Excerpt
          </label>

          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition-colors placeholder:text-[#5c6370] focus:border-[#d19a66]"
            placeholder="Short description of the post"
          />
          <p className="mt-1.5 text-xs text-[#5c6370]">
            The current update schema describes excerpt as an object, so text
            cannot be safely sent with the documented contract.
          </p>
        </div>

        <div>
          <label
            htmlFor="content"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Content
          </label>

          <div className="overflow-hidden rounded-lg border border-[#3e4451] bg-white">
            <Editor
              id="content"
              value={content}
              onEditorChange={setContent}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist | link image media table | code fullscreen | removeformat",
                branding: false,
                promotion: false,
              }}
            />
          </div>

          <p className="mt-1.5 text-xs text-[#5c6370]">
            The Blocks API does not document its response shape, so existing
            content cannot be safely loaded or updated here.
          </p>
        </div>

        {message && (
          <p className="rounded-lg border border-[#3e4451] bg-[#282c34] px-4 py-3 text-sm text-[#d19a66]">
            {message}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#d19a66] px-5 py-2.5 text-sm font-semibold text-[#282c34] transition-colors hover:bg-[#e5ad7b] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
