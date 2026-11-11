"use client";

import Image from "next/image";
import Link from "next/link";
import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef, useState } from "react";
import { createPost } from "@/api/services/admin/posts.service";
import { createPostSchema } from "@/lib/validations/post-test";

function parseIds(value: string): number[] {
  return value
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryIds, setCategoryIds] = useState("");
  const [tagIds, setTagIds] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const parsed = createPostSchema.safeParse({
      title,
      excerpt,
      isPublished,
    });

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Invalid form data.");
      return;
    }

    setIsSubmitting(true);

    const response = await createPost({
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      isPublished: parsed.data.isPublished,
      categoryIds: parseIds(categoryIds),
      tagIds: parseIds(tagIds),
    });

    setIsSubmitting(false);

    if (!response.isOK) {
      setMessage(response.error.displayMessage);
      return;
    }

    setMessage("Post created successfully.");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#d7dae0]">
            New Post
          </h1>

          <p className="mt-1 text-sm text-[#828997]">Create a new blog post.</p>
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
            Post content is currently kept in the form. The API must return the
            created post ID before this content can be saved as a text block.
          </p>
        </div>

        <div>
          <label
            htmlFor="categoryIds"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Category IDs
          </label>

          <input
            id="categoryIds"
            value={categoryIds}
            onChange={(event) => setCategoryIds(event.target.value)}
            className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition-colors placeholder:text-[#5c6370] focus:border-[#d19a66]"
            placeholder="Example: 1, 2"
          />

          <p className="mt-1.5 text-xs text-[#5c6370]">
            Enter category IDs separated by commas.
          </p>
        </div>

        <div>
          <label
            htmlFor="tagIds"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Tag IDs
          </label>

          <input
            id="tagIds"
            value={tagIds}
            onChange={(event) => setTagIds(event.target.value)}
            className="w-full rounded-lg border border-[#3e4451] bg-[#282c34] px-3 py-2.5 text-sm text-[#d7dae0] outline-none transition-colors placeholder:text-[#5c6370] focus:border-[#d19a66]"
            placeholder="Example: 1, 2, 3"
          />

          <p className="mt-1.5 text-xs text-[#5c6370]">
            Enter tag IDs separated by commas.
          </p>
        </div>

        <div>
          <label
            htmlFor="cover"
            className="mb-2 block text-sm font-medium text-[#abb2bf]"
          >
            Cover Image
          </label>

          <input
            ref={fileInputRef}
            id="cover"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full cursor-pointer rounded-lg border border-[#3e4451] bg-[#282c34] text-sm text-[#abb2bf] file:mr-4 file:border-0 file:border-r file:border-[#3e4451] file:bg-[#21252b] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-[#d19a66] hover:file:bg-[#282c34]"
          />

          <p className="mt-1.5 text-xs text-[#5c6370]">
            Image preview only. The current API does not accept a cover image
            field yet.
          </p>

          {previewUrl && (
            <div className="mt-4 flex items-start gap-4">
              <div className="relative h-40 w-64 overflow-hidden rounded-lg border border-[#3e4451]">
                <Image
                  src={previewUrl}
                  alt="Cover preview"
                  fill
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
          )}
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(event) => setIsPublished(event.target.checked)}
            className="h-4 w-4 accent-[#d19a66]"
          />

          <span className="text-sm text-[#abb2bf]">Publish immediately</span>
        </label>

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
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
