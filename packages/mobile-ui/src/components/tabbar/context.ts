import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type TabbarKey = string | number

export interface TabbarContext {
  activeKey: ComputedRef<TabbarKey>
  activeColor: ComputedRef<string | undefined>
  inactiveColor: ComputedRef<string | undefined>
  setActive: (key: TabbarKey) => void
  registerItem: () => number
  border: Ref<boolean>
}

export const TABBAR_KEY: InjectionKey<TabbarContext> = Symbol('x-tabbar')
