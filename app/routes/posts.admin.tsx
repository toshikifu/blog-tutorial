import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

export default function PostAdmin() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-4xl">
      <main className="mx-auto max-w-4xl px-4 py-8 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
        <h1 className="mb-2 text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">
          Blog Admin
        </h1>
      </main>
      <div className="grid grid-cols-4 gap-6 m-4">
        <nav className="col-span-4 md:col-span-1">
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="bg-white hover:bg-slate-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <Link
                  to={post.slug}
                  className="block p-4 text-blue-600 hover:text-blue-800 underline"
                >
                  {post.title}
                </Link>
              </li>
            ))}
            <li className="bg-blue-100 hover:bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <Link
                to="new"
                className="block p-4 text-blue-600 hover:text-blue-800 underline"
              >
                Create a new post
              </Link>
            </li>
            <li className="bg-green-100 hover:bg-green-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <Link
                to={"/posts"}
                className="block p-4 text-green-600 hover:text-green-800 underline"
              >
                Home
              </Link>
            </li>
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
