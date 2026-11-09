<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'

defineOptions({ name: 'XBadge' })

const props = withDefaults(
  defineProps<{
    content?: string | number
    /** 仅显示红点 */
    dot?: boolean
    /** 最大值，超出后显示 99+ */
    max?: number
    color?: string
    /** 值为 0 时是否显示 */
    showZero?: boolean
    /** 独立展示（不包裹子元素） */
    standalone?: boolean
  }>(),
  { max: 99 },
)

const { bem } = createNamespace('badge')

const show = computed(() => {
  if (props.dot) return true
  if (props.content === undefined || props.content === null || props.content === '') return false
  if (props.content === 0 && !props.showZero) return false
  return true
})

const text = computed(() => {
  if (props.dot) return ''
  const value = props.content
  if (typeof value === 'number' && value > props.max) return `${props.max}+`
  return value
})

const classes = computed(() => [
  bem(),
  {
    [bem('', 'dot')]: props.dot,
    [bem('', 'standalone')]: props.standalone,
  },
])
</script>

<template>
  <span :class="bem('wrap')">
    <slot />
    <span v-if="show" :class="classes" :style="{ background: color }">{{ text }}</span>
  </span>
</template>

<style lang="scss">
.x-badge {
  display: inline-block;
  min-width: 16px;
  padding: 0 4px;
  font-size: var(--x-font-size-xs);
  font-weight: 500;
  line-height: 16px;
  color: #fff;
  text-align: center;
  background: var(--x-danger);
  border-radius: 999px;
  transform: translate(50%, -50%);
  transform-origin: 100% 0;

  &__wrap {
    position: relative;
    display: inline-flex;
    vertical-align: middle;

    .x-badge {
      position: absolute;
      top: 0;
      right: 0;
    }

    // standalone 的徽标要留在文档流里：一旦被上面的绝对定位命中，
    // 包裹容器就没有内容撑开宽度，多个独立徽标会全部塌到同一个点上重叠。
    // 两条选择器权重相同（0,2,0），靠书写顺序覆盖，所以必须写在上面那条之后。
    .x-badge--standalone {
      position: static;
      transform: none;
    }
  }

  &--dot {
    min-width: 8px;
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
  }

  &--standalone {
    transform: none;
  }
}
</style>
