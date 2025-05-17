<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useLineAdder } from './composables/useLineAdder'
import { useCommands } from './composables/useCommands'
import { useSoundEffects } from './composables/useSoundEffects'
import { useTheme } from './composables/useTheme'
import { useCommandHistory } from './composables/useCommandHistory'

const { lines, addLine, clearLines } = useLineAdder()
const { playCommandSound, soundEnabled, toggleSound } = useSoundEffects()
const { currentTheme, toggleTheme, initializeTheme, getThemeClasses } = useTheme()
const { 
  history, 
  addToHistory, 
  getPreviousCommand, 
  getNextCommand, 
  loadHistory,
  clearHistory
} = useCommandHistory()

// Function to provide history to commands
const getHistory = () => history.value

const { executeCommand } = useCommands(
  addLine, 
  toggleSound, 
  toggleTheme, 
  getHistory,
  clearHistory
)

// Computed theme classes
const themeClasses = computed(() => getThemeClasses())

const input = ref('')
const terminalRef = ref<HTMLElement | null>(null)
const outputRef = ref<HTMLElement | null>(null)

const inputRef = ref<HTMLInputElement | null>(null)
const cursorRef = ref<HTMLDivElement | null>(null)
const cursorPosition = ref(0)

const currentTime = ref(new Date().toLocaleTimeString())

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const scrollToBottom = () => {
  if (outputRef.value) {
    outputRef.value.scrollTop = outputRef.value.scrollHeight
  }
}

const updateCursorPosition = () => {
  if (inputRef.value) {
    const inputElement = inputRef.value
    const textWidth = getTextWidth(inputElement.value, getComputedStyle(inputElement))
    cursorPosition.value = textWidth
  }
}

const getTextWidth = (text: string, font: CSSStyleDeclaration): number => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (context) {
    context.font = font.font
    return context.measureText(text).width
  }
  return 0
}

const handleCommand = () => {
  const command = input.value.trim()
  console.log('handleCommand' + command)
  input.value = ''
  
  if (command) {
    // Add command to history
    addToHistory(command)
  }
  
  // Play sound effect
  playCommandSound()
  
  const result = executeCommand(command)
  
  if (result && result.type === 'clear') {
    clearLines()
  }
  
  // Use setTimeout to ensure the DOM is updated before scrolling
  setTimeout(() => {
    scrollToBottom()
  }, 0)
  
  focusInput()
  cursorPosition.value = 0
}

const rainbowColors = [
  'text-red-500',
  'text-orange-500',
  'text-yellow-500',
  'text-green-500',
  'text-blue-500',
  'text-indigo-500',
  'text-violet-500'
]
const ASCII_ART = [
  '  _                 _             _ ',
  ' (_) __ _ _ __  ___| | __ _ _ __ | |_ ___  _ __',
  " | |/ _` | '_ \\/ __| |/ _` | '_ \\| __/ _ \\| '_ \\",
  ' | | (_| | | | \\__ \\ | (_| | |_) | || (_) | |_) |',
  ' |_|\\__,_|_| |_|___/_|\\__,_| .__/ \\__\\___/| .__/',
  '                           |_|            |_|',
  '',
  ''
].map((line) => line.replace(/ /g, '\u00A0'))

const colorizedAsciiArt = ASCII_ART.map((line, index) => {
  const colorClass = rainbowColors[index % rainbowColors.length]
  return `<span class="${colorClass}">${line}</span>`
}).join('<br>')

// Handle keyboard navigation
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp') {
    // Navigate to previous command in history
    event.preventDefault()
    input.value = getPreviousCommand()
    // Move cursor to end of input
    setTimeout(() => {
      if (inputRef.value) {
        updateCursorPosition()
      }
    }, 0)
  } else if (event.key === 'ArrowDown') {
    // Navigate to next command in history
    event.preventDefault()
    input.value = getNextCommand()
    // Move cursor to end of input
    setTimeout(() => {
      if (inputRef.value) {
        updateCursorPosition()
      }
    }, 0)
  }
}

onMounted(() => {
  updateCursorPosition()
  focusInput()
  scrollToBottom()
  initializeTheme()
  loadHistory() // Load command history from localStorage
  if (inputRef.value) {
    inputRef.value.addEventListener('blur', focusInput)
    inputRef.value.addEventListener('keydown', handleKeyDown)
  }
})

setInterval(() => {
  currentTime.value = new Date().toLocaleTimeString()
}, 1000)

// Watch for changes to lines and scroll to bottom when they change
watch(
  () => lines.value.length,
  () => {
    setTimeout(() => {
      scrollToBottom()
    }, 0)
  }
)
</script>

<template>
  <div
    :class="[themeClasses.background, themeClasses.text, 'font-mono h-screen p-1 sm:p-4 flex flex-col transition-colors duration-300']"
    ref="terminalRef"
    @click="focusInput"
  >
      <!-- Header/ASCII -->
      <div class="ascii-art mb-4 text-xs sm:text-sm text-nowrap" v-html="colorizedAsciiArt"></div>
      <!-- Output -->
      <div ref="outputRef" class="flex-grow overflow-y-auto mb-4">
        <div v-for="(line, index) in lines" :key="index" class="mb-1">
          <span :class="line.color" v-html="line.content as string"></span>
        </div>
      </div>
      <!-- Prompt -->
      <div class="flex justify-between items-center mb-4" id="prompt">
        <span :class="themeClasses.heading">~/Documents</span><span :class="themeClasses.heading">/ianslaptop</span>
        <span class="flex-grow mx-2 flex items-center">
          <span :class="['border-t-2', 'border-dotted', themeClasses.border, 'flex-grow']"></span>
        </span>
        <span :class="themeClasses.emphasis"> <span class="mr-1 text-xs">🕒</span>{{ currentTime }} </span>
      </div>
      <div class="flex items-center relative">
        <span :class="[themeClasses.prompt, 'mr-2']">❯</span>
        <div class="relative flex-grow">
          <input
            ref="inputRef"
            v-model="input"
            @keyup.enter="handleCommand"
            @input="updateCursorPosition"
            :class="['bg-transparent', 'border-none', 'outline-none', 'w-full', 'caret-transparent', themeClasses.text]"
            type="text"
            autofocus
          />
          <div
            ref="cursorRef"
            :class="[themeClasses.cursor, 'absolute', 'top-0', 'w-2', 'h-5', 'animate-cursor-blink', 'pointer-events-none']"
            :style="{ left: cursorPosition + 'px' }"
          ></div>
        </div>
      </div>
  </div>
</template>
