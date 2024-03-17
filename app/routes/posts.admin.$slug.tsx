import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, redirect, useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";

import { deletePost, getPost, updatePost } from "~/models/post.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");

  const post = await getPost(params.slug);
  invariant(post, `Post not found for slug: ${params.slug}`);

  const html = marked(post.markdown);
  return json({ html, post });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  switch (actionType) {
    case "update": {
      const slug = formData.get("slug");
      const title = formData.get("title");
      const markdown = formData.get("markdown");

      invariant(typeof slug === "string", "slug must be a string");
      invariant(typeof title === "string", "title must be a string");
      invariant(typeof markdown === "string", "markdown must be a string");

      await updatePost(slug, { title, markdown });
      break;
    }
    case "delete": {
      const slug = formData.get("slug");
      invariant(typeof slug === "string", "slug must be a string");

      await deletePost(slug);

      break;
    }
    default:
      break;
  }
  return redirect("/posts/admin");
};

export default function EditPost() {
  const { post } = useLoaderData<typeof loader>();
  return (
    <Form method="post" className="space-y-6">
      <main className="mx-auto max-w-4xl px-4 py-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={post.title}
          required
          className="mb-8 text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400"
        />
        <article className="prose lg:prose-xl mx-auto text-white">
          <textarea
            id="markdown"
            name="markdown"
            defaultValue={post.markdown}
            className="prose lg:prose-xl mx-auto text-white bg-inherit w-full p-1"
          />
        </article>
      </main>
      <div className="text-right space-x-4">
        <button
          type="submit"
          name="_action"
          value="update"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          Update
        </button>
        <input type="hidden" name="slug" value={post.slug} />
        <button
          type="submit"
          name="_action"
          value="delete"
          className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-red-300"
        >
          Delete
        </button>
      </div>
    </Form>
  );
}
