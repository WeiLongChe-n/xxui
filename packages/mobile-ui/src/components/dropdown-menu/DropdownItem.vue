<script setup lang="ts">
import { computed, getCurrentInstance, inject, ref, watch } from 'vue'
import { createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'
import type { DropdownOption, DropdownValue } from './types'

defineOptions({ name: 'VlDropdownItem' })

const props = withDefaults(
  defineProps<{
    /** 选中值，多选时为数组 */
    modelValue?: DropdownValue | DropdownValue[]
    /** 选项列表 */
    options?: DropdownOption[]
    /** 未选中时展示的标题 */
    title?: string
    disabled?: boolean
    multiple?: boolean
    /** 单选点击选项后是否自动收起 */
    closeOnClickOption?: boolean
    /** 展开时箭头是否旋转 */
    rotateArrow?: boolean
  }>(),
  {
    options: () => [],
    title: '请选择',
    multiple: false,
    closeOnClickOption: true,
    rotateArrow: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: DropdownValue | DropdownValue[]]
  change: [value: DropdownValue | DropdownValue[]]
  open: []
  close: []
  opened: []
  closed: []
}>()

const { bem } = createNamespace('dropdown-item')

interface MenuContext {
  activeKey: { value: number | null }
  open: (key: number) => void
  close: () => void
  toggle: (key: number) => void
}

const menu = inject<MenuContext>('vl-dropdown-menu')
const uid = getCurrentInstance()?.uid ?? 0

const expanded = computed(() => menu?.activeKey.value === uid)

/* ---------------- 多选草稿值 ---------------- */

const draft = ref<DropdownValue[]>([])

const syncDraft = () => {
  draft.value = Array.isArray(props.modelValue) ? [...props.modelValue] : []
}

watch(
  () => props.modelValue,
  () => syncDraft(),
  { immediate: true, deep: true },
)

const isActive = (option: DropdownOption) =>
  props.multiple
    ? draft.value.includes(option.value)
    : props.modelValue === option.value

const singleLabel = computed(
  () => props.options.find((option) => option.value === props.modelValue)?.text,
)

const displayTitle = computed(() => {
  if (props.multiple) {
    return draft.value.length ? `已选 ${draft.value.length} 项` : props.title
  }
  return singleLabel.value ?? props.title
})

const hasValue = computed(() =>
  props.multiple ? draft.value.length > 0 : props.modelValue !== undefined && props.modelValue !== '',
)

/* ---------------- 交互 ---------------- */

const onToggle = () => {
  if (props.disabled) return
  if (expanded.value) {
    menu?.close()
    emit('close')
  } else {
    menu?.toggle(uid)
    emit('open')
  }
}

const onSelect = (option: DropdownOption) => {
  if (option.disabled) return

  if (props.multiple) {
    const index = draft.value.indexOf(option.value)
    if (index > -1) draft.value.splice(index, 1)
    else draft.value.push(option.value)
    return
  }

  emit('update:modelValue', option.value)
  emit('change', option.value)
  if (props.closeOnClickOption) {
    menu?.close()
    emit('close')
  }
}

const onReset = () => {
  draft.value = []
}

const onConfirm = () => {
  emit('update:modelValue', [...draft.value])
  emit('change', [...draft.value])
  menu?.close()
  emit('close')
}
</script>

<template>
  <div :class="bem()">
    <button
      type="button"
      :class="[
        bem('title'),
        {
          [bem('title', 'active')]: expanded,
          [bem('title', 'selected')]: hasValue && !expanded,
          [bem('title', 'disabled')]: disabled,
        },
      ]"
      :disabled="disabled"
      @click="onToggle"
    >
      <span :class="bem('text')">{{ displayTitle }}</span>
      <VlIcon
        v-if="rotateArrow"
        name="arrow-down"
        :class="[bem('arrow'), { [bem('arrow', 'up')]: expanded }]"
      />
    </button>

    <Transition name="vl-dropdown-panel">
      <div v-if="expanded" :class="bem('panel')">
        <slot>
          <ul :class="bem('options')">
            <li
              v-for="option in options"
              :key="option.value"
              :class="[
                bem('option'),
                {
                  [bem('option', 'active')]: isActive(option),
                  [bem('option', 'disabled')]: option.disabled,
                },
              ]"
              @click="onSelect(option)"
            >
              <VlIcon v-if="option.icon" :name="option.icon" :class="bem('option-icon')" />
              <span :class="bem('option-text')">{{ option.text }}</span>
              <VlIcon v-if="isActive(option)" name="check" :class="bem('option-check')" />
            </li>
          </ul>
        </slot>

        <div v-if="multiple" :class="bem('footer')">
          <button type="button" :class="[bem('btn'), bem('btn', 'reset')]" @click="onReset">
            重置
          </button>
          <button type="button" :class="[bem('btn'), bem('btn', 'confirm')]" @click="onConfirm">
            确定
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.vl-dropdown-item {
  flex: 1;
  min-width: 0;

  &__title {
    display: flex;
    gap: 4px;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 48px;
    padding: 0 8px;
    overflow: hidden;
    font-size: 14px;
    color: var(--vl-text-color);
    cursor: pointer;
    background: none;
    border: 0;

    &--active,
    &--selected {
      font-weight: 500;
      color: var(--vl-primary);
    }

    &--disabled {
      color: var(--vl-text-color-4);
      cursor: not-allowed;
    }
  }

  &__text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__arrow {
    flex: none;
    font-size: 12px;
    transition: transform var(--vl-duration-fast) var(--vl-ease);

    &--up {
      transform: rotate(180deg);
    }
  }

  &__panel {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    z-index: 2;
    max-height: 420px;
    overflow-y: auto;
    background: var(--vl-background-2);
    border-radius: 0 0 var(--vl-radius) var(--vl-radius);
    box-shadow: var(--vl-shadow-2);
  }

  &__options {
    max-height: 340px;
    margin: 0;
    padding: 4px 0;
    overflow-y: auto;
    list-style: none;
  }

  &__option {
    display: flex;
    gap: 8px;
    align-items: center;
    height: 46px;
    padding: 0 16px;
    font-size: 14px;
    color: var(--vl-text-color);
    cursor: pointer;

    &:active {
      background: var(--vl-active-color);
    }

    &--active {
      font-weight: 500;
      color: var(--vl-primary);
    }

    &--disabled {
      color: var(--vl-text-color-4);
      cursor: not-allowed;
    }
  }

  &__option-icon {
    flex: none;
    font-size: 16px;
    color: var(--vl-text-color-2);
  }

  &__option-text {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__option-check {
    flex: none;
    font-size: 16px;
    color: var(--vl-primary);
  }

  &__footer {
    display: flex;
    gap: 12px;
    padding: 10px 16px;
    border-top: 1px solid var(--vl-border-color);
  }

  &__btn {
    flex: 1;
    height: 38px;
    font-size: 14px;
    cursor: pointer;
    border: 0;
    border-radius: 999px;

    &--reset {
      color: var(--vl-text-color-2);
      background: var(--vl-background-3);
    }

    &--confirm {
      color: #fff;
      background: var(--vl-primary);
    }
  }
}

.vl-dropdown-panel-enter-active,
.vl-dropdown-panel-leave-active {
  transition:
    opacity var(--vl-duration-fast) var(--vl-ease),
    transform var(--vl-duration-fast) var(--vl-ease);
}

.vl-dropdown-panel-enter-from,
.vl-dropdown-panel-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
