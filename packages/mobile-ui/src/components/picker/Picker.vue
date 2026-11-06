<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { clamp, createNamespace } from '../../utils'
import VlPopup from '../popup/Popup.vue'
import VlLoading from '../loading/Loading.vue'
import type { PickerOption, PickerValue, PickerConfirmPayload } from './types'

defineOptions({ name: 'VlPicker' })

const props = withDefaults(
  defineProps<{
    /** 是否显示，支持 v-model:show */
    show?: boolean
    /** 选项数据：单列数组；二维数组表示多列；含 children 时自动级联 */
    columns?: PickerOption[] | PickerOption[][]
    /** 选中的值数组，支持 v-model */
    modelValue?: PickerValue[]
    title?: string
    cancelText?: string
    confirmText?: string
    showToolbar?: boolean
    /** 单行高度 */
    optionHeight?: number
    /** 可见行数，建议奇数 */
    visibleOptionNum?: number
    closeOnClickOverlay?: boolean
    loading?: boolean
  }>(),
  {
    show: false,
    columns: () => [],
    modelValue: () => [],
    cancelText: '取消',
    confirmText: '确认',
    showToolbar: true,
    optionHeight: 44,
    visibleOptionNum: 5,
    closeOnClickOverlay: true,
    loading: false,
  },
)

const emit = defineEmits<{
  'update:show': [value: boolean]
  'update:modelValue': [values: PickerValue[]]
  change: [payload: PickerConfirmPayload]
  confirm: [payload: PickerConfirmPayload]
  cancel: []
}>()

const { bem } = createNamespace('picker')

/* ---------------- 列与索引 ---------------- */

const columnList = ref<PickerOption[][]>([])
const indexes = ref<number[]>([])
const offsets = ref<number[]>([])
/** 拖拽中禁用过渡 */
const moving = ref(false)

const wrapperHeight = computed(() => props.optionHeight * props.visibleOptionNum)
const rootStyle = computed(() => ({
  '--vl-picker-option-height': `${props.optionHeight}px`,
  '--vl-picker-column-height': `${wrapperHeight.value}px`,
}))

/** 规范成「列数组」：单列数据包一层，二维数据直接作为多列 */
const baseColumns = computed<PickerOption[][]>(() => {
  const columns = props.columns as PickerOption[] | PickerOption[][]
  if (!Array.isArray(columns) || !columns.length) return []
  return Array.isArray(columns[0])
    ? (columns as PickerOption[][])
    : [columns as PickerOption[]]
})

/** 根据 values 还原出可见列与每列索引 */
const buildColumns = (values: PickerValue[] = []) => {
  const base = baseColumns.value
  const cols: PickerOption[][] = []
  const idxs: number[] = []
  let current: PickerOption[] | undefined = base[0]

  for (let level = 0; level < 10 && current?.length; level += 1) {
    cols.push(current)
    let index = 0
    if (values[level] !== undefined) {
      const found = current.findIndex((option) => option.value === values[level])
      if (found > -1) index = found
    }
    idxs.push(clamp(index, 0, current.length - 1))
    const selected: PickerOption | undefined = current[idxs[level]]
    current = selected?.children?.length ? selected.children : base[level + 1]
  }

  columnList.value = cols
  indexes.value = idxs
  offsets.value = idxs.map((index) => -index * props.optionHeight)
}

/** 选中项变化后，重建该列之后的所有列 */
const rebuildAfter = (column: number) => {
  const cols = columnList.value.slice(0, column + 1)
  const idxs = indexes.value.slice(0, column + 1)
  const offs = offsets.value.slice(0, column + 1)

  let current = cols[column]
  let index = idxs[column]

  for (let level = column; level < 10; level += 1) {
    const selected = current?.[index]
    const next = selected?.children?.length ? selected.children : baseColumns.value[level + 1]
    if (!next?.length) break
    cols.push(next)
    idxs.push(0)
    offs.push(0)
    current = next
    index = 0
  }

  columnList.value = cols
  indexes.value = idxs
  offsets.value = offs
}

const payload = (): PickerConfirmPayload => {
  const selectedOptions = columnList.value
    .map((col, index) => col[indexes.value[index]])
    .filter(Boolean) as PickerOption[]
  return {
    selectedOptions,
    selectedValues: selectedOptions.map((option) => option.value),
  }
}

const setIndex = (column: number, index: number) => {
  const list = columnList.value[column]
  if (!list?.length) return
  const target = clamp(index, 0, list.length - 1)
  const changed = indexes.value[column] !== target

  indexes.value[column] = target
  offsets.value[column] = -target * props.optionHeight
  rebuildAfter(column)

  if (changed) emit('change', payload())
}

/* ---------------- 触摸滚动 ---------------- */

const drag = { column: -1, startY: 0, startOffset: 0, lastY: 0, lastTime: 0, velocity: 0 }

const onTouchStart = (event: TouchEvent, column: number) => {
  moving.value = true
  drag.column = column
  drag.startY = event.touches[0].clientY
  drag.startOffset = offsets.value[column] ?? 0
  drag.lastY = drag.startY
  drag.lastTime = Date.now()
  drag.velocity = 0
}

const onTouchMove = (event: TouchEvent) => {
  const column = drag.column
  if (column < 0) return
  const y = event.touches[0].clientY
  const now = Date.now()
  const delta = now - drag.lastTime || 16
  drag.velocity = (y - drag.lastY) / delta
  drag.lastY = y
  drag.lastTime = now

  const list = columnList.value[column] ?? []
  const min = -(list.length - 1) * props.optionHeight
  let next = drag.startOffset + (y - drag.startY)

  // 两端阻尼，避免拖出边界后回弹过大
  if (next > 0) next *= 0.35
  if (next < min) next = min + (next - min) * 0.35

  offsets.value[column] = next
}

