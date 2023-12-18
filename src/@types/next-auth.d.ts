import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }

  // extendendo a interface Session e adicionando User
  interface Session {
    user: User
  }
}
