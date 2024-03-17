import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createPost } from "~/models/post.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title == "string", "title must be a string");
  invariant(typeof slug == "string", "slug must be a string");
  invariant(typeof markdown == "string", "markdown must be a string");

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

const inputClassName =
  "w-full rounded border border-gray-300 shadow-sm px-4 py-2 text-lg leading-6 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function NewPost() {
  const errors = useActionData<typeof action>();

  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "submitting");
  return (
    <Form method="post" className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Post Title:
          {errors?.title ? (
            <span className="text-red-500">{errors.title}</span>
          ) : null}
          <input
            type="text"
            name="title"
            className={`${inputClassName} mt-1`}
          />
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Post Slug:
          {errors?.slug ? (
            <span className="text-red-500">{errors.slug}</span>
          ) : null}
          <input type="text" name="slug" className={`${inputClassName} mt-1`} />
        </label>
      </div>
      <div>
        <label
          htmlFor="markdown"
          className="block text-sm font-medium text-gray-700"
        >
          Markdown:
          {errors?.markdown ? (
            <span className="text-red-500">{errors.markdown}</span>
          ) : null}
        </label>
        <textarea
          id="markdown"
          rows={20}
          name="markdown"
          className={`${inputClassName} mt-1 font-mono`}
        />
      </div>
      <div className="text-right">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
          disabled={isCreating}
        >
          {isCreating ? "Creating..." : "Create Post"}
        </button>
      </div>
    </Form>
  );
}
