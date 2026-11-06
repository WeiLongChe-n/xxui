<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { createNamespace } from '../../utils'
import XIcon from '../icon/Icon.vue'
import type { PickerOption, PickerValue } from '../picker/types'

defineOptions({ name: 'XCascader' })

const props = withDefaults(
  defineProps<{
    /** 级联数据 */
    options?: PickerOption[]
    /** 单选为 value 路径，多选为多条路径，支持 v-model */
    modelValue?: PickerValue[] | PickerValue[][]
    /** 是否多选 */
    multiple?: boolean
    title?: string
    /** 是否显示右上角关闭按钮 */
    closeable?: boolean
    /** 多选时的已选上限 */
    max?: number
    /** 空数据文案 */
    emptyText?: string
  }>(),
  {
    options: () => [],
    modelValue: () => [],
    multiple: false,
    closeable: true,
    emptyText: '暂无数据',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: PickerValue[] | PickerValue[][]]
  /** 选中某个节点 */
  change: [value: PickerValue[] | PickerValue[][], node: PickerOption | null]
  /** 单选选中叶子 / 多选点击确定 */
  finish: [value: PickerValue[] | PickerValue[][]]
  close: []
}>()

const { bem } = createNamespace('cascader')

/* ---------------- 工具 ---------------- */

const keyOf = (value: PickerValue) => String(value)
const samePath = (a: string[], b: string[]) => a.length === b.length && a.every((key, i) => key === b[i])

/** 按 key 路径取出选项对象，保证输出保留原始 value 类型 */
const resolvePath = (keys: string[]): PickerOption[] => {
  const result: PickerOption[] = []
  let list: PickerOption[] | undefined = props.options
  for (const key of keys) {
    const found: PickerOption | undefined = list?.find((option) => keyOf(option.value) === key)
    if (!found) return result
    result.push(found)
    list = found.children
  }
  return result
}

const pathToKeys = (path: PickerValue[]) => path.map(keyOf)

/* ---------------- 单选 ---------------- */

/** 当前展开到哪一级 */
const activeKeys = ref<string[]>([])
/** 已选中的完整路径 */
const selectedKeys = ref<string[]>([])

/* ---------------- 多选 ---------------- */

/** 已选路径集合，父节点路径代表整棵子树 */
const checkedKeys = ref<string[][]>([])

const hasChildren = (option: PickerOption) => !!option.children?.length

const isChecked = (keys: string[]) =>
  checkedKeys.value.some((checked) => samePath(checked, keys) || keys.slice(0, checked.length).join('/') === checked.join('/'))

const isIndeterminate = (keys: string[]) => {
  if (isChecked(keys)) return false
  const prefix = keys.join('/')
  return checkedKeys.value.some((checked) => checked.join('/').startsWith(`${prefix}/`))
}

const toggleCheck = (option: PickerOption, prefixKeys: string[]) => {
  const keys = [...prefixKeys, keyOf(option.value)]
  const joined = keys.join('/')

  if (isChecked(keys)) {
    checkedKeys.value = checkedKeys.value.filter(
      (checked) => checked.join('/') !== joined && !checked.join('/').startsWith(`${joined}/`),
    )
  } else {
    if (props.max && countLeaves(checkedKeys.value) >= props.max) return
    const next = checkedKeys.value.filter((checked) => !checked.join('/').startsWith(`${joined}/`))
    next.push(keys)
    checkedKeys.value = next
  }

  emitValue(option)
}

/** 粗略统计已选叶子数量，用于 max 限制 */
const countLeaves = (paths: string[][]) =>
  paths.reduce((sum, path) => {
    const node = resolvePath(path).pop()
    return sum + (node ? countNodeLeaves(node) : 1)
  }, 0)

const countNodeLeaves = (node: PickerOption): number => {
  if (!node.children?.length) return 1
  return node.children.reduce((sum, child) => sum + countNodeLeaves(child), 0)
}

/* ---------------- 面板列 ---------------- */

interface PanelItem {
  options: PickerOption[]
  prefixKeys: string[]
}

const panels = computed<PanelItem[]>(() => {
  const result: PanelItem[] = []
  let list: PickerOption[] | undefined = props.options
  let prefix: string[] = []

  for (let level = 0; level < 10 && list?.length; level += 1) {
    result.push({ options: list, prefixKeys: prefix })
    const activeKey = activeKeys.value[level]
    if (!activeKey) break
    const active: PickerOption | undefined = list.find((option) => keyOf(option.value) === activeKey)
    if (!active?.children?.length) break
    prefix = [...prefix, activeKey]
    list = active.children
  }

  return result
})

