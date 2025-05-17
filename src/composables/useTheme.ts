import { ref } from 'vue'

export type ThemeMode = 'dark' | 'light'

export function useTheme() {
  const currentTheme = ref<ThemeMode>('dark')

  // Check if browser supports localStorage and get saved theme preference
  const initializeTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('theme') as ThemeMode
      if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
        currentTheme.value = savedTheme
      } else {
        // Check system preference if no saved preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          currentTheme.value = 'light'
        }
      }
    }
  }

  // Toggle theme
  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    
    // Save preference to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', currentTheme.value)
    }
    
    return currentTheme.value
  }

  // Get theme classes
  const getThemeClasses = () => {
    return {
      background: currentTheme.value === 'dark' ? 'bg-gray-900' : 'bg-gray-100',
      text: currentTheme.value === 'dark' ? 'text-green-500' : 'text-gray-800',
      border: currentTheme.value === 'dark' ? 'border-gray-700' : 'border-gray-300',
      prompt: currentTheme.value === 'dark' ? 'text-green-400' : 'text-blue-600',
      cursor: currentTheme.value === 'dark' ? 'bg-green-400' : 'bg-blue-600',
      heading: currentTheme.value === 'dark' ? 'text-blue-500' : 'text-blue-700',
      emphasis: currentTheme.value === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
    }
  }

  return {
    currentTheme,
    toggleTheme,
    initializeTheme,
    getThemeClasses
  }
}