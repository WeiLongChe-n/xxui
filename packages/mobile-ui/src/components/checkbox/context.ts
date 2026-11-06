import type { ComputedRef, InjectionKey } from 'vue'

export type CheckboxValue = string | number | boolean

export interface CheckboxGroupContext {
  value: ComputedRef<CheckboxValue[]>
  disabled: ComputedRef<boolean>
  max: ComputedRef<number | undefined>
  toggle: (value: CheckboxValue) => void
}

export const CHECKBOX_GROUP_KEY: InjectionKey<CheckboxGroupContext> = Symbol('x-checkbox-group')

export type RadioValue = string | number | boolean

export interface RadioGroupContext {
  value: ComputedRef<RadioValue | undefined>
  disabled: ComputedRef<boolean>
  setValue: (value: RadioValue) => void
}

export const RADIO_GROUP_KEY: InjectionKey<RadioGroupContext> = Symbol('x-radio-group')
