<script setup lang="ts">
import { computed, ref } from 'vue'
import { createNamespace } from '../../utils'
import XIcon from '../icon/Icon.vue'

defineOptions({ name: 'XSearch' })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    shape?: 'square' | 'round'
    background?: string
    /** 右侧取消按钮 */
    showAction?: boolean
    actionText?: string
    clearable?: boolean
    disabled?: boolean
    maxlength?: number | string
    autofocus?: boolean
    leftIcon?: string
    rightIcon?: string
  }>(),
  {
    placeholder: '搜索',
    shape: 'square',
    showAction: true,
    actionText: '取消',
    clearable: true,
    background: 'var(--x-background)',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
  cancel: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const { bem } = createNamespace('search')

const inputRef = ref<HTMLInputElement>()
const value = computed(() => props.modelValue ?? '')
const focused = ref(false)

const onInput = (event: Event) => {
  const next = (event.target as HTMLInputElement).value
  emit('update:modelValue', next)
}

const onClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const onCancel = () => {
  emit('update:modelValue', '')
  emit('cancel')
}

const onSearch = () => emit('search', value.value)

const onFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const onBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
}
</script>

<template>
  <div :class="bem()" :style="{ background }">
    <div :class="[bem('content'), bem('content', shape), { [bem('content', 'focus')]: focused }]">
      <XIcon :name="leftIcon || 'search'" :class="bem('left-icon')" />
      <input
        ref="inputRef"
        :class="bem('input')"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :autofocus="autofocus"
        type="search"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="onSearch"
      />
      <XIcon
        v-if="clearable && value && !disabled"
        name="clear"
        :class="bem('clear')"
        @click="onClear"
      />
      <slot name="right-icon">
        <XIcon
          v-if="rightIcon"
          :name="rightIcon"
          :class="bem('right-icon')"
          @click="onSearch"
        />
      </slot>
    </div>
    <div
      v-if="showAction || $slots.action"
      :class="bem('action')"
      @click="onCancel"
    >
      <slot name="action">{{ actionText }}</slot>
    </div>
  </div>
</template>

<style lang="scss">
.x-search {
  display: flex;
  align-items: center;
  padding: 10px 12px;

  &__content {
    display: flex;
    flex: 1;
    align-items: center;
    height: 34px;
    padding: 0 10px;
    background: var(--x-background-2);
    border-radius: var(--x-radius);
    transition: box-shadow var(--x-duration-fast);

    &--round {
      border-radius: 999px;
    }

    &--focus {
      box-shadow: 0 0 0 1.5px var(--x-primary);
    }
  }

  &__left-icon {
    flex: none;
    margin-right: 6px;
    font-size: 16px;
    color: var(--x-text-color-3);
  }

  &__input {
    flex: 1;
    width: 100%;
    min-width: 0;
    padding: 0;
    font-size: var(--x-font-size);
    color: var(--x-text-color);
    background: transparent;
    border: 0;
    outline: none;

    &::placeholder {
      color: var(--x-text-color-4);
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &__clear {
    flex: none;
    margin-left: 4px;
    font-size: 15px;
    color: var(--x-text-color-4);
    cursor: pointer;
  }

  &__right-icon {
    flex: none;
    margin-left: 4px;
    font-size: 16px;
    color: var(--x-text-color-3);
  }

  &__action {
    flex: none;
    padding-left: 12px;
    font-size: var(--x-font-size);
    color: var(--x-primary);
    cursor: pointer;
  }
}
</style>
