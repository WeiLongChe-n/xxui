<script setup lang="ts">
import { computed } from 'vue'
import { addUnit, createNamespace } from '../../utils'

defineOptions({ name: 'VlSkeleton' })

const props = withDefaults(
  defineProps<{
    loading?: boolean
    /** 段落行数 */
    rows?: number
    /** 行宽，支持单个值或数组 */
    rowWidth?: string | number | (string | number)[]
    /** 显示头像占位 */
    avatar?: boolean
    avatarSize?: string | number
    avatarShape?: 'round' | 'square'
    title?: boolean
    titleWidth?: string | number
    animated?: boolean
    round?: boolean
  }>(),
  {
    loading: true,
    rows: 3,
    rowWidth: '100%',
    title: true,
    titleWidth: '40%',
    avatarShape: 'round',
  },
)

const { bem } = createNamespace('skeleton')

const widths = computed(() => {
  const { rowWidth, rows } = props
  return Array.from({ length: rows }, (_, index) => {
    if (Array.isArray(rowWidth)) return rowWidth[index % rowWidth.length]
    return rowWidth
  })
})

const classes = computed(() => [bem(), { [bem('', 'animated')]: props.animated }])
</script>

<template>
  <div v-if="loading" :class="classes">
    <div
      v-if="avatar"
      :class="[bem('avatar'), bem('avatar', avatarShape)]"
      :style="{ width: addUnit(avatarSize || 48), height: addUnit(avatarSize || 48) }"
    />
    <div :class="bem('content')">
      <div
        v-if="title"
        :class="[bem('title'), round && bem('block', 'round')]"
        :style="{ width: addUnit(titleWidth) }"
      />
      <div
        v-for="(width, index) in widths"
        :key="index"
        :class="[bem('row'), round && bem('block', 'round')]"
        :style="{ width: addUnit(width) }"
      />
    </div>
  </div>
  <slot v-else />
</template>

<style lang="scss">
.vl-skeleton {
  display: flex;
  padding: 16px;
  background: var(--vl-background-2);

  &__avatar {
    flex: none;
    margin-right: 16px;
    background: var(--vl-background-3);

    &--round {
      border-radius: 50%;
    }

    &--square {
      border-radius: var(--vl-radius);
    }
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title,
  &__row {
    height: 16px;
    background: var(--vl-background-3);
    border-radius: 4px;
  }

  &__title {
    height: 20px;
    margin-bottom: 16px;
  }

  &__row + &__row {
    margin-top: 12px;
  }

  &__block--round {
    border-radius: 999px;
  }

  &--animated &__title,
  &--animated &__row,
  &--animated &__avatar {
    background-image: linear-gradient(
      90deg,
      var(--vl-background-3) 25%,
      var(--vl-border-color) 37%,
      var(--vl-background-3) 63%
    );
    background-size: 400% 100%;
    animation: vl-skeleton-loading 1.4s ease infinite;
  }
}

@keyframes vl-skeleton-loading {
  from {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}
</style>
