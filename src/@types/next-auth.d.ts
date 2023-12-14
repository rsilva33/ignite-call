import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  }
  // extendendo a interface que ja existe dentro do next auth add o user la dentro
  interface Session {
    user: User
  }
}
