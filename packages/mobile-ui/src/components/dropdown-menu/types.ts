export type DropdownValue = string | number

export interface DropdownOption {
  /** 展示文案 */
  text: string
  /** 选项值 */
  value: DropdownValue
  /** 禁用 */
  disabled?: boolean
  /** 选项图标 */
  icon?: string
}