/** 只展示当前层与上一层，避免横向滚动 */
const visiblePanels = computed(() => {
  const list = panels.value
  return list.length > 2 ? list.slice(-2) : list
})

/** 当前展开路径，用于面包屑回退 */
const trail = computed(() => {
  const result: { keys: string[]; text: string }[] = []
  let list: PickerOption[] | undefined = props.options
  let prefix: string[] = []

  for (const key of activeKeys.value) {
    const found: PickerOption | undefined = list?.find((option) => keyOf(option.value) === key)
    if (!found) break
    prefix = [...prefix, key]
    result.push({ keys: prefix, text: found.text })
    list = found.children
  }

  return result
})

const backTo = (keys: string[]) => {
  activeKeys.value = keys
}

const isSelected = (keys: string[]) => samePath(keys, selectedKeys.value)

const nodeKeys = (option: PickerOption, prefixKeys: string[]) => [...prefixKeys, keyOf(option.value)]

const onNodeClick = (option: PickerOption, prefixKeys: string[]) => {
  if (option.disabled) return
  const keys = nodeKeys(option, prefixKeys)

  if (props.multiple) {
    toggleCheck(option, prefixKeys)
    if (hasChildren(option)) activeKeys.value = keys
    return
  }

  activeKeys.value = keys
  if (hasChildren(option)) return

  selectedKeys.value = keys
  const path = resolvePath(keys).map((item) => item.value)
  emit('update:modelValue', path)
  emit('change', path, option)
  emit('finish', path)
}

const onExpand = (option: PickerOption, prefixKeys: string[]) => {
  if (!hasChildren(option)) return
  activeKeys.value = [...prefixKeys, keyOf(option.value)]
}

/* ---------------- 值同步与输出 ---------------- */

function emitValue(node: PickerOption | null) {
  if (!props.multiple) return
  const value = checkedKeys.value
    .slice()
    .sort((a, b) => a.length - b.length)
    .map((keys) => resolvePath(keys).map((item) => item.value))
  emit('update:modelValue', value)
  emit('change', value, node)
}

const onConfirm = () => {
  const value = checkedKeys.value.map((keys) => resolvePath(keys).map((item) => item.value))
  emit('finish', value)
}

watch(
  () => [props.options, props.modelValue, props.multiple] as const,
  () => {
    if (props.multiple) {
      const paths = (props.modelValue as PickerValue[][]).map((path) => pathToKeys(path ?? []))
      checkedKeys.value = paths
      activeKeys.value = paths[0] ?? []
    } else {
      const path = pathToKeys((props.modelValue as PickerValue[]) ?? [])
      selectedKeys.value = path
      activeKeys.value = path
    }
  },
  { immediate: true },
)

const checkedCount = computed(() => {
  if (!checkedKeys.value.length) return 0
  return checkedKeys.value.reduce((sum, keys) => {
    const node = resolvePath(keys).pop()
    return sum + (node ? countNodeLeaves(node) : 1)
  }, 0)
})
</script>

