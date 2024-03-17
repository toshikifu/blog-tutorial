import { Post } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getPosts(): Promise<Post[]> {
  return prisma.post.findMany();
}

export function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">,
) {
  return prisma.post.create({ data: post });
}

export async function updatePost(
  slug: string,
  post: Pick<Post, "title" | "markdown">,
) {
  return prisma.post.update({ where: { slug }, data: post });
}

export async function deletePost(slug: string) {
  return prisma.post.delete({ where: { slug } });
}
