<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { addUnit, clamp, createNamespace } from '../../utils'

defineOptions({ name: 'XCol' })

const props = withDefaults(
  defineProps<{
    /** 占据的栅格数，共 24 栅格 */
    span?: number
    /** 向右偏移的栅格数 */
    offset?: number
    /** 排序权重，等价于 flex order */
    order?: number | string
    /** 自定义宽度，设置后覆盖 span（可传 100 或 '33.3%'） */
    width?: string | number
    /** 自身在交叉轴上的对齐方式 */
    align?: 'top' | 'middle' | 'bottom' | 'stretch'
    /** 渲染的标签名 */
    tag?: string
  }>(),
  { span: 24, offset: 0, tag: 'div' },
)

const { bem } = createNamespace('col')

/** 栅格数转百分比，保留 4 位小数避免超长小数 */
const toPercent = (grid: number) => `${Number(((clamp(grid, 0, 24) / 24) * 100).toFixed(4))}%`

const colStyle = computed(() => {
  const style: CSSProperties = {}

  const size = props.width !== undefined ? addUnit(props.width) : toPercent(props.span)
  style.flex = `0 0 ${size}`
  style.maxWidth = size

  if (props.offset) {
    style.marginLeft = toPercent(props.offset)
  }
  if (props.order !== undefined) {
    style.order = String(props.order)
  }

  return style
})

const classes = computed(() => [bem(), props.align ? bem('', `align-${props.align}`) : ''])
</script>

<template>
  <component :is="tag" :class="classes" :style="colStyle">
    <slot />
  </component>
</template>

<style lang="scss">
.x-col {
  box-sizing: border-box;
  min-width: 0;
  padding: calc(var(--x-row-gutter-y, 0px) / 2) calc(var(--x-row-gutter-x, 0px) / 2);

  &--align-top {
    align-self: flex-start;
  }

  &--align-middle {
    align-self: center;
  }

  &--align-bottom {
    align-self: flex-end;
  }

  &--align-stretch {
    align-self: stretch;
  }
}
</style>
