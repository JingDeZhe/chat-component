import loadjs from 'loadjs'
import { v4 as uid } from 'uuid'

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
  return {
    register: (fn: PostProcess) => list.push(fn),
    apply: (el: HTMLElement) => {
      for (const fn of list) {
        fn(el)
      }
    },
  }
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
