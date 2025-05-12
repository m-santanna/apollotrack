import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'

export default function ThemeButton() {
    const { theme, setTheme } = useTheme()
    return (
        <Button
            className="bg-primary-foreground text-primary hover:bg-primary-foreground hover:text-primary/70"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? (
                <Sun className="size-6 md:size-7" />
            ) : (
                <Moon className="size-6 md:size-7" />
            )}
        </Button>
    )
}
