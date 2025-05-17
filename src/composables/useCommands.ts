import { useLineAdder } from './useLineAdder'

interface CommandResult {
  type?: 'clear' | 'default'
}

export function useCommands(
  addLine: (content: string, color?: string) => void,
  soundToggler?: () => boolean
) {
  const commands = {
    help: 'Show help',
    ls: 'List available commands',
    about: 'My brief bio',
    skills: 'My skillset',
    projects: 'My portfolio projects',
    contact: 'Get in touch with me',
    clear: 'Clear terminal screen',
    weather: 'Display current weather',
    resume: 'Display professional resume',
    social: 'Show social media links',
    blog: 'Visit my blog at fiftymillimeter.com',
    sound: 'Toggle sound effects on/off'
  }

  const executeCommand = (command: string): CommandResult => {
    console.log('executeCommand', command)
    // Add the command with a special highlight class that we'll animate
    addLine(`❯ ${command}`, 'text-blue-500 command-highlight')

    switch (command.trim().toLowerCase()) {
      case 'ls':
        Object.entries(commands).forEach(([cmd, desc]) => {
          addLine(`${cmd}: ${desc}`)
        })
        break
      case 'about':
        addLine(
          'I am the Director of Marketing for <a href="https://www.facilitron.com" class="underline decoration-dotted">Facilitron</a>. I\'ve been working with Apple computers since the 512k enhanced in 1985. I began working with them professionally in 1992 and haven\'t stopped. I have worked as a designer for agencies large and small, including Ogilvy and Mather, BBDO South, Cartoon Network, and Weather.com. I caught the programming bug and did a stint as a webmaster for World Airways, then spent 13 years as Senior Applications Developer for DaVita. Then I ran <a href="https://www.resolutionathens.com" class="underline decoration-dotted">Resolution</a>, a small agency, designing websites for clients such as Gregg Allman (his site is still up). I like parties with snacks.'
        )
        break
      case 'skills':
        addLine('My skills include: Vue, Nuxt, TypeScript, JavaScript, Tailwind, and more!')
        break
      case 'projects':
        addLine('<span class="text-yellow-500 font-bold">My Projects:</span>')
        addLine(
          '• <a href="https://www.athenspedia.com" class="text-blue-400 underline decoration-dotted" target="_blank">Athens Pedia</a> - A comprehensive guide to Athens, GA'
        )
        addLine(
          '• <a href="https://www.facilitron.com" class="text-blue-400 underline decoration-dotted" target="_blank">Facilitron</a> - Facility rental management platform'
        )
        addLine(
          '• <a href="https://www.resolutionathens.com" class="text-blue-400 underline decoration-dotted" target="_blank">Resolution Digital Type & Image</a> - Digital design agency'
        )
        addLine(
          '• <a href="https://www.fiftymillimeter.com" class="text-blue-400 underline decoration-dotted" target="_blank">Fifty Millimeter</a> - My photography blog'
        )
        break
      case 'contact':
        addLine(
          'Email me at: <a href="mailto:ian@ianslap.top" class="underline decoration-dotted">ian@ianslap.top</a>'
        )
        break
      case 'help':
        addLine('Try typing "ls" to see a list of commands')
        break
      case 'clear':
        return { type: 'clear' }
      case 'weather':
        addLine('<span class="text-cyan-500 font-bold">Current Weather:</span>')
        addLine('⛅️ Athens, GA: 75°F, Partly Cloudy')
        addLine('<span class="text-gray-500 text-sm">(Weather data is simulated)</span>')
        break
      case 'resume':
        addLine('<span class="text-green-500 font-bold">Professional Experience:</span>')
        addLine('• <span class="font-bold">Facilitron</span> - Director of Marketing (Current)')
        addLine('• <span class="font-bold">Resolution Digital Type & Image</span> - Owner/Operator')
        addLine('• <span class="font-bold">DaVita</span> - Senior Applications Developer (13 years)')
        addLine('• <span class="font-bold">World Airways</span> - Webmaster')
        addLine('• <span class="font-bold">Various Agencies</span> - Designer (Ogilvy, BBDO South, Cartoon Network, Weather.com)')
        addLine('')
        addLine('<span class="text-green-500 font-bold">Education:</span>')
        addLine('• Design and Technology - Extensive professional experience since 1992')
        break
      case 'social':
        addLine('<span class="text-blue-500 font-bold">Social Media:</span>')
        addLine('<a href="https://www.linkedin.com/" class="text-blue-400 underline decoration-dotted" target="_blank">LinkedIn</a>')
        addLine('<a href="https://github.com/" class="text-blue-400 underline decoration-dotted" target="_blank">GitHub</a>')
        addLine('<a href="https://twitter.com/" class="text-blue-400 underline decoration-dotted" target="_blank">Twitter</a>')
        addLine('<a href="https://instagram.com/" class="text-blue-400 underline decoration-dotted" target="_blank">Instagram</a>')
        break
      case 'blog':
        addLine('<span class="text-orange-500 font-bold">Latest from My Blog:</span>')
        addLine('Visit <a href="https://www.fiftymillimeter.com" class="text-blue-400 underline decoration-dotted" target="_blank">Fifty Millimeter</a> to see my latest photography posts.')
        addLine('')
        addLine('<span class="text-orange-500">Recent Posts:</span>')
        addLine('• Street Photography in Athens, GA')
        addLine('• Capturing Architecture with a 50mm Lens')
        addLine('• Black and White Portraiture Techniques')
        break
      case 'sound':
        if (soundToggler) {
          const soundOn = soundToggler()
          if (soundOn) {
            addLine('<span class="text-green-500">🔊 Sound effects enabled</span>')
          } else {
            addLine('<span class="text-red-500">🔇 Sound effects disabled</span>')
          }
        } else {
          addLine('Sound toggling functionality not available')
        }
        break
      default:
        addLine(`Command not found: ${command}`)
    }
    
    return { type: 'default' }
  }

  return {
    commands,
    executeCommand
  }
}
