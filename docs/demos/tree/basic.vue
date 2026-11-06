<template>
  <div class="demo-tree">
    <x-tree v-model:selected="selected" :data="data" default-expand-all />
    <p class="demo-tree__tip">当前选中：{{ selectedLabel || '未选择' }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TreeNode, TreeKey } from 'xxui-mobile'

const selected = ref<TreeKey | null>('xihu')

const data: TreeNode[] = [
  {
    key: 'zhejiang',
    label: '浙江省',
    children: [
      {
        key: 'hangzhou',
        label: '杭州市',
        children: [
          { key: 'xihu', label: '西湖区' },
          { key: 'yuhang', label: '余杭区' },
        ],
      },
      {
        key: 'ningbo',
        label: '宁波市',
        children: [{ key: 'haishu', label: '海曙区' }],
      },
    ],
  },
  {
    key: 'jiangsu',
    label: '江苏省',
    children: [
      {
        key: 'nanjing',
        label: '南京市',
        children: [{ key: 'xuanwu', label: '玄武区' }],
      },
    ],
  },
]

const flatten = (nodes: TreeNode[]): TreeNode[] =>
  nodes.flatMap((node) => [node, ...(node.children ? flatten(node.children) : [])])

const selectedLabel = computed(
  () => flatten(data).find((node) => node.key === selected.value)?.label,
)
</script>

<style scoped>
.demo-tree {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-tree__tip {
  margin: 0;
  padding: 0 12px;
  font-size: 12px;
  color: var(--x-text-color-2);
}
</style>
