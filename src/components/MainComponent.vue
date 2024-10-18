<script setup lang="ts">
import { useLineAdder } from '@/composables/useLineAdder'

const { lines, addLine, addLink, addComponent } = useLineAdder()

// Example usage
addLine('This is a regular text line')
addLink('Visit our website', 'https://example.com')
addComponent('CustomButton', { text: 'Click me', onClick: () => console.log('Button clicked') })
</script>

<template>
  <div>
    <h1>Enhanced Output</h1>
    <div v-for="(line, index) in lines" :key="index">
      <component
        v-if="line.type === 'component'"
        :is="line.content.componentName"
        v-bind="line.content.props"
      />
      <a v-else-if="line.type === 'link'" :href="line.content.url">{{ line.content.text }}</a>
      <div v-else>{{ line.content }}</div>
    </div>
  </div>
</template>
