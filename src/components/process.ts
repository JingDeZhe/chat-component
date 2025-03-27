import {
  getContentFromCodeEl,
  renderMermaid,
  showToast,
  traverseCodeEls,
  writeClipboard,
  type PostProcess,
  type PreProcess,
} from './utils'

/**将think标签替换成常规的::: think写法 */
export const preThink: PreProcess = (text) => {
  text = text.replace(/<think>/g, ':::think').replace(/<\/think>/g, ':::')
  return text
}

/**将mermaid代码块渲染成具体的图表 */
export const postMermaid: PostProcess = (el) => {
  traverseCodeEls(
    el,
    (codeEl, preEl) => {
      if (preEl.dataset.mermaidRendered === 'true') return
      preEl.setAttribute('data-mermaid-rendered', 'true')
      const text = getContentFromCodeEl(codeEl)
      renderMermaid(text).then((svgText) => {
        const chartEl = document.createElement('div')
        chartEl.innerHTML = svgText
        preEl.appendChild(chartEl)
      })
    },
    'mermaid'
  )
}

/**给代码块增加复制的按钮 */
export const postCodeTools: PostProcess = (el) => {
  traverseCodeEls(el, (_codeEl, preEl, language) => {
    const toolEl = document.createElement('div')
    toolEl.className = 'code-tools'
    toolEl.innerHTML = `
      <span class="language">${language}</span>
      <div class="split"></div>
      <button class="cp-btn" data-action="copy">复制</button>
    `
    preEl.parentElement!.insertBefore(toolEl, preEl)
  })

  el.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (target.classList.contains('cp-btn')) {
      const { action } = target.dataset
      if (action === 'copy') {
        const text = getContentFromCodeEl(
          target.parentElement!.nextElementSibling! as HTMLElement
        )
        writeClipboard(text).then(() => {
          showToast('已复制代码')
        })
      }
    }
  })
}
