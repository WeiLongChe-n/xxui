import type { ComputedRef, InjectionKey } from 'vue'

export type CollapseName = string | number

export interface CollapseContext {
  activeNames: ComputedRef<CollapseName[]>
  accordion: ComputedRef<boolean>
  border: ComputedRef<boolean>
  toggle: (name: CollapseName, expanded: boolean) => void
}

export const COLLAPSE_KEY: InjectionKey<CollapseContext> = Symbol('vl-collapse')
