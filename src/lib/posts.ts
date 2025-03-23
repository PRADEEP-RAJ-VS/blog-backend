"use server"

import { connectToDatabase } from "./mongodb"
import type { Post, PostInput } from "./types"
import { ObjectId } from "mongodb"

export async function getPosts(): Promise<Post[]> {
  try {
    const { db } = await connectToDatabase()
    const posts = await db.collection("posts").find({}).sort({ createdAt: -1 }).toArray()

    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    })) as Post[]
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return []
  }
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const { db } = await connectToDatabase()
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) })

    if (!post) return null

    return {
      ...post,
      _id: post._id.toString(),
    } as Post
  } catch (error) {
    console.error(`Failed to fetch post with id ${id}:`, error)
    return null
  }
}

export async function createPost(postData: PostInput) {
  try {
    const { db } = await connectToDatabase()
    const now = new Date().toISOString()

    const result = await db.collection("posts").insertOne({
      ...postData,
      createdAt: now,
      updatedAt: now,
    })

    return { success: true, id: result.insertedId.toString() }
  } catch (error) {
    console.error("Failed to create post:", error)
    throw new Error("Failed to create post")
  }
}

export async function updatePost(id: string, postData: PostInput) {
  try {
    const { db } = await connectToDatabase()
    const now = new Date().toISOString()

    await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...postData,
          updatedAt: now,
        },
      },
    )

    return { success: true }
  } catch (error) {
    console.error(`Failed to update post with id ${id}:`, error)
    throw new Error("Failed to update post")
  }
}

export async function deletePost(id: string) {
  try {
    const { db } = await connectToDatabase()
    await db.collection("posts").deleteOne({ _id: new ObjectId(id) })
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete post with id ${id}:`, error)
    throw new Error("Failed to delete post")
  }
}

