# DropdownMenu 下拉筛选

列表页顶部的筛选菜单，点击展开浮层选项，支持单选、多选与完全自定义的面板内容。

## 基础用法

`x-dropdown-menu` 是容器，`x-dropdown-item` 是每一项。同一时间只会展开一个菜单，点击遮罩自动收起。

<DemoBlock title="单选 / 多选 / 自定义" description="排序单选、筛选多选，第三项使用插槽自定义内容" :code="code">
  <DropdownBasic />
</DemoBlock>

```vue
<x-dropdown-menu>
  <x-dropdown-item v-model="sort" :options="sortOptions" title="综合排序" />
  <x-dropdown-item v-model="filters" :options="filterOptions" title="筛选" multiple />
</x-dropdown-menu>
```

## 自定义面板

不传 `options`、或给默认插槽提供内容时，面板会渲染插槽，可以做价格区间、标签选择等复杂筛选。

```vue
<x-dropdown-item title="更多">
  <div class="panel">...任意内容...</div>
</x-dropdown-item>
```

## 使用提示

- 多选时改动先写入草稿，点击「确定」才会通过 `update:modelValue` 提交。
- 设置 `:close-on-click-option="false"` 可以在单选后保持面板打开，适合需要连续切换的场景。
- 菜单栏默认均分宽度，`x-dropdown-item` 会根据数量自动伸缩。

## API

### DropdownMenu Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| closeOnClickOutside | 点击空白处是否关闭 | `boolean` | `true` |
| zIndex | 层级 | `number` | - |
| overlayOpacity | 遮罩透明度 | `number` | `0.35` |

### DropdownItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 选中值，多选时为数组，支持 `v-model` | `string \| number \| (string \| number)[]` | - |
| options | 选项列表 | `DropdownOption[]` | `[]` |
| title | 未选中时展示的标题 | `string` | `'请选择'` |
| disabled | 是否禁用 | `boolean` | `false` |
| multiple | 是否多选 | `boolean` | `false` |
| closeOnClickOption | 单选点击选项后是否收起 | `boolean` | `true` |
| rotateArrow | 展开时箭头是否旋转 | `boolean` | `true` |

### DropdownItem Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | `value` |
| change | 选中值变化（与上者同时触发） | `value` |
| open / close | 面板展开 / 收起 | - |

### 插槽

| 组件 | 插槽 | 说明 |
| --- | --- | --- |
| DropdownItem | default | 自定义面板内容，提供后不再渲染 `options` |

### 类型

```ts
interface DropdownOption {
  text: string
  value: string | number
  disabled?: boolean
  icon?: string
}
```

<script setup>
import DropdownBasic from '@demos/dropdown-menu/basic.vue'
import code from '@demos/dropdown-menu/basic.vue?raw'
</script>
