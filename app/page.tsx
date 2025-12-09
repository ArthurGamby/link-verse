import { currentUser } from "@clerk/nextjs/server"
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import prisma from "../lib/prisma"
import { claimUsername } from "./actions"

export default async function Home() {
  const user = await currentUser()

  // State 1: Logged out - Show landing page
  if (!user) {
    return (
      <main className="min-h-screen">
        <header className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto">
          <span className="text-xl font-bold">☕ Link Verse</span>
          <div className="flex items-center gap-3">
            <SignInButton>
              <button className="text-[#6B7280] hover:text-black font-medium px-4 py-2">
                Log in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-[#FFDD00] hover:bg-[#f5d400] text-black rounded-full font-semibold px-6 py-3">
                Sign up
              </button>
            </SignUpButton>
          </div>
        </header>
        
        <div className="flex flex-col items-center px-6 pt-20 pb-32">
          <h1 className="text-5xl sm:text-6xl font-bold text-black text-center leading-tight max-w-2xl">
            Your links,<br />all in one place
          </h1>
          <p className="mt-6 text-xl text-[#6B7280] text-center max-w-md">
            Create your personal page and share everything you do with a single link.
          </p>
          <SignUpButton>
            <button className="mt-10 bg-[#FFDD00] hover:bg-[#f5d400] text-black rounded-full font-semibold px-8 py-4 text-lg shadow-sm">
              Start my page — it's free
            </button>
          </SignUpButton>
          <p className="mt-4 text-sm text-[#6B7280]">
            Takes less than a minute ✨
          </p>
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
      <main className="min-h-screen">
        <header className="flex justify-end items-center px-6 py-4 max-w-4xl mx-auto">
          <UserButton />
        </header>
        
        <div className="flex flex-col items-center px-6 pt-16 pb-32">
          <div className="text-5xl mb-6">🎉</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-black text-center">
            Welcome aboard!
          </h1>
          <p className="mt-4 text-lg text-[#6B7280] text-center max-w-md">
            Let's set up your page. Pick a username that people will remember.
          </p>
          
          <div className="mt-10 w-full max-w-md bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
            <form action={claimUsername}>
              <label className="block text-sm font-medium text-[#6B7280] mb-2">
                Your URL
              </label>
              <div className="flex items-center bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] focus-within:border-[#FFDD00] focus-within:ring-2 focus-within:ring-[#FFDD00]/20 transition-all">
                <span className="text-[#6B7280] pl-4 pr-1">linkverse.app/</span>
                <input
                  type="text"
                  name="username"
                  placeholder="yourname"
                  required
                  minLength={3}
                  pattern="^[a-zA-Z0-9_]+$"
                  className="flex-1 bg-transparent text-black py-4 pr-4 outline-none placeholder:text-[#9CA3AF] font-medium"
                />
              </div>
              <p className="mt-2 text-xs text-[#6B7280]">
                Letters, numbers, and underscores only
              </p>
              <button
                type="submit"
                className="mt-6 w-full bg-[#FFDD00] hover:bg-[#f5d400] text-black rounded-full font-semibold py-4 transition-colors"
              >
                Claim my page
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // State 3: Has DB profile - Show dashboard
  return (
    <main className="min-h-screen">
      <header className="flex justify-between items-center px-6 py-4 max-w-4xl mx-auto">
        <span className="text-xl font-bold">☕ Link Verse</span>
        <UserButton />
      </header>
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5] text-center">
          <div className="w-16 h-16 bg-[#FFDD00] rounded-full flex items-center justify-center text-2xl mx-auto">
            {(dbUser.name?.[0] || dbUser.username[0]).toUpperCase()}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-black">
            {dbUser.name || dbUser.username}
          </h1>
          <p className="mt-1 text-[#6B7280]">
            linkverse.app/{dbUser.username}
          </p>
          <button className="mt-4 border border-[#E5E5E5] hover:border-[#FFDD00] text-black rounded-full font-medium px-5 py-2 text-sm transition-colors">
            Copy link
          </button>
        </div>

        {/* Links Card */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-[#E5E5E5]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-black">My Links</h2>
            <button className="bg-[#FFDD00] hover:bg-[#f5d400] text-black rounded-full font-semibold px-5 py-2 text-sm">
              + Add link
            </button>
          </div>
          
          {dbUser.links.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔗</div>
              <p className="text-[#6B7280]">
                No links yet. Add your first one!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {dbUser.links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 bg-[#F7F7F7] rounded-xl border border-[#E5E5E5] hover:border-[#FFDD00] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-black truncate">{link.title}</p>
                    <p className="text-sm text-[#6B7280] truncate">{link.url}</p>
                  </div>
                  <button className="ml-4 text-[#6B7280] hover:text-black">
                    •••
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}