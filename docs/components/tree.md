# Tree 树形选择

以树形结构展示层级数据，支持**单选**（整行高亮，适合分类导航、地区选择）与**多选**（复选框，支持父子联动与半选态，适合权限、筛选场景）。

## 单选

默认即单选模式，点击整行选中，通过 `v-model:selected` 双向绑定节点的 `key`。`default-expand-all` 会展开全部层级，也可以自行控制 `v-model:expandedKeys`。

<DemoBlock title="单选树" description="点击节点切换选中，右侧对勾标识当前项" :code="code">
  <TreeBasic />
</DemoBlock>

```vue
<vl-tree v-model:selected="selected" :data="data" default-expand-all />
```

## 多选与父子联动

设置 `multiple` 后每一行左侧出现复选框，`v-model:checked` 绑定选中的 `key` 数组。

默认开启父子联动：勾选父节点会选中全部后代，取消同理；当只有部分后代被选中时，父节点显示为**半选**（横线）状态。`checked` 的返回值包含因联动而全选的父节点，并按树中顺序排列，方便直接提交给后端。

<DemoBlock title="多选树" description="勾选任意节点，上方实时显示已选结果" :code="code2">
  <TreeMultiple />
</DemoBlock>

## 严格模式与禁用

`check-strictly` 关闭父子联动，父子状态各自独立，适合「父级本身也是一个可选项」的场景。节点设置 `disabled: true` 后不可点击，但仍会随父级联动同步状态。

<DemoBlock title="check-strictly" description="父子互不影响，禁用节点不响应操作" :code="code3">
  <TreeStrict />
</DemoBlock>

## 手风琴与自定义

`accordion` 让同一层级同时只展开一个节点，适合层级较深、屏幕空间有限的场景。`indent` 调整每层缩进（默认 20px），节点还可以通过 `icon` 展示前置图标。

<DemoBlock title="手风琴模式" description="同层互斥展开，缩进 16px，带节点图标" :code="code4">
  <TreeAccordion />
</DemoBlock>

## 数据结构

```ts
interface TreeNode {
  key: string | number        // 唯一标识，必填
  label?: string              // 节点文案，缺省时回退 title / key
  title?: string              // 兼容常见数据结构的标题字段
  children?: TreeNode[]       // 子节点
  disabled?: boolean          // 禁用交互
  icon?: string               // 节点图标名称
}
```

节点文案也可以直接用 `label` 之外的字段渲染，只要在传给 `data` 前做一次映射即可：

```ts
const data = raw.map((item) => ({
  key: item.id,
  label: item.name,
  children: item.children?.map(/* 递归映射 */),
}))
```

## 使用提示

- `key` 必须全局唯一，重复会导致展开与选中状态串位。
- 数据量较大时建议只展开必要的层级，收起状态下的子节点不会被渲染。
- 需要支持搜索过滤时，可先对 `data` 做过滤再传入，组件会自动重建索引。

## API

### Tree Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 树形数据 | `TreeNode[]` | `[]` |
| multiple | 是否多选模式（显示复选框） | `boolean` | `false` |
| checkStrictly | 多选时父子状态是否各自独立 | `boolean` | `false` |
| selected | 单选选中值，支持 `v-model:selected` | `string \| number \| null` | `null` |
| checked | 多选选中值，支持 `v-model:checked` | `(string \| number)[]` | `[]` |
| expandedKeys | 展开的节点，支持 `v-model:expandedKeys` | `(string \| number)[]` | - |
| defaultExpandAll | 默认展开全部节点 | `boolean` | `false` |
| accordion | 手风琴模式，同层只展开一个 | `boolean` | `false` |
| indent | 每一层的缩进距离 | `number \| string` | `20` |
| emptyText | 空数据文案 | `string` | `'暂无数据'` |

### Tree Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:selected | 单选值变化 | `key: string \| number` |
| update:checked | 多选值变化（按树中顺序） | `keys: (string \| number)[]` |
| update:expandedKeys | 展开节点变化 | `keys: (string \| number)[]` |
| select | 选中某个节点 | `(node: TreeNode, key: string \| number)` |
| check | 勾选状态变化 | `(keys: (string \| number)[], node: TreeNode \| null)` |
| expand | 展开 / 收起节点 | `(keys: (string \| number)[], node: TreeNode)` |

### 类型

```ts
import type { TreeNode, TreeKey } from '@vela/mobile'
```

<script setup>
import TreeBasic from '@demos/tree/basic.vue'
import TreeMultiple from '@demos/tree/multiple.vue'
import TreeStrict from '@demos/tree/strict.vue'
import TreeAccordion from '@demos/tree/accordion.vue'
import code from '@demos/tree/basic.vue?raw'
import code2 from '@demos/tree/multiple.vue?raw'
import code3 from '@demos/tree/strict.vue?raw'
import code4 from '@demos/tree/accordion.vue?raw'
</script>
