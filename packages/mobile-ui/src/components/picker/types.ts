export type PickerValue = string | number

/** 滚轮选择器的选项，带 children 时自动形成级联列 */
export interface PickerOption {
  /** 展示文案 */
  text: string
  /** 唯一值 */
  value: PickerValue
  /** 子选项，存在时会出现下一列 */
  children?: PickerOption[]
  /** 禁用不可选 */
  disabled?: boolean
}

export interface PickerConfirmPayload {
  /** 每一列选中的值 */
  selectedValues: PickerValue[]
  /** 每一列选中的选项对象 */
  selectedOptions: PickerOption[]
}
