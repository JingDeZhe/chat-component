import './github.scss'
import './md.scss'
import { fromHighlighter } from '@shikijs/markdown-it'
import { highlighter } from './shiki'
import MarkdownIt from 'markdown-it'
import { getPostProcess, getPreProcess } from './utils'
import { postMermaid, preThink } from './process'
import container from 'markdown-it-container'
import type { RenderRule } from 'markdown-it/lib/renderer.mjs'
import mathjax3 from 'markdown-it-mathjax3'

const preProcess = getPreProcess()
preProcess.register(preThink)
const postProcess = getPostProcess()
postProcess.register(postMermaid)

export const markdown = new MarkdownIt()

markdown.use(mathjax3)
markdown.use(fromHighlighter(highlighter, { theme: 'one-dark-pro' }))
markdown.use(container, 'think', {
  render: (tokens, idx, _options, env) => {
    const token = tokens[idx]
    if (token.nesting === 1) {
      return `<fieldset class="think"><legend>思考过程</legend><details open><summary></summary>\n`
    } else {
      return '</details></fieldset>'
    }
  },
} as { render: RenderRule })

export const md = {
  render(text: string) {
    text = preProcess.apply(text)
    return markdown.render(text)
  },
  done(el: HTMLElement) {
    postProcess.apply(el)
  },
}
