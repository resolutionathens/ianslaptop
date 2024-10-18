import { useLineAdder } from './useLineAdder'

export function useCommands(addLine: (content: string, color?: string) => void) {
  const commands = {
    help: 'Show help',
    ls: 'List available commands',
    about: 'My brief bio',
    skills: 'My skillset',
    projects: 'My portfolio projects',
    contact: 'Get in touch with me'
  }

  const executeCommand = (command: string) => {
    console.log('executeCommand', command)
    addLine(`❯ ${command}`, 'text-blue-500')

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
        addLine('Check out my GitHub for a list of my projects: https://github.com/yourusername')
        break
      case 'contact':
        addLine(
          'Email me at: <a href="mailto:ian@ianslap.top" class="underline decoration-dotted">ian@ianslap.top</a>'
        )
        break
      case 'help':
        addLine('Try typing "ls" to see a list of commands')
        break
      default:
        addLine(`Command not found: ${command}`)
    }
  }

  return {
    commands,
    executeCommand
  }
}
