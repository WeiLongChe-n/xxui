import {
  computed,
  inject,
  provide,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

/**
 * 弹层挂载目标
 *
 * 组件默认把弹层 Teleport 到 `body`。在文档站的沙箱预览里，`body` 指的是
 * 宿主页面，弹层会跑到手机外；因此提供一层可覆盖的默认值：
 * - 组件树内可用 ConfigProvider 的 `teleport` 局部覆盖
 * - 宿主可调用 setDefaultTeleportTarget 临时改写全局默认
 */
export type TeleportTarget = string | HTMLElement | null | undefined

export const TELEPORT_TARGET_KEY: InjectionKey<Ref<TeleportTarget>> = Symbol('vl-teleport')

const fallback = shallowRef<TeleportTarget>('body')

/** 改写全局默认挂载目标（沙箱预览、微前端等场景使用） */
export function setDefaultTeleportTarget(target: TeleportTarget) {
  fallback.value = target
}

export function getDefaultTeleportTarget(): TeleportTarget {
  return fallback.value
}

/** 默认目标所在文档，滚动锁等操作应作用在同一个文档上 */
export function getTeleportDocument(): Document | null {
  const target = fallback.value
  if (target && typeof target === 'object' && target.ownerDocument) return target.ownerDocument
  return typeof document === 'undefined' ? null : document
}

export function provideTeleportTarget(target: TeleportTarget) {
  provide(
    TELEPORT_TARGET_KEY,
    computed(() => target),
  )
}

/** 解析当前组件应使用的挂载目标：显式传入 > 上下文 > 全局默认 */
export function useTeleportTarget(own?: TeleportTarget): ComputedRef<TeleportTarget> {
  const injected = inject(TELEPORT_TARGET_KEY, null)
  return computed(() => own ?? injected?.value ?? fallback.value ?? 'body')
}
