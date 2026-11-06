# Radio 单选框

单选框用于在多个选项中选择一个，通常在 `RadioGroup` 中配合使用。

## 基础用法

<DemoBlock title="单选组" description="组内 name 相同的选项互斥，支持纵向排列、方形样式与自定义颜色" :code="code">
  <RadioBasic />
</DemoBlock>

## 与组配合

```vue
<x-radio-group v-model="pay">
  <x-radio name="wechat">微信支付</x-radio>
  <x-radio name="alipay">支付宝</x-radio>
</x-radio-group>
```

组上的 `v-model` 是选中的 `name` 值，禁用整个组时设置 `disabled`。

## 独立使用

```vue
<x-radio v-model="value" name="a">选项 A</x-radio>
<x-radio v-model="value" name="b">选项 B</x-radio>
```

独立使用时通过 `v-model` 与 `name` 比较判断是否选中，适合选项分散在页面不同位置的场景。

## 样式

`shape="square"` 会渲染方形图标；`checked-color` 可单独覆盖选中色。

```vue
<x-radio name="a" shape="square" checked-color="#8b4ef5">方形</x-radio>
```

## API

### Radio Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 选项值 | `string \| number \| boolean` | - |
| modelValue | 选中值（独立使用） | `any` | - |
| shape | 形状 | `round \| square` | `round` |
| disabled | 是否禁用 | `boolean` | `false` |
| checkedColor | 选中颜色 | `string` | `--x-primary` |
| iconSize | 图标尺寸 | `string \| number` | `20` |

### Radio Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 独立使用时选中变化 | `value: any` |
| change | 同上 | `value: any` |
| click | 点击 | `event: MouseEvent` |

### RadioGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 选中值 | `string \| number \| boolean` | - |
| disabled | 禁用整组 | `boolean` | `false` |
| direction | 排列方向 | `horizontal \| vertical` | `horizontal` |

### RadioGroup Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | `value: any` |
| change | 同上 | `value: any` |

<script setup>
import RadioBasic from '@demos/radio/basic.vue'
import code from '@demos/radio/basic.vue?raw'
</script>
