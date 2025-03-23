export interface Post {
  _id: string
  title: string
  content: string
  author: string
  categories: string[]
  createdAt: string
  updatedAt: string
}

export interface PostInput {
  title: string
  content: string
  author: string
  categories: string[]
}

