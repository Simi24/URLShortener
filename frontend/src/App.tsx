import { ThemeProvider } from "./components/providers/theme-provider"
import URLShortener from "./components/URLShortener"
import { ModeToggle } from "./components/mode-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen w-full bg-white dark:bg-slate-900 p-4 relative">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="flex items-center justify-center min-h-screen">
          <URLShortener />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App

