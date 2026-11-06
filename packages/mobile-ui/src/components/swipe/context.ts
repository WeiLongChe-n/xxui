import type { ComputedRef, InjectionKey } from 'vue'

export interface SwipeContext {
  count: ComputedRef<number>
  active: ComputedRef<number>
  register: () => void
}

export const SWIPE_KEY: InjectionKey<SwipeContext> = Symbol('vl-swipe')
