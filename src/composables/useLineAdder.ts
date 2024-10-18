import { ref } from 'vue'
export type Line = {
  content: string
  color?: string
}

export function useLineAdder() {
  const lines = ref<Line[]>([])

  const addLine = (content: string, color?: string) => {
    lines.value.push({ content, color })
  }

  const clearLines = () => {
    lines.value = []
  }

  return {
    lines,
    addLine,
    clearLines
  }
}
