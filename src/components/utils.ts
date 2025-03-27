import loadjs from 'loadjs'
import { v4 as uid } from 'uuid'
import * as clipboard from 'clipboard-polyfill'
import Swal from 'sweetalert2'

/**
 * markdown文件做解析前的简单替换，主要是为了让内容符合marked一些插件的格式要求
 */
export interface PreProcess {
  (originalContent: string): string
}

/**
 * marked解析后HTML元素的处理，这里可以以解析后的HTML为模板进行替换或者挂载更复杂的动态组件
 */
export interface PostProcess {
  (el: HTMLElement): void
}

export const getPreProcess = () => {
  const list: PreProcess[] = []
  return {
    register: (fn: PreProcess) => list.push(fn),
    apply: (text: string) => {
      for (const fn of list) {
        text = fn(text)
      }
      return text
    },
  }
}

export const getPostProcess = () => {
  const list: PostProcess[] = []
  const instance = {
    register: (fn: PostProcess) => {
      list.push(fn)
      return instance
    },
    apply: (el: HTMLElement) => {
      for (const fn of list) {
        fn(el)
      }
    },
  }
  return instance
}

let mermaidLoaded = false
/**懒加载获取mermaid插件 */
export const loadMermaid = (
  fn: (mermaid: {
    render: (id: string, code: string) => Promise<{ svg: string }>
  }) => void
) => {
  if (!mermaidLoaded) {
    loadjs('/libs/mermaid.min.js', () => {
      // @ts-ignore
      fn(window.mermaid)
      mermaidLoaded = true
    })
  } else {
    // @ts-ignore
    fn(window.mermaid)
  }
}

export const renderMermaid = async (text: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    loadMermaid((mermaid) => {
      mermaid
        .render(`mermaid-svg-${uid()}`, text)
        .then((d) => {
          resolve(d.svg)
        })
        .catch((err: any) => {
          reject(err)
        })
    })
  })
}

/**遍历shiki插件生成的代码块内容 */
export const traverseCodeEls = (
  ctn: HTMLElement,
  fn: (codeEl: HTMLElement, preEl: HTMLElement, language: string) => void,
  language?: string
) => {
  const preEls = ctn.querySelectorAll<HTMLElement>('pre.shiki')
  for (const preEl of preEls) {
    const codeEl = preEl.querySelector<HTMLElement>('code')
    if (!codeEl) continue
    const codeLanguage = codeEl?.className.replace(/language-(\w*)\s?/, '$1')
    if (language && language !== codeLanguage) continue
    fn(codeEl, preEl, codeLanguage || '')
  }
}

export const getContentFromCodeEl = (el: HTMLElement) => {
  const t = el.nodeName !== 'CODE' ? el.querySelector<HTMLElement>('code') : el
  return t?.innerText || ''
}

export const writeClipboard = async (text: string) => {
  return clipboard.writeText(text)
}

export const showToast = (text: string) => {
  Swal.fire({
    position: 'top',
    icon: undefined,
    title: undefined,
    text,
    showConfirmButton: false,
    timer: 800,
  })
}
