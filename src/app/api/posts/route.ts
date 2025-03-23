import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Enable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}

// GET all posts
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const posts = await db.collection("posts").find({}).sort({ createdAt: -1 }).toArray()

    const formattedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
    }))

    return NextResponse.json(formattedPosts, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (error) {
    console.error("Failed to fetch posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    )
  }
}

// POST new post
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const postData = await request.json()
    const now = new Date().toISOString()

    const result = await db.collection("posts").insertOne({
      ...postData,
      createdAt: now,
      updatedAt: now,
    })

    return NextResponse.json(
      { success: true, id: result.insertedId.toString() },
      { status: 201, headers: { "Access-Control-Allow-Origin": "*" } },
    )
  } catch (error) {
    console.error("Failed to create post:", error)
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    )
  }
}

