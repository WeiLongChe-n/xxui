export interface ImagePreviewItem {
  /** 图片地址 */
  url: string
  /** 图片描述 */
  alt?: string
}

export type ImageSource = string | ImagePreviewItem

export interface ImagePreviewOptions {
  /** 图片列表，字符串或 { url, alt } */
  images: ImageSource[]
  /** 初始位置，从 0 开始 */
  startPosition?: number
  /** 是否显示关闭按钮 */
  closeable?: boolean
  /** 是否显示页码 */
  showIndex?: boolean
  /** 挂载节点，默认 body */
  teleport?: string | HTMLElement
  /** 切换图片时触发 */
  onChange?: (index: number) => void
  /** 关闭时触发 */
  onClose?: () => void
}

export interface ImagePreviewInstance {
  /** 关闭预览 */
  close: () => void
  /** 切换到指定图片 */
  swipeTo: (index: number) => void
}
