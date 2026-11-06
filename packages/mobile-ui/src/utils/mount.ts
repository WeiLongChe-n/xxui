import { createApp, h, type App, type Component } from 'vue'
import { getDefaultTeleportTarget } from './teleport'

export interface Instance<T> {
  state: T
  mount: () => void
  unmount: () => void
}

/**
 * 创建命令式组件实例。
 *
 * 挂载点为全局默认 Teleport 目标（通常是 body）；在沙箱预览等场景下
 * 宿主可以把默认目标改成沙箱 body，弹层就会落在预览框内。
 */
export function createInstance<T extends Record<string, unknown>>(
  component: Component,
  state: T,
): Instance<T> {
  let app: App | null = null
  let container: HTMLElement | null = null

  const resolveHost = () => {
    const target = getDefaultTeleportTarget()
    return target && typeof target === 'object' ? target : document.body
  }

  const mount = () => {
    if (typeof document === 'undefined') return

    if (!app) {
      const host = resolveHost()
      const doc = host.ownerDocument ?? document
      container = doc.createElement('div')
      container.className = 'vl-portal'
      host.appendChild(container)
      app = createApp({ render: () => h(component, state) })
      app.mount(container)
      return
    }

    // 容器被宿主移除过（如切换演示）时挂回当前目标，避免弹层不再出现
    if (container && !container.isConnected) {
      resolveHost().appendChild(container)
    }
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
