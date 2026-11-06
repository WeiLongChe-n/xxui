<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { addUnit, createNamespace } from '../../utils'

defineOptions({ name: 'XRow' })

type Gutter = number | string

const props = withDefaults(
  defineProps<{
    /** 列间距，传数组时为 [水平间距, 垂直间距] */
    gutter?: Gutter | [Gutter, Gutter]
    /** 主轴对齐方式 */
    justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
    /** 交叉轴对齐方式 */
    align?: 'top' | 'middle' | 'bottom' | 'stretch'
    /** 是否允许换行 */
    wrap?: boolean
    /** 渲染的标签名 */
    tag?: string
  }>(),
  { gutter: 0, justify: 'start', align: 'top', wrap: true, tag: 'div' },
)

const { bem } = createNamespace('row')

const normalize = (value?: Gutter) => addUnit(value) ?? '0px'

const gutterX = computed(() =>
  normalize(Array.isArray(props.gutter) ? props.gutter[0] : props.gutter),
)
const gutterY = computed(() => normalize(Array.isArray(props.gutter) ? props.gutter[1] : 0))

const rowStyle = computed(
  () =>
    ({
      '--x-row-gutter-x': gutterX.value,
      '--x-row-gutter-y': gutterY.value,
    }) as CSSProperties,
)

const classes = computed(() => [
  bem(),
  bem('', `justify-${props.justify}`),
  bem('', `align-${props.align}`),
  { [bem('', 'nowrap')]: !props.wrap },
])
</script>

<template>
  <component :is="tag" :class="classes" :style="rowStyle">
    <slot />
  </component>
</template>

<style lang="scss">
.x-row {
  display: flex;
  flex-wrap: wrap;
  margin: calc(var(--x-row-gutter-y, 0px) / -2) calc(var(--x-row-gutter-x, 0px) / -2);

  &--nowrap {
    flex-wrap: nowrap;
  }

  &--justify-start {
    justify-content: flex-start;
  }

  &--justify-end {
    justify-content: flex-end;
  }

  &--justify-center {
    justify-content: center;
  }

  &--justify-space-around {
    justify-content: space-around;
  }

  &--justify-space-between {
    justify-content: space-between;
  }

  &--justify-space-evenly {
    justify-content: space-evenly;
  }

  &--align-top {
    align-items: flex-start;
  }

  &--align-middle {
    align-items: center;
  }

  &--align-bottom {
    align-items: flex-end;
  }

  &--align-stretch {
    align-items: stretch;
  }
}
</style>
