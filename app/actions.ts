"use server"

import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import prisma from "../lib/prisma"

export async function claimUsername(formData: FormData) {
  const user = await currentUser()
  
  if (!user) {
    throw new Error("Not authenticated")
  }

  const username = formData.get("username") as string

  // Validate username
  if (!username || username.length < 3) {
    throw new Error("Username must be at least 3 characters")
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error("Username can only contain letters, numbers, and underscores")
  }

  // Create user in database (Prisma will throw if username already exists)
  await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      username: username.toLowerCase(),
      name: user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : null,
    },
  })

  redirect("/")
}

export async function addLink(formData: FormData) {
  const user = await currentUser()
  
  if (!user) {
    throw new Error("Not authenticated")
  }

  const title = formData.get("title") as string
  const url = formData.get("url") as string

  if (!title || !url) {
    throw new Error("Title and URL are required")
  }

  // Find the database user
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) {
    throw new Error("User not found")
  }

  await prisma.link.create({
    data: {
      title,
      url,
      userId: dbUser.id,
    },
  })

  revalidatePath("/")
}

export async function deleteLink(formData: FormData) {
  const user = await currentUser()
  
  if (!user) {
    throw new Error("Not authenticated")
  }

  const linkId = formData.get("linkId") as string

  if (!linkId) {
    throw new Error("Link ID is required")
  }

  // Verify the link belongs to the current user
  const link = await prisma.link.findUnique({
    where: { id: parseInt(linkId) },
    include: { user: true },
  })

  if (!link || link.user.clerkId !== user.id) {
    throw new Error("Link not found or unauthorized")
  }

  await prisma.link.delete({
    where: { id: parseInt(linkId) },
  })

  revalidatePath("/")
}
