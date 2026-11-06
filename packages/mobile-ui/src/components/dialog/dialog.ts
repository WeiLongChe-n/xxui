import { reactive } from 'vue'
import DialogComponent from './Dialog.vue'
import type { DialogAction } from './types'
import { createInstance } from '../../utils/mount'

export interface DialogOptions {
  title?: string
  message?: string
  theme?: 'default' | 'round-button'
  showConfirmButton?: boolean
  showCancelButton?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  confirmButtonDisabled?: boolean
  cancelButtonDisabled?: boolean
  closeOnClickOverlay?: boolean
  zIndex?: number
  beforeClose?: (action: DialogAction) => boolean | Promise<boolean>
}

const defaultOptions: DialogOptions = {
  title: '',
  message: '',
  theme: 'default',
  showConfirmButton: true,
  showCancelButton: false,
  confirmButtonText: '确认',
  cancelButtonText: '取消',
  closeOnClickOverlay: false,
  zIndex: 8000,
}

let currentOptions: DialogOptions = { ...defaultOptions }

interface DialogState extends DialogOptions {
  show: boolean
  onConfirm?: () => void
  onCancel?: () => void
  onClosed?: () => void
  ['onUpdate:show']?: (value: boolean) => void
}

const state = reactive<DialogState>({ ...defaultOptions, show: false })
const instance = createInstance(DialogComponent, state as unknown as Record<string, unknown>)

let resolvePending: ((value: boolean) => void) | null = null

const settle = (result: boolean) => {
  state.show = false
  if (resolvePending) {
    resolvePending(result)
    resolvePending = null
  }
}

state.onConfirm = () => settle(true)
state.onCancel = () => settle(false)
state['onUpdate:show'] = (value: boolean) => {
  if (!value) settle(false)
}

/**
 * 打开对话框，返回 Promise<boolean>，确认时为 true
 */
export function showDialog(options: DialogOptions = {}): Promise<boolean> {
  if (state.show) settle(false)
  Object.assign(state, currentOptions, options, { show: true })
  instance.mount()
  return new Promise<boolean>((resolve) => {
    resolvePending = resolve
  })
}

export interface DialogApi {
  (options?: DialogOptions): Promise<boolean>
  confirm: (options?: DialogOptions) => Promise<boolean>
  alert: (options?: DialogOptions) => Promise<boolean>
  close: () => void
  setDefaultOptions: (options: DialogOptions) => void
  resetDefaultOptions: () => void
}

/**
 * 对话框
 * Dialog.confirm({ title, message }) → Promise<boolean>
 */
export const Dialog = Object.assign(
  (options?: DialogOptions) => showDialog(options),
  {
    confirm(options: DialogOptions = {}) {
      return showDialog({ ...options, showCancelButton: true })
    },
    alert(options: DialogOptions = {}) {
      return showDialog({ ...options, showCancelButton: false })
    },
    close() {
      settle(false)
    },
    setDefaultOptions(options: DialogOptions) {
      currentOptions = { ...currentOptions, ...options }
    },
    resetDefaultOptions() {
      currentOptions = { ...defaultOptions }
    },
  },
) as DialogApi

export default Dialog
