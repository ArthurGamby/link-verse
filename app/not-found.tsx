import Link from "next/link"

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="card text-center">
        <h1 className="text-5xl font-bold text-black">404</h1>
        <p className="mt-4 text-xl text-[#6B7280] max-w-md">
          Oops! This page doesn't exist or the username hasn't been claimed yet.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-[#FFDD00] hover:bg-[#f5d400] text-black rounded-full font-semibold px-8 py-4 transition-colors"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
