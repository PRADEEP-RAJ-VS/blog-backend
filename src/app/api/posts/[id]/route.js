import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Enable CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// GET post by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const { db } = await connectToDatabase();
    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    return NextResponse.json({ ...post, _id: post._id.toString() }, { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    console.error(`Failed to fetch post with id ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

// PUT (update) post
export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const { db } = await connectToDatabase();
    const postData = await request.json();
    const now = new Date().toISOString();

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...postData,
          updatedAt: now,
        },
      },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    return NextResponse.json({ success: true }, { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    console.error(`Failed to update post with id ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

// DELETE post
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const { db } = await connectToDatabase();
    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } },
      );
    }

    return NextResponse.json({ success: true }, { headers: { "Access-Control-Allow-Origin": "*" } });
  } catch (error) {
    console.error(`Failed to delete post with id ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } },
    );
  }
}

