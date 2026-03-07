import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-6xl font-bold text-text-primary mb-2">404</h1>
        <p className="text-text-secondary mb-6">Page not found</p>
        <Link href="/" className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          Go Home
        </Link>
      </div>
    </div>
  )
}
