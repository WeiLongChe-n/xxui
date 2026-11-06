import { reactive } from 'vue'
import ToastComponent from './Toast.vue'
import { createInstance } from '../../utils/mount'

export type ToastType = 'text' | 'loading' | 'success' | 'fail'

export interface ToastOptions {
  message?: string
  type?: ToastType
  icon?: string
  iconSize?: string | number
  position?: 'top' | 'middle' | 'bottom'
  /** 展示时长（ms），为 0 时不自动关闭 */
  duration?: number
  mask?: boolean
  forbidClick?: boolean
  transparent?: boolean
  textAlign?: 'left' | 'center'
}

const defaultOptions: Required<Pick<ToastOptions, 'duration' | 'position' | 'type'>> & ToastOptions = {
  duration: 2000,
  position: 'middle',
  type: 'text',
  mask: false,
  forbidClick: false,
  transparent: false,
}

let currentOptions: ToastOptions = { ...defaultOptions }

interface ToastState extends ToastOptions {
  show: boolean
}

const state = reactive<ToastState>({
  ...defaultOptions,
  show: false,
  message: '',
})

const instance = createInstance(ToastComponent, state as unknown as Record<string, unknown>)
let timer: ReturnType<typeof setTimeout> | null = null

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

/** 关闭当前提示 */
function close() {
  clearTimer()
  state.show = false
}

function parseOptions(options?: string | ToastOptions): ToastOptions {
  if (typeof options === 'string') return { message: options }
  return options || {}
}

function showToast(options?: string | ToastOptions) {
  const merged = { ...currentOptions, ...parseOptions(options) }
  clearTimer()
  instance.mount()
  Object.assign(state, merged, { show: true })

  const duration = merged.duration ?? 2000
  if (duration > 0) {
    timer = setTimeout(close, duration)
  }
  return close
}

function createMethod(type: ToastType) {
  return (options?: string | ToastOptions) => showToast({ ...parseOptions(options), type })
}

export interface ToastApi {
  (options?: string | ToastOptions): () => void
  success: (options?: string | ToastOptions) => () => void
  fail: (options?: string | ToastOptions) => () => void
  loading: (options?: string | ToastOptions) => () => void
  clear: () => void
  setDefaultOptions: (options: ToastOptions) => void
  resetDefaultOptions: () => void
}

/**
 * 轻提示
 * Toast('消息') / Toast.success('保存成功') / Toast.loading({ message: '加载中...', duration: 0 })
 */
export const Toast = Object.assign(
  (options?: string | ToastOptions) => showToast(options),
  {
    success: createMethod('success'),
    fail: createMethod('fail'),
    loading: createMethod('loading'),
    clear: close,
    setDefaultOptions(options: ToastOptions) {
      currentOptions = { ...currentOptions, ...options }
    },
    resetDefaultOptions() {
      currentOptions = { ...defaultOptions }
    },
  },
) as ToastApi

export default Toast
