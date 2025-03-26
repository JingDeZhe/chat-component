import { renderMermaid, type PostProcess, type PreProcess } from './utils'

/**将think标签替换成常规的::: think写法 */
export const preThink: PreProcess = (text) => {
  text = text.replace(/<think>/g, ':::think').replace(/<\/think>/g, ':::')
  return text
}

/**将mermaid代码块渲染成具体的图表 */
export const postMermaid: PostProcess = (el) => {
  const codeEls = el.querySelectorAll<HTMLElement>('code.language-mermaid')
  for (const codeEl of codeEls) {
    const parentEl = codeEl.parentElement
    if (parentEl?.nodeName !== 'PRE') continue
    if (parentEl.dataset.mermaidRendered === 'true') continue
    parentEl.setAttribute('data-mermaid-rendered', 'true')
    const text = codeEl.innerText
    renderMermaid(text).then((svgText) => {
      const chartEl = document.createElement('div')
      chartEl.innerHTML = svgText
      parentEl.appendChild(chartEl)
    })
  }
}

/**给代码块增加复制的按钮 */
export const postCodeTools: PostProcess = (el) => {
  const codeEls = el.querySelectorAll<HTMLElement>('code.language-mermaid')
  for (const codeEl of codeEls) {
  }
}
