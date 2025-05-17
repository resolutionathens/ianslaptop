import { ref } from 'vue'

export function useCommandHistory(maxHistory = 50) {
  // Store command history
  const history = ref<string[]>([])
  
  // Current position when navigating through history
  const historyIndex = ref(-1)
  
  // Add a command to history
  const addToHistory = (command: string) => {
    // Don't add empty commands or duplicates of the last command
    if (!command.trim() || (history.value.length > 0 && history.value[0] === command)) {
      return
    }
    
    // Add to the beginning of the array
    history.value.unshift(command)
    
    // Limit history size
    if (history.value.length > maxHistory) {
      history.value = history.value.slice(0, maxHistory)
    }
    
    // Reset history index
    historyIndex.value = -1
    
    // Persist to localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('commandHistory', JSON.stringify(history.value))
    }
  }
  
  // Get previous command from history
  const getPreviousCommand = () => {
    if (history.value.length === 0) {
      return ''
    }
    
    // Increment index to move back in history
    historyIndex.value = Math.min(historyIndex.value + 1, history.value.length - 1)
    return history.value[historyIndex.value]
  }
  
  // Get next command from history
  const getNextCommand = () => {
    // Decrement index to move forward in history
    historyIndex.value = Math.max(historyIndex.value - 1, -1)
    
    if (historyIndex.value === -1) {
      // At the end of history, return empty string
      return ''
    }
    
    return history.value[historyIndex.value]
  }
  
  // Load history from localStorage
  const loadHistory = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedHistory = localStorage.getItem('commandHistory')
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory)
          if (Array.isArray(parsedHistory)) {
            history.value = parsedHistory
          }
        } catch (e) {
          console.error('Failed to parse command history from localStorage', e)
        }
      }
    }
  }
  
  // Clear command history
  const clearHistory = () => {
    history.value = []
    historyIndex.value = -1
    
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('commandHistory')
    }
  }
  
  return {
    history,
    historyIndex,
    addToHistory,
    getPreviousCommand,
    getNextCommand,
    loadHistory,
    clearHistory
  }
}