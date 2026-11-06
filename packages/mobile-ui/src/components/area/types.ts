export type AreaValue = string | number

/** 级联/地区数据节点 */
export interface AreaOption {
  /** 展示文案 */
  text: string
  /** 唯一值，通常是行政区划代码 */
  value: AreaValue
  /** 子节点 */
  children?: AreaOption[]
  /** 是否禁用 */
  disabled?: boolean
}
