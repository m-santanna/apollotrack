// app/routes/index.tsx
import ThemeButton from '@/components/theme-button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <ThemeButton />
    </div>
  )
}
