import { onBeforeUnmount, watch, type ComputedRef, type Ref } from 'vue'

export const inBrowser = typeof window !== 'undefined'

/** 生成 BEM 类名：bem() → vl-button，bem('text') → vl-button__text，bem('', 'primary') → vl-button--primary */
export function createNamespace(name: string) {
  const block = `vl-${name}`
  const bem = (element?: string, modifier?: string) => {
    const base = element ? `${block}__${element}` : block
    return modifier ? `${base}--${modifier}` : base
  }
  return { name, block, bem }
}

/** 数字转 px */
export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number' || /^\d+(\.\d+)?$/.test(String(value))) {
    return `${value}${defaultUnit}`
  }
  return String(value)
}

/** 全局递增层级 */
let zIndexSeed = 2000
export const nextZIndex = () => ++zIndexSeed

/** 滚动锁定（引用计数，支持多个弹层叠加） */
let lockCount = 0
let savedOverflow = ''
let savedPaddingRight = ''

const isScrollable = (el: Element | null): boolean => {
  while (el && el !== document.body && el !== document.documentElement) {
    const style = window.getComputedStyle(el)
    const overflowY = style.overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
      return true
    }
    el = el.parentElement
  }
  return false
}

const onTouchMove = (event: TouchEvent) => {
  if (!isScrollable(event.target as Element)) {
    event.preventDefault()
  }
}

export function lockScroll() {
  if (!inBrowser) return
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow
    savedPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.addEventListener('touchmove', onTouchMove, { passive: false })
  }
  lockCount += 1
}

export function unlockScroll() {
  if (!inBrowser) return
  lockCount = Math.max(lockCount - 1, 0)
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow
    document.body.style.paddingRight = savedPaddingRight
    document.removeEventListener('touchmove', onTouchMove)
  }
}

/** 弹层显示时锁定页面滚动 */
export function useLockScroll(show: Ref<boolean> | ComputedRef<boolean>) {
  let locked = false
  const update = (value: boolean) => {
    if (value && !locked) {
      lockScroll()
      locked = true
    } else if (!value && locked) {
      unlockScroll()
      locked = false
    }
  }
  watch(show, update, { immediate: true })
  onBeforeUnmount(() => update(false))
}

export interface TouchState {
  startX: number
  startY: number
  deltaX: number
  deltaY: number
  offsetX: number
  offsetY: number
  direction: 'horizontal' | 'vertical' | ''
  isTap: boolean
}

/** 手势工具 */
export function useTouch() {
  const state: TouchState = {
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    direction: '',
    isTap: true,
  }

  const start = (event: TouchEvent) => {
    const touch = event.touches[0]
    state.startX = touch.clientX
    state.startY = touch.clientY
    state.deltaX = 0
    state.deltaY = 0
    state.offsetX = 0
    state.offsetY = 0
    state.direction = ''
    state.isTap = true
  }

  const move = (event: TouchEvent) => {
    const touch = event.touches[0]
    state.deltaX = touch.clientX - state.startX
    state.deltaY = touch.clientY - state.startY
    state.offsetX = Math.abs(state.deltaX)
    state.offsetY = Math.abs(state.deltaY)
    if (!state.direction) {
      if (state.offsetX > state.offsetY && state.offsetX > 10) {
        state.direction = 'horizontal'
      } else if (state.offsetY > state.offsetX && state.offsetY > 10) {
        state.direction = 'vertical'
      }
    }
    if (state.offsetX > 5 || state.offsetY > 5) state.isTap = false
  }

  return { state, start, move }
}

/** 元素尺寸 */
export function getRect(el: HTMLElement | null) {
  if (!el) return { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 }
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom,
    right: rect.right,
  }
}

/** 数字范围限制 */
export const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max)

/** 空值判断 */
export const isDef = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null

/** 简易防抖 */
export function rafThrottle<T extends (...args: any[]) => void>(fn: T) {
  let locked = false
  return function (this: unknown, ...args: Parameters<T>) {
    if (locked) return
    locked = true
    requestAnimationFrame(() => {
      fn.apply(this, args)
      locked = false
    })
  }
}

/**
 * 取元素所属的 window。
 * 组件被渲染进 iframe（如文档站的沙箱预览）时，全局 window 指向宿主页面，
 * 滚动、指针与观察器若绑在宿主上就会失效，因此统一通过元素回溯。
 */
export function getOwnerWindow(el?: Element | null): Window & typeof globalThis {
  const view = el?.ownerDocument?.defaultView
  return (view as (Window & typeof globalThis) | null) ?? window
}

/** 取元素所属的 document，回退到全局 document */
export function getOwnerDocument(el?: Element | null): Document {
  return el?.ownerDocument ?? document
}

