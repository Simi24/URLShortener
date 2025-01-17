import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-16 h-8 rounded-full p-1 relative
        bg-white dark:bg-slate-800
        border-2 border-gray-200 dark:border-gray-700
        transition-all duration-500 ease-in-out
        hover:shadow-lg hover:scale-105
        focus:outline-none
      `}
    >
      <div
        className={`
          absolute top-1 left-1
          transform transition-all duration-300 ease-out
          ${theme === "dark" ? "translate-x-8" : "translate-x-0"}
          hover:rotate-12
        `}
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-white drop-shadow-lg animate-pulse" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)] animate-pulse" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}