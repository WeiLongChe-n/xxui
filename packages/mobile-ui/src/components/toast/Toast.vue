<script setup lang="ts">
import { computed } from 'vue'
import { createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'
import VlLoading from '../loading/Loading.vue'

defineOptions({ name: 'VlToast' })

const props = withDefaults(
  defineProps<{
    show?: boolean
    message?: string
    type?: 'text' | 'loading' | 'success' | 'fail'
    /** 自定义图标名称 */
    icon?: string
    iconSize?: string | number
    position?: 'top' | 'middle' | 'bottom'
    /** 是否显示透明遮罩 */
    mask?: boolean
    /** 遮罩存在时是否禁止背景点击 */
    forbidClick?: boolean
    zIndex?: number
    transparent?: boolean
    textAlign?: 'left' | 'center'
    teleport?: string
  }>(),
  {
    type: 'text',
    position: 'middle',
    textAlign: 'center',
    teleport: 'body',
    zIndex: 9000,
  },
)

const emit = defineEmits<{ 'update:show': [value: boolean] }>()

const { bem } = createNamespace('toast')

const iconName = computed(() => {
  if (props.icon) return props.icon
  if (props.type === 'success') return 'success'
  if (props.type === 'fail') return 'fail'
  return ''
})

const classes = computed(() => [
  bem(),
  bem('', props.position),
  {
    [bem('', 'mask')]: props.mask,
  },
])
</script>

<template>
  <Teleport :to="teleport">
    <Transition name="vl-fade">
      <div
        v-if="show"
        :class="classes"
        :style="{ zIndex }"
        @click="mask && forbidClick ? null : emit('update:show', false)"
      >
        <div :class="[bem('box'), transparent && bem('box', 'transparent')]">
          <VlLoading
            v-if="type === 'loading'"
            :class="bem('icon')"
            :size="iconSize || 26"
            color="#fff"
            type="spinner"
          />
          <VlIcon
            v-else-if="iconName"
            :name="iconName"
            :class="bem('icon')"
            :size="iconSize || 30"
          />
          <div :class="[bem('text'), bem('text', textAlign)]" :style="{ textAlign }">
            <slot>{{ message }}</slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss">
.vl-toast {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  pointer-events: none;

  &--top {
    align-items: flex-start;
    padding-top: 12vh;
  }

  &--bottom {
    align-items: flex-end;
    padding-bottom: 16vh;
  }

  &--mask {
    background: transparent;
    pointer-events: auto;
  }

  &__box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 108px;
    max-width: 70vw;
    padding: 14px 18px;
    color: #fff;
    text-align: center;
    background: rgba(17, 19, 26, 0.82);
    backdrop-filter: blur(6px);
    border-radius: var(--vl-radius-lg);
    pointer-events: auto;

    &--transparent {
      background: transparent;
      backdrop-filter: none;
    }
  }

  &__icon {
    margin-bottom: 8px;
    color: #fff;
  }

  &__text {
    font-size: var(--vl-font-size);
    line-height: 20px;
    word-break: break-word;

    &--left {
      text-align: left;
    }
  }
}
</style>
