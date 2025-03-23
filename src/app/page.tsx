import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

import { getPosts } from "@/lib/posts"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default async function Home() {
  const posts = await getPosts()

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/posts/new">
          <Button>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-muted-foreground mb-4">No posts yet</h2>
          <Link href="/posts/new">
            <Button>Create your first post</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post._id} href={`/posts/${post._id}`}>
              <div className="border rounded-lg overflow-hidden h-full flex flex-col hover:border-primary transition-colors">
                <div className="p-6 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {post.categories.map((category) => (
                      <span key={category} className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-muted">
                        {category}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-muted-foreground line-clamp-3">{post.content.substring(0, 150)}...</p>
                </div>
                <div className="px-6 py-4 bg-muted/50 flex items-center justify-between">
                  <span className="text-sm font-medium">{post.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

