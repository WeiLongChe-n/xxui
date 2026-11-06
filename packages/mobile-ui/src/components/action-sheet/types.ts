export interface ActionSheetAction {
  /** 选项名称 */
  name: string
  /** 选项描述 */
  subname?: string
  /** 选项文字颜色 */
  color?: string
  /** 是否为禁用状态 */
  disabled?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 选项图标 */
  icon?: string
}
