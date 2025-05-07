import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-4">
      <p className="text-3xl text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <p className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => window.history.back()}
          className="bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm"
        >
          Go back
        </button>
        <Link
          to="/"
          className="bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm"
        >
          Start Over
        </Link>
      </p>
    </div>
  )
}
