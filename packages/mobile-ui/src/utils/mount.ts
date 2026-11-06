import { createApp, h, type App, type Component } from 'vue'

export interface Instance<T> {
  state: T
  mount: () => void
  unmount: () => void
}

/** 创建挂载到 body 的命令式组件实例 */
export function createInstance<T extends Record<string, unknown>>(
  component: Component,
  state: T,
): Instance<T> {
  let app: App | null = null
  let container: HTMLElement | null = null

  const mount = () => {
    if (app || typeof document === 'undefined') return
    container = document.createElement('div')
    container.className = 'vl-portal'
    document.body.appendChild(container)
    app = createApp({ render: () => h(component, state) })
    app.mount(container)
  }

  const unmount = () => {
    if (!app) return
    app.unmount()
    container?.remove()
    app = null
    container = null
  }

  return { state, mount, unmount }
}
