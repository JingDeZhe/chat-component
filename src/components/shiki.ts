import { createHighlighter } from 'shiki'

export const highlighter = await createHighlighter({
  themes: ['one-dark-pro'],
  langs: [
    'javascript',
    'typescript',
    'vue',
    'sql',
    'java',
    'mermaid',
    'plaintext',
  ],
})