<template>
  <div :class="bem()">
    <div v-if="title || closeable" :class="bem('header')">
      <h3 :class="bem('title')">{{ title }}</h3>
      <button
        v-if="closeable"
        type="button"
        :class="bem('close')"
        aria-label="关闭"
        @click="emit('close')"
      >
        <XIcon name="close" />
      </button>
    </div>

    <div v-if="trail.length > 1" :class="bem('crumb')">
      <button
        v-for="(item, i) in trail"
        :key="i"
        type="button"
        :class="[bem('crumb-item'), { [bem('crumb-item', 'active')]: i === trail.length - 1 }]"
        @click="backTo(item.keys)"
      >
        {{ item.text }}
      </button>
    </div>

    <div :class="bem('panels')">
      <div v-for="(panel, panelIndex) in visiblePanels" :key="panelIndex" :class="bem('panel')">
        <div
          v-for="option in panel.options"
          :key="option.value"
          :class="[
            bem('option'),
            {
              [bem('option', 'active')]: !multiple && isSelected(nodeKeys(option, panel.prefixKeys)),
              [bem('option', 'disabled')]: option.disabled,
            },
          ]"
          @click="onNodeClick(option, panel.prefixKeys)"
        >
          <span
            v-if="multiple"
            :class="[
              bem('checkbox'),
              {
                [bem('checkbox', 'checked')]: isChecked(nodeKeys(option, panel.prefixKeys)),
                [bem('checkbox', 'indeterminate')]: isIndeterminate(
                  nodeKeys(option, panel.prefixKeys),
                ),
              },
            ]"
            role="checkbox"
            :aria-checked="isIndeterminate(nodeKeys(option, panel.prefixKeys)) ? 'mixed' : isChecked(nodeKeys(option, panel.prefixKeys))"
          >
            <XIcon v-if="isChecked(nodeKeys(option, panel.prefixKeys))" name="check" />
            <i v-else-if="isIndeterminate(nodeKeys(option, panel.prefixKeys))" :class="bem('checkbox-dash')" />
          </span>

          <span :class="bem('label')">{{ option.text }}</span>

          <span
            v-if="hasChildren(option)"
            :class="bem('arrow')"
            @click.stop="onExpand(option, panel.prefixKeys)"
          >
            <XIcon name="arrow-right" />
          </span>
        </div>

        <div v-if="!panel.options.length" :class="bem('empty')">{{ emptyText }}</div>
      </div>
    </div>

    <div v-if="multiple" :class="bem('footer')">
      <span :class="bem('count')">已选 {{ checkedCount }} 项</span>
      <button type="button" :class="bem('confirm')" @click="onConfirm">确定</button>
    </div>
  </div>
</template>

<style lang="scss">
.x-cascader {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--x-background-2);

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    border-bottom: 1px solid var(--x-border-color);
  }

  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--x-text-color);
  }

  &__close {
    position: absolute;
    top: 50%;
    right: 8px;
    display: flex;
    padding: 8px;
    font-size: 16px;
    color: var(--x-text-color-3);
    cursor: pointer;
    background: none;
    border: 0;
    transform: translateY(-50%);
  }

  &__crumb {
    display: flex;
    gap: 2px;
    padding: 6px 10px;
    overflow-x: auto;
    white-space: nowrap;
  }

  &__crumb-item {
    flex: none;
    padding: 3px 8px;
    font-size: 12px;
    color: var(--x-text-color-3);
    cursor: pointer;
    background: none;
    border: 0;
    border-radius: 999px;

    &--active {
      font-weight: 500;
      color: var(--x-primary);
      background: var(--x-primary-light);
    }
  }

  &__panels {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &__panel {
    flex: 1 1 50%;
    min-width: 0;
    max-height: 300px;
    padding: 4px 0;
    overflow-y: auto;
    border-right: 1px solid var(--x-border-color);

    &:last-child {
      border-right: 0;
    }
  }

  &__option {
    display: flex;
    gap: 6px;
    align-items: center;
    height: 44px;
    padding: 0 10px;
    font-size: 13px;
    color: var(--x-text-color);
    cursor: pointer;

    &:active {
      background: var(--x-active-color);
    }

    &--active {
      font-weight: 600;
      color: var(--x-primary);
      background: var(--x-primary-light);
    }

    &--disabled {
      color: var(--x-text-color-4);
      cursor: not-allowed;
    }
  }

  &__label {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__arrow {
    display: flex;
    flex: none;
    align-items: center;
    font-size: 14px;
    color: var(--x-text-color-3);
  }

  &__checkbox {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    font-size: 12px;
    color: #fff;
    background: var(--x-background-2);
    border: 1px solid var(--x-border-color);
    border-radius: 4px;

    &--checked,
    &--indeterminate {
      background: var(--x-primary);
      border-color: var(--x-primary);
    }
  }

  &__checkbox-dash {
    width: 9px;
    height: 2px;
    background: #fff;
    border-radius: 1px;
  }

  &__empty {
    padding: 32px 0;
    font-size: 12px;
    color: var(--x-text-color-3);
    text-align: center;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-top: 1px solid var(--x-border-color);
  }

  &__count {
    font-size: 12px;
    color: var(--x-text-color-3);
  }

  &__confirm {
    padding: 8px 20px;
    font-size: 14px;
    color: #fff;
    cursor: pointer;
    background: var(--x-primary);
    border: 0;
    border-radius: 999px;
  }
}
</style>
