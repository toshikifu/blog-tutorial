import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export default function Posts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <main className="bg-gradient-to-r from-blue-200 to-purple-300 text-white p-4 rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mt-8 mb-4 text-center">
        Posts
      </h1>
      <ul className="shadow-md rounded-lg overflow-hidden">
        {posts.map((post) => (
          <li
            key={post.slug}
            className="border-b last:border-0 border-gray-200"
          >
            <Link
              to={post.slug}
              className="block p-4 hover:bg-blue-50 focus:bg-blue-100 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
            >
              {post.title}
            </Link>
          </li>
        ))}
        <Link
          to="admin"
          className="block p-4 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-150"
        >
          Admin
        </Link>
      </ul>
    </main>
  );
}
