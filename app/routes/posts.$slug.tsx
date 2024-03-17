import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { marked } from "marked";
import invariant from "tiny-invariant";

import { getPost } from "~/models/post.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "params.slug is required");

  const post = await getPost(params.slug);
  invariant(post, `Post not found for slug: ${params.slug}`);

  const html = marked(post.markdown);
  return json({ html, post });
};
export default function PostSlug() {
  const { html, post } = useLoaderData<typeof loader>();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg">
      <h1 className="mb-8 text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">
        {post.title}
      </h1>
      <article className="prose lg:prose-xl mx-auto text-white">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    </main>
  );
}
