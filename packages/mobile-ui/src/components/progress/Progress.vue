<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'

defineOptions({ name: 'VlProgress' })

const props = withDefaults(
  defineProps<{
    percentage?: number | string
    /** 进度条高度 */
    strokeWidth?: string | number
    color?: string
    trackColor?: string
    showPivot?: boolean
    pivotText?: string
    /** 条纹效果 */
    striped?: boolean
    animated?: boolean
    /** 进度文字位置 */
    pivotPosition?: 'inside' | 'outside'
    size?: 'normal' | 'small'
  }>(),
  { percentage: 0, strokeWidth: 4, trackColor: 'var(--vl-background-3)', size: 'normal', pivotPosition: 'inside' },
)

const { bem } = createNamespace('progress')

const percent = computed(() => {
  const value = parseFloat(String(props.percentage))
  if (Number.isNaN(value)) return 0
  return Math.min(Math.max(value, 0), 100)
})

const height = computed(() => (props.size === 'small' ? 3 : addUnit(props.strokeWidth)))
const pivot = computed(() => props.pivotText ?? `${percent.value}%`)

const classes = computed(() => [
  bem(),
  {
    [bem('', 'striped')]: props.striped,
    [bem('', 'animated')]: props.animated,
  },
])
</script>

<template>
  <div :class="classes">
    <div
      :class="bem('track')"
      :style="{ height, background: trackColor, borderRadius: `calc(${height} / 2)` }"
    >
      <div
        :class="bem('portion')"
        :style="{ width: `${percent}%`, background: color || 'var(--vl-primary)', borderRadius: `calc(${height} / 2)` }"
      >
        <span
          v-if="showPivot"
          :class="[bem('pivot'), bem('pivot', pivotPosition)]"
        >
          {{ pivot }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.vl-progress {
  position: relative;
  width: 100%;

  &__track {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  &__portion {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    transition: width var(--vl-duration) var(--vl-ease);
  }

  &__pivot {
    position: absolute;
    top: 50%;
    right: 0;
    min-width: 24px;
    padding: 0 4px;
    font-size: var(--vl-font-size-xs);
    line-height: 16px;
    color: #fff;
    text-align: center;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 999px;
    transform: translate(50%, -50%);

    &--outside {
      right: 0;
      color: var(--vl-text-color-2);
      background: transparent;
      transform: translate(calc(100% + 6px), -50%);
    }
  }

  &--striped &__portion {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.2) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.2) 75%,
      transparent 75%
    );
    background-size: 20px 20px;
  }

  &--animated &__portion {
    animation: vl-progress-stripes 0.8s linear infinite;
  }
}

@keyframes vl-progress-stripes {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 20px 0;
  }
}
</style>
