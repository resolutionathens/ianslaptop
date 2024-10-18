<script setup lang="ts">
defineProps({
  text: {
    type: String,
    required: true
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})
</script>

<template>
  <button @click="onClick">{{ text }}</button>
</template>
