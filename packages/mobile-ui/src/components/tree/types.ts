export type TreeKey = string | number

export interface TreeNode {
  /** 唯一标识，必填 */
  key: TreeKey
  /** 节点文案，未设置时回退 title 或 key */
  label?: string
  /** 兼容常见数据的标题字段 */
  title?: string
  /** 子节点 */
  children?: TreeNode[]
  /** 禁用后不可点击 / 勾选 */
  disabled?: boolean
  /** 节点图标名称 */
  icon?: string
}

export interface TreeItem {
  node: TreeNode
  key: TreeKey
  parentKey: TreeKey | null
  depth: number
}
