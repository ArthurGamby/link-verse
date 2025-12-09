import { notFound } from "next/navigation"
import prisma from "../../lib/prisma"

type Props = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username: username.toLowerCase() },
    include: { links: true },
  })

  if (!user) {
    notFound()
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center px-6 py-16">
        {/* Avatar */}
        <div className="w-24 h-24 bg-[#FFDD00] rounded-full flex items-center justify-center text-4xl font-bold">
          {(user.name?.[0] || user.username[0]).toUpperCase()}
        </div>

        {/* Name & Username */}
        <h1 className="mt-4 text-2xl font-bold text-black">
          {user.name || user.username}
        </h1>
        <p className="text-[#6B7280]">@{user.username}</p>

        {/* Links */}
        <div className="mt-8 w-full max-w-md space-y-3">
          {user.links.length === 0 ? (
            <p className="text-center text-[#6B7280] py-8">
              No links yet.
            </p>
          ) : (
            user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-black text-center font-semibold py-4 px-6 rounded-full border border-[#E5E5E5] hover:border-[#FFDD00] hover:shadow-md transition-all"
              >
                {link.title}
              </a>
            ))
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center pb-8">
        <a
          href="/"
          className="text-sm text-[#6B7280] hover:text-black transition-colors"
        >
          Create your own — <span className="font-semibold">Link Verse</span> ☕
        </a>
      </div>
    </main>
  )
}
