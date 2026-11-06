<template>
  <div class="demo-tree">
    <x-tree v-model:checked="checked" :data="data" multiple default-expand-all />
    <p class="demo-tree__tip">
      已选 {{ checked.length }} 项<template v-if="checkedLabels.length">
        ：{{ checkedLabels.join('、') }}</template
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TreeNode, TreeKey } from '@xxui/mobile'

const checked = ref<TreeKey[]>(['xihu'])

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
          { key: 'binjiang', label: '滨江区' },
        ],
      },
      {
        key: 'ningbo',
        label: '宁波市',
        children: [
          { key: 'haishu', label: '海曙区' },
          { key: 'yinzhou', label: '鄞州区' },
        ],
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

const checkedLabels = computed(() => {
  const all = flatten(data)
  return checked.value
    .map((key) => all.find((node) => node.key === key)?.label)
    .filter(Boolean) as string[]
})
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
  line-height: 1.6;
  color: var(--x-text-color-2);
}
</style>
