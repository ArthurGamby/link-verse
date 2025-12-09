import prisma from "../lib/prisma"

export default async function Home() {
  let users: Array<{
    id: number
    email: string
    name: string | null
    createdAt: Date
    updatedAt: Date
  }> = []
  let error = null

  try {
    users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
  } catch (e) {
    console.error("Error fetching users:", e)
    error = "Failed to load users. Make sure your DATABASE_URL is configured."
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Link Verse
          </h1>
          <p className="mt-2 text-slate-400">Users from Prisma Postgres</p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-8 text-center backdrop-blur">
            <div className="mb-4 text-5xl">👋</div>
            <p className="text-lg text-slate-300">No users yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Create one using the API at{" "}
              <code className="rounded bg-slate-700 px-2 py-1 font-mono text-violet-400">
                /api/users
              </code>
            </p>
            <div className="mt-6 rounded-lg bg-slate-900 p-4 text-left">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                Example POST request
              </p>
              <pre className="overflow-x-auto text-sm text-slate-300">
{`curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","name":"Test User"}'`}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="group rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur transition-all hover:border-violet-500/50 hover:bg-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {user.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-violet-400">{user.email}</p>
                  </div>
                  <div className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300">
                    ID: {user.id}
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Created {user.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
