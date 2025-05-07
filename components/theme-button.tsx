import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'

export default function ThemeButton() {
  const { theme, setTheme } = useTheme()
  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
