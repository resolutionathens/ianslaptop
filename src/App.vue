<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useLineAdder } from './composables/useLineAdder'
import { useCommands } from './composables/useCommands'
import { useSoundEffects } from './composables/useSoundEffects'

const { lines, addLine, clearLines } = useLineAdder()
const { playCommandSound, soundEnabled, toggleSound } = useSoundEffects()
const { executeCommand } = useCommands(addLine, toggleSound)

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

onMounted(() => {
  updateCursorPosition()
  focusInput()
  scrollToBottom()
  if (inputRef.value) {
    inputRef.value.addEventListener('blur', focusInput)
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
    class="bg-gray-900 font-mono h-screen p-1 sm:p-4 flex flex-col text-green-600"
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
        <span class="text-blue-600">~/Documents</span><span class="text-blue-500">/ianslaptop</span>
        <span class="flex-grow mx-2 flex items-center">
          <span class="border-t-2 border-dotted border-gray-600 flex-grow"></span>
        </span>
        <span class="text-cyan-500"> <span class="mr-1 text-xs">🕒</span>{{ currentTime }} </span>
      </div>
      <div class="flex items-center relative">
        <span class="text-green-400 mr-2">❯</span>
        <div class="relative flex-grow">
          <input
            ref="inputRef"
            v-model="input"
            @keyup.enter="handleCommand"
            @input="updateCursorPosition"
            class="bg-transparent border-none outline-none w-full caret-transparent"
            type="text"
            autofocus
          />
          <div
            ref="cursorRef"
            class="absolute top-0 w-2 h-5 bg-green-400 animate-cursor-blink pointer-events-none"
            :style="{ left: cursorPosition + 'px' }"
          ></div>
        </div>
      </div>
  </div>
</template>
