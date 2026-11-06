<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { addUnit, createNamespace } from '../../utils'
import VlIcon from '../icon/Icon.vue'
import type { TreeItem, TreeKey, TreeNode } from './types'

defineOptions({ name: 'VlTree' })

const props = withDefaults(
  defineProps<{
    /** 树形数据 */
    data: TreeNode[]
    /** 多选模式：显示复选框并支持父子联动 */
    multiple?: boolean
    /** 多选模式下父子状态各自独立（不联动） */
    checkStrictly?: boolean
    /** 单选模式的选中值，支持 v-model:selected */
    selected?: TreeKey | null
    /** 多选模式的选中值，支持 v-model:checked */
    checked?: TreeKey[]
    /** 展开的节点，支持 v-model:expandedKeys */
    expandedKeys?: TreeKey[]
    /** 默认展开全部节点 */
    defaultExpandAll?: boolean
    /** 手风琴模式，同一层级只展开一个节点 */
    accordion?: boolean
    /** 每一层的缩进 */
    indent?: number | string
    /** 数据为空时的文案 */
    emptyText?: string
  }>(),
  {
    data: () => [] as TreeNode[],
    multiple: false,
    checkStrictly: false,
    selected: null,
    checked: () => [] as TreeKey[],
    indent: 20,
    emptyText: '暂无数据',
  },
)

const emit = defineEmits<{
  'update:selected': [key: TreeKey | null]
  'update:checked': [keys: TreeKey[]]
  'update:expandedKeys': [keys: TreeKey[]]
  select: [node: TreeNode, key: TreeKey]
  check: [keys: TreeKey[], node: TreeNode | null]
  expand: [keys: TreeKey[], node: TreeNode]
}>()

const { bem } = createNamespace('tree')

const hasChildren = (node: TreeNode) => !!node.children && node.children.length > 0

/* ---------------- 数据索引 ---------------- */

/** 全量扁平列表（不受展开状态影响） */
const flatNodes = computed<TreeItem[]>(() => {
  const result: TreeItem[] = []
  const walk = (nodes: TreeNode[], parentKey: TreeKey | null, depth: number) => {
    nodes.forEach((node) => {
      result.push({ node, key: node.key, parentKey, depth })
      if (node.children?.length) walk(node.children, node.key, depth + 1)
    })
  }
  walk(props.data, null, 0)
  return result
})

const nodeMap = computed(() => {
  const map = new Map<TreeKey, TreeItem>()
  flatNodes.value.forEach((item) => map.set(item.key, item))
  return map
})

/** 按树中顺序输出 key，保证 v-model 值稳定有序 */
const orderedKeys = (set: Set<TreeKey>) =>
  flatNodes.value.filter((item) => set.has(item.key)).map((item) => item.key)

/* ---------------- 展开状态 ---------------- */

const initExpanded = (): Set<TreeKey> => {
  if (props.expandedKeys) return new Set(props.expandedKeys)
  if (props.defaultExpandAll) {
    return new Set(flatNodes.value.filter((item) => hasChildren(item.node)).map((item) => item.key))
  }
  return new Set<TreeKey>()
}

const expandedSet = ref<Set<TreeKey>>(initExpanded())

watch(
  () => props.expandedKeys,
  (keys) => {
    if (keys) expandedSet.value = new Set(keys)
  },
)

const isExpanded = (key: TreeKey) => expandedSet.value.has(key)

const toggleExpand = (node: TreeNode) => {
  if (!hasChildren(node)) return
  const next = new Set(expandedSet.value)

  if (next.has(node.key)) {
    next.delete(node.key)
  } else {
    if (props.accordion) {
      const parentKey = nodeMap.value.get(node.key)?.parentKey ?? null
      flatNodes.value
        .filter((item) => item.parentKey === parentKey && item.key !== node.key)
        .forEach((item) => next.delete(item.key))
    }
    next.add(node.key)
  }

  expandedSet.value = next
  const keys = orderedKeys(next)
  emit('update:expandedKeys', keys)
  emit('expand', keys, node)
}

