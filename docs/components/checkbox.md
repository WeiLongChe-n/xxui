# Checkbox 复选框

复选框用于在多个选项中选择任意个，配合 `CheckboxGroup` 使用时只需绑定一个数组。

## 基础用法

<DemoBlock title="复选框组" description="支持最多可选数量、纵向排列、圆形样式与禁用项" :code="code">
  <CheckboxBasic />
</DemoBlock>

## 与组配合

组内每个 `Checkbox` 的 `name` 即为该选项的值，组上的 `v-model` 是选中值数组：

```vue
<x-checkbox-group v-model="checked" :max="2">
  <x-checkbox name="原味">原味</x-checkbox>
  <x-checkbox name="抹茶">抹茶</x-checkbox>
</x-checkbox-group>
```

`max` 限制最多可选数量，超出后点击不再生效。

## 独立使用

不在组内时，使用布尔型的 `v-model`：

```vue
<x-checkbox v-model="agree">我已阅读并同意</x-checkbox>
```

## 形状与颜色

```vue
<x-checkbox v-model="value" shape="round" checked-color="#16a34a">圆形</x-checkbox>
```

## API

### Checkbox Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 选项值（组内使用） | `string \| number \| boolean` | - |
| modelValue | 是否选中（独立使用） | `boolean` | `false` |
| shape | 形状 | `square \| round` | `square` |
| disabled | 是否禁用 | `boolean` | `false` |
| checkedColor | 选中颜色 | `string` | `--x-primary` |
| iconSize | 图标尺寸 | `string \| number` | `20` |
| labelDisabled | 点击文字不触发切换 | `boolean` | `false` |

### Checkbox Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 独立使用时值变化 | `value: boolean` |
| change | 同上 | `value: boolean` |
| click | 点击 | `event: MouseEvent` |

### CheckboxGroup Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 选中值数组 | `(string \| number \| boolean)[]` | `[]` |
| max | 最多可选数量 | `number` | - |
| disabled | 禁用整组 | `boolean` | `false` |
| direction | 排列方向 | `horizontal \| vertical` | `horizontal` |

### CheckboxGroup Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 选中值变化 | `value: any[]` |
| change | 同上 | `value: any[]` |

<script setup>
import CheckboxBasic from '@demos/checkbox/basic.vue'
import code from '@demos/checkbox/basic.vue?raw'
</script>
