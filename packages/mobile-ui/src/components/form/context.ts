import type { InjectionKey } from 'vue'
import type { FieldRule, ValidateTrigger } from './types'

export interface FormItemInstance {
  uid: number
  name?: string
  validate: (trigger?: ValidateTrigger) => Promise<void>
  reset: () => void
  clearValidate: () => void
  hasError: () => boolean
}

export interface FormContext {
  model?: Record<string, any>
  rules?: Record<string, FieldRule[]>
  labelWidth?: string | number
  labelAlign?: 'left' | 'center' | 'right'
  starPosition?: 'left' | 'right'
  showError: boolean
  disabled: boolean
  register: (item: FormItemInstance) => void
  unregister: (uid: number) => void
}

export const FORM_KEY: InjectionKey<FormContext> = Symbol('vl-form')

/** Field 注入使用：拿到所属 FormItem 的校验能力 */
export const FORM_ITEM_KEY: InjectionKey<FormItemInstance> = Symbol('vl-form-item')
