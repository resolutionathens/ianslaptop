import { ref } from 'vue'

export function useSoundEffects() {
  // Create audio elements for each sound effect
  const commandSound = new Audio('/sounds/command.mp3')
  
  // Set properties
  commandSound.volume = 0.5
  
  // Flag to track if sound is enabled
  const soundEnabled = ref(true)
  
  // Function to toggle sound on/off
  const toggleSound = () => {
    soundEnabled.value = !soundEnabled.value
    return soundEnabled.value
  }
  
  // Function to play the command execution sound
  const playCommandSound = () => {
    if (soundEnabled.value) {
      // Clone and play to allow rapid succession of sounds
      const soundClone = commandSound.cloneNode() as HTMLAudioElement
      soundClone.play().catch(err => {
        console.error('Error playing sound:', err)
      })
    }
  }
  
  return {
    soundEnabled,
    toggleSound,
    playCommandSound
  }
}