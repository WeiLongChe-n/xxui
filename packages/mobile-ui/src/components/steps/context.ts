import type { ComputedRef, InjectionKey } from 'vue'

export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepsContext {
  active: ComputedRef<number>
  direction: ComputedRef<'horizontal' | 'vertical'>
  activeColor: ComputedRef<string>
  finishIcon: ComputedRef<string | undefined>
  activeIcon: ComputedRef<string | undefined>
  inactiveIcon: ComputedRef<string | undefined>
  register: () => number
  total: ComputedRef<number>
}

export const STEPS_KEY: InjectionKey<StepsContext> = Symbol('x-steps')