const onTouchEnd = () => {
  const column = drag.column
  if (column < 0) return
  drag.column = -1
  moving.value = false

  const momentum = drag.velocity * 160
  const next = (offsets.value[column] ?? 0) + momentum
  const list = columnList.value[column] ?? []
  const index = clamp(Math.round(-next / props.optionHeight), 0, Math.max(list.length - 1, 0))
  setIndex(column, index)
}

/* ---------------- 交互 ---------------- */

const onConfirm = () => {
  if (props.loading) return
  const result = payload()
  emit('update:modelValue', result.selectedValues)
  emit('confirm', result)
  emit('update:show', false)
}

const onCancel = () => {
  emit('cancel')
  emit('update:show', false)
}

const onClose = () => emit('update:show', false)

const onOptionClick = (column: number, index: number) => {
  if (columnList.value[column]?.[index]?.disabled) return
  setIndex(column, index)
}

watch(
  () => [props.columns, props.modelValue] as const,
  () => buildColumns(props.modelValue),
  { immediate: true },
)

// 每次打开时回到当前选中位置
watch(
  () => props.show,
  (value) => {
    if (value) buildColumns(props.modelValue)
  },
)
</script>

<template>
  <VlPopup
    :show="show"
    position="bottom"
    round
    safe-area-inset-bottom
    :close-on-click-overlay="closeOnClickOverlay"
    @update:show="(value: boolean) => emit('update:show', value)"
  >
    <div :class="bem()" :style="rootStyle">
      <div v-if="showToolbar" :class="bem('toolbar')">
        <button type="button" :class="bem('action')" @click="onCancel">{{ cancelText }}</button>
        <h3 :class="bem('title')">{{ title }}</h3>
        <button
          type="button"
          :class="[bem('action'), bem('action', 'confirm')]"
          :disabled="loading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </button>
      </div>

      <div :class="bem('columns')">
        <div
          v-for="(column, columnIndex) in columnList"
          :key="columnIndex"
          :class="bem('column')"
          @touchstart="onTouchStart($event, columnIndex)"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
          @touchcancel="onTouchEnd"
        >
          <ul
            :class="bem('list')"
            :style="{
              transform: `translate3d(0, ${offsets[columnIndex] ?? 0}px, 0)`,
              transition: moving ? 'none' : 'transform 0.28s cubic-bezier(0.22, 0.61, 0.36, 1)',
            }"
          >
            <li
              v-for="(option, optionIndex) in column"
              :key="option.value"
              :class="[
                bem('option'),
                {
                  [bem('option', 'selected')]: indexes[columnIndex] === optionIndex,
                  [bem('option', 'disabled')]: option.disabled,
                },
              ]"
              @click="onOptionClick(columnIndex, optionIndex)"
            >
              {{ option.text }}
            </li>
          </ul>
        </div>

        <div :class="bem('indicator')" />
        <div :class="[bem('mask'), bem('mask', 'top')]" />
        <div :class="[bem('mask'), bem('mask', 'bottom')]" />
      </div>

      <div v-if="loading" :class="bem('loading')">
        <VlLoading size="20px" :text="'加载中'" />
      </div>
    </div>
  </VlPopup>
</template>

<style lang="scss">
.vl-picker {
  position: relative;
  background: var(--vl-background-2);

  &__toolbar {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 6px;
    border-bottom: 1px solid var(--vl-border-color);
  }

  &__title {
    flex: 1;
    margin: 0;
    overflow: hidden;
    font-size: 15px;
    font-weight: 600;
    color: var(--vl-text-color);
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__action {
    flex: 0 0 64px;
    padding: 10px 8px;
    font-size: 14px;
    color: var(--vl-text-color-2);
    cursor: pointer;
    background: none;
    border: 0;

    &--confirm {
      font-weight: 500;
      color: var(--vl-primary);
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  &__columns {
    position: relative;
    display: flex;
    height: var(--vl-picker-column-height);
  }

  &__column {
    position: relative;
    flex: 1;
    height: var(--vl-picker-column-height);
    overflow: hidden;
  }

  &__list {
    margin: 0;
    padding: calc((var(--vl-picker-column-height) - var(--vl-picker-option-height)) / 2) 0;
    list-style: none;
    will-change: transform;
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--vl-picker-option-height);
    padding: 0 6px;
    overflow: hidden;
    font-size: 15px;
    color: var(--vl-text-color);
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;

    &--selected {
      font-weight: 600;
      color: var(--vl-text-color);
    }

    &--disabled {
      color: var(--vl-text-color-4);
      cursor: not-allowed;
    }
  }

  &__indicator {
    position: absolute;
    top: calc((var(--vl-picker-column-height) - var(--vl-picker-option-height)) / 2);
    right: 0;
    left: 0;
    height: var(--vl-picker-option-height);
    pointer-events: none;
    border-top: 1px solid var(--vl-text-color-4);
    border-bottom: 1px solid var(--vl-text-color-4);
  }

  &__mask {
    position: absolute;
    right: 0;
    left: 0;
    height: calc(var(--vl-picker-option-height) * 1.6);
    pointer-events: none;

    &--top {
      top: 0;
      background: linear-gradient(180deg, var(--vl-background-2), transparent);
    }

    &--bottom {
      bottom: 0;
      background: linear-gradient(0deg, var(--vl-background-2), transparent);
    }
  }

  &__loading {
    position: absolute;
    top: 48px;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--vl-background-2);
    opacity: 0.9;
  }
}
</style>