/** 当前可见节点：父节点收起时其子节点不渲染 */
const visibleNodes = computed<TreeItem[]>(() => {
  const result: TreeItem[] = []
  const walk = (nodes: TreeNode[], parentKey: TreeKey | null, depth: number) => {
    nodes.forEach((node) => {
      result.push({ node, key: node.key, parentKey, depth })
      if (node.children?.length && expandedSet.value.has(node.key)) {
        walk(node.children, node.key, depth + 1)
      }
    })
  }
  walk(props.data, null, 0)
  return result
})

/* ---------------- 单选 ---------------- */

const selectedKey = ref<TreeKey | null>(props.selected ?? null)

watch(
  () => props.selected,
  (value) => {
    selectedKey.value = value ?? null
  },
)

const isSelected = (key: TreeKey) => selectedKey.value === key

const selectNode = (node: TreeNode) => {
  if (node.disabled) return
  selectedKey.value = node.key
  emit('update:selected', node.key)
  emit('select', node, node.key)
}

/* ---------------- 多选 ---------------- */

const checkedSet = ref<Set<TreeKey>>(new Set(props.checked))

watch(
  () => props.checked,
  (keys) => {
    checkedSet.value = new Set(keys)
  },
  { deep: true },
)

/** 自身被选中且所有后代都被选中才算勾选 */
const isChecked = (node: TreeNode): boolean => {
  if (checkedSet.value.has(node.key)) return true
  return hasChildren(node) && (node.children as TreeNode[]).every(isChecked)
}

/** 部分后代被选中时为半选 */
const isIndeterminate = (node: TreeNode): boolean => {
  if (!hasChildren(node) || isChecked(node)) return false
  return (node.children as TreeNode[]).some(isChecked)
}

const collectKeys = (node: TreeNode, out: TreeKey[] = []): TreeKey[] => {
  out.push(node.key)
  node.children?.forEach((child) => collectKeys(child, out))
  return out
}

/** 自底向上收集祖先，用于联动回填 */
const ancestorsOf = (key: TreeKey): TreeItem[] => {
  const result: TreeItem[] = []
  let current = nodeMap.value.get(key)
  while (current?.parentKey !== null && current?.parentKey !== undefined) {
    const parent = nodeMap.value.get(current.parentKey)
    if (!parent) break
    result.push(parent)
    current = parent
  }
  return result
}

const applyChecked = (next: Set<TreeKey>, node: TreeNode | null) => {
  checkedSet.value = next
  const keys = orderedKeys(next)
  emit('update:checked', keys)
  emit('check', keys, node)
}

const toggleCheck = (node: TreeNode) => {
  if (node.disabled) return
  const next = new Set(checkedSet.value)
  const shouldCheck = !isChecked(node)
  const keys = props.checkStrictly ? [node.key] : collectKeys(node)

  keys.forEach((key) => (shouldCheck ? next.add(key) : next.delete(key)))

  if (!props.checkStrictly) {
    ancestorsOf(node.key).forEach((parent) => {
      const children = parent.node.children ?? []
      if (children.every((child) => next.has(child.key))) next.add(parent.key)
      else next.delete(parent.key)
    })
  }

  applyChecked(next, node)
}

const onNodeClick = (node: TreeNode) => {
  if (node.disabled) return
  if (props.multiple) toggleCheck(node)
  else selectNode(node)
}

/* ---------------- 渲染辅助 ---------------- */

const indentUnit = computed(() => addUnit(props.indent) ?? '20px')

const labelOf = (node: TreeNode) => node.label ?? node.title ?? String(node.key)
</script>

