import { reactive } from 'vue'
import ImagePreviewComponent from './ImagePreview.vue'
import { createInstance } from '../../utils/mount'
import type { ImagePreviewInstance, ImagePreviewOptions } from './types'

/**
 * 命令式调用图片预览：
 * ImagePreview({ images: ['a.jpg', 'b.jpg'], startPosition: 1 })
 */
export function ImagePreview(options: ImagePreviewOptions): ImagePreviewInstance {
  let instance: ReturnType<typeof createInstance> | null = null

  const state = reactive<Record<string, unknown>>({
    show: true,
    images: options.images ?? [],
    startPosition: options.startPosition ?? 0,
    closeable: options.closeable ?? true,
    showIndex: options.showIndex ?? true,
    teleport: options.teleport ?? 'body',
    onChange: (index: number) => options.onChange?.(index),
    'onUpdate:show': (value: boolean) => {
      if (!value) requestClose()
    },
  })

  const requestClose = () => {
    if (!state.show) return
    state.show = false
    options.onClose?.()
    setTimeout(() => instance?.unmount(), 320)
  }

  instance = createInstance(ImagePreviewComponent, state)
  instance.mount()

  return {
    close: requestClose,
    swipeTo: (index: number) => {
      state.startPosition = index
    },
  }
}
