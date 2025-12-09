import { currentUser } from "@clerk/nextjs/server"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import prisma from "../lib/prisma"
import { claimUsername } from "./actions"

export default async function Home() {
  const user = await currentUser()

  // State 1: Logged out - Show landing page
  if (!user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="flex justify-end items-center p-4 gap-4">
          <SignInButton>
            <button className="text-white hover:text-violet-300 font-medium">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="bg-violet-600 hover:bg-violet-500 text-white rounded-full font-medium px-5 py-2">
              Sign Up
            </button>
          </SignUpButton>
        </header>
        
        <div className="flex flex-col items-center justify-center px-8 py-32">
          <h1 className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-6xl font-bold tracking-tight text-transparent text-center">
            Link Verse
          </h1>
          <p className="mt-4 text-xl text-slate-400 text-center max-w-md">
            Create your personal link page and share everything with one simple URL
          </p>
          <SignUpButton>
            <button className="mt-8 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-semibold px-8 py-3 text-lg">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </main>
    )
  }

  // Check if user has a profile in our database
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { links: true },
  })

  // State 2: Logged in but no DB profile - Show "Claim Username" form
  if (!dbUser) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="flex justify-end items-center p-4 gap-4">
          <UserButton />
        </header>
        
        <div className="flex flex-col items-center justify-center px-8 py-24">
          <h1 className="text-4xl font-bold text-white text-center">
            Claim your username
          </h1>
          <p className="mt-2 text-slate-400 text-center">
            Choose a unique username for your Link Verse profile
          </p>
          
          <form action={claimUsername} className="mt-8 w-full max-w-sm">
            <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-2 border border-slate-700 focus-within:border-violet-500 transition-colors">
              <span className="text-slate-500 pl-2">linkverse.app/</span>
              <input
                type="text"
                name="username"
                placeholder="username"
                required
                minLength={3}
                pattern="^[a-zA-Z0-9_]+$"
                className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-600"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              At least 3 characters. Letters, numbers, and underscores only.
            </p>
            <button
              type="submit"
              className="mt-4 w-full bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold py-3 transition-colors"
            >
              Claim Username
            </button>
          </form>
        </div>
      </main>
    )
  }

  // State 3: Has DB profile - Show dashboard
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="flex justify-between items-center p-4">
        <h2 className="text-white font-semibold">Link Verse</h2>
        <UserButton />
      </header>
      
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome, {dbUser.name || dbUser.username}!
          </h1>
          <p className="mt-1 text-violet-400">
            linkverse.app/{dbUser.username}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Your Links</h3>
            <span className="text-sm text-slate-500">{dbUser.links.length} links</span>
          </div>
          
          {dbUser.links.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No links yet. Add your first link!
            </p>
          ) : (
            <div className="space-y-3">
              {dbUser.links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{link.title}</p>
                    <p className="text-sm text-slate-500 truncate max-w-xs">{link.url}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}