<template>
  <div :class="bem()" role="tree" :aria-multiselectable="multiple">
    <div
      v-for="item in visibleNodes"
      :key="item.key"
      :class="[
        bem('node'),
        {
          [bem('node', 'selected')]: !multiple && isSelected(item.key),
          [bem('node', 'disabled')]: item.node.disabled,
        },
      ]"
      :style="{ paddingLeft: `calc(${item.depth} * ${indentUnit} + 12px)` }"
      role="treeitem"
      :aria-selected="!multiple && isSelected(item.key)"
      :aria-expanded="hasChildren(item.node) ? isExpanded(item.key) : undefined"
      :aria-disabled="item.node.disabled"
      @click="onNodeClick(item.node)"
    >
      <span
        :class="[bem('arrow'), { [bem('arrow', 'open')]: isExpanded(item.key) }]"
        @click.stop="toggleExpand(item.node)"
      >
        <VlIcon v-if="hasChildren(item.node)" name="arrow-down" />
      </span>

      <span
        v-if="multiple"
        :class="[
          bem('checkbox'),
          {
            [bem('checkbox', 'checked')]: isChecked(item.node),
            [bem('checkbox', 'indeterminate')]: isIndeterminate(item.node),
          },
        ]"
        role="checkbox"
        :aria-checked="isIndeterminate(item.node) ? 'mixed' : isChecked(item.node)"
        @click.stop="toggleCheck(item.node)"
      >
        <VlIcon v-if="isChecked(item.node)" name="check" />
        <i v-else-if="isIndeterminate(item.node)" :class="bem('checkbox-dash')" />
      </span>

      <VlIcon v-if="item.node.icon" :name="item.node.icon" :class="bem('icon')" />

      <span :class="bem('label')">{{ labelOf(item.node) }}</span>

      <span v-if="!multiple" :class="bem('check')">
        <VlIcon v-if="isSelected(item.key)" name="check" />
      </span>
    </div>

    <div v-if="!data.length" :class="bem('empty')">{{ emptyText }}</div>
  </div>
</template>

<style lang="scss">
.vl-tree {
  padding: 4px 0;
  overflow: hidden;
  background: var(--vl-background-2);

  &__node {
    display: flex;
    gap: 8px;
    align-items: center;
    min-height: 46px;
    padding-right: 12px;
    font-size: var(--vl-cell-font-size);
    color: var(--vl-text-color);
    cursor: pointer;
    transition: background-color var(--vl-duration-fast) var(--vl-ease);

    &:active {
      background: var(--vl-active-color);
    }

    &--selected {
      color: var(--vl-primary);
      background: var(--vl-primary-light);
    }

    &--disabled {
      color: var(--vl-text-color-4);
      cursor: not-allowed;

      &:active {
        background: transparent;
      }
    }
  }

  &__arrow {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--vl-text-color-3);
    transform: rotate(-90deg);
    transition: transform var(--vl-duration-fast) var(--vl-ease);

    &--open {
      transform: rotate(0deg);
    }
  }

  &__node--disabled &__arrow {
    color: var(--vl-text-color-4);
  }

  &__checkbox {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 14px;
    color: #fff;
    background: var(--vl-background-2);
    border: 1px solid var(--vl-border-color);
    border-radius: 4px;
    transition:
      background-color var(--vl-duration-fast) var(--vl-ease),
      border-color var(--vl-duration-fast) var(--vl-ease);

    .vl-icon {
      transform: scale(0.85);
    }

    &--checked,
    &--indeterminate {
      background: var(--vl-primary);
      border-color: var(--vl-primary);
    }

    &--indeterminate {
      color: #fff;
    }
  }

  &__checkbox-dash {
    width: 10px;
    height: 2px;
    background: #fff;
    border-radius: 1px;
  }

  &__icon {
    flex: none;
    font-size: 16px;
    color: var(--vl-text-color-2);
  }

  &__label {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__check {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 16px;
    font-size: 16px;
    color: var(--vl-primary);
  }

  &__node--disabled &__icon,
  &__node--disabled &__check {
    color: var(--vl-text-color-4);
  }

  &__empty {
    padding: 32px 0;
    font-size: var(--vl-font-size-sm);
    color: var(--vl-text-color-3);
    text-align: center;
  }
}
</style>
