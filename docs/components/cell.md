# Cell 单元格

单元格是移动端列表的基础单元，用于承载「标题 + 内容 + 箭头」这类信息。`CellGroup` 负责分组与卡片化。

## 基础用法

<DemoBlock title="单元格组合" description="展示基础单元格、带描述、带箭头、自定义右侧内容等形态" :code="code" background="page">
  <CellBasic />
</DemoBlock>

## 分组卡片

`CellGroup` 默认贴合页面两侧，设置 `inset` 后变为卡片样式（圆角 + 左右留白），这是移动端最常见的用法。

```vue
<x-cell-group inset title="基础用法">
  <x-cell title="单元格" value="内容" />
</x-cell-group>
```

## 图标与必填

`icon` 会在标题左侧渲染图标，`required` 会在标题前加红色星号，`size="large"` 会让标题字号升到 16px。

```vue
<x-cell title="我的订单" icon="cart" is-link />
<x-cell title="手机号" icon="phone" required value="138****8888" />
```

## 自定义内容

`value` 插槽用于右侧内容（替代 `value` 属性），`extra` 插槽位于箭头左侧，适合放开关、标签等控件；`title` / `label` 插槽可替代对应属性。

```vue
<x-cell title="通知">
  <template #value>
    <x-switch v-model="enabled" />
  </template>
</x-cell>
```

## 点击反馈

`is-link` 会自动开启点击反馈并展示右箭头；如果不需要箭头但需要反馈，使用 `clickable`。

```vue
<x-cell title="可点击" clickable @click="onClick" />
```

## API

### Cell Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 左侧标题 | `string \| number` | - |
| value | 右侧内容 | `string \| number` | - |
| label | 标题下方的描述 | `string` | - |
| icon | 左侧图标名称 | `string` | - |
| size | 尺寸 | `normal \| large` | `normal` |
| is-link | 显示箭头并开启点击反馈 | `boolean` | `false` |
| required | 标题前显示必填星号 | `boolean` | `false` |
| center | 内容垂直居中 | `boolean` | `false` |
| clickable | 开启点击反馈（不带箭头） | `boolean` | `false` |
| border | 是否显示下边框 | `boolean` | `true` |
| value-width | 右侧内容宽度 | `string \| number` | - |

### Cell Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击单元格 | `event: MouseEvent` |

### Cell Slots

| 名称 | 说明 |
| --- | --- |
| default | 默认插槽（不常用，会插入到标题区域） |
| icon | 自定义左侧图标 |
| title | 自定义标题 |
| label | 自定义描述 |
| value | 自定义右侧内容 |
| extra | 右侧内容与箭头之间的区域 |

### CellGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 分组标题 | `string` | - |
| inset | 是否为卡片式分组 | `boolean` | `false` |
| border | 是否显示单元格分割线 | `boolean` | `true` |

<script setup>
import CellBasic from '@demos/cell/basic.vue'
import code from '@demos/cell/basic.vue?raw'
</script>
