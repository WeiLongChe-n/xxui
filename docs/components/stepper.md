# Stepper 步进器

步进器用于输入并调整数量，支持步长、范围限制、小数、拦截变更等能力。

## 基础用法

<DemoBlock title="步进器形态" description="展示范围限制、小数步长、禁用输入、尺寸与变更拦截" :code="code">
  <StepperBasic />
</DemoBlock>

## 范围与步长

```vue
<vl-stepper v-model="count" :min="0" :max="10" :step="0.5" :decimal-length="1" />
```

::: tip 关于 min
`min` 默认是 `1`。如果业务允许数量为 0（例如删除商品），记得显式传 `:min="0"`。
:::

## 允许输入

默认允许直接输入数值，失焦时自动格式化（取整、四舍五入、范围限制）。设置 `disable-input` 后只保留加减按钮。

```vue
<vl-stepper v-model="count" integer disable-input />
```

## 拦截变更

`before-change` 在值即将变化时触发，返回 `false` 或 `Promise<false>` 可阻止变更，适合做库存校验：

```ts
const beforeChange = (value: number) => {
  if (value > stock) {
    Toast('库存不足')
    return false
  }
  return true
}
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 当前值 | `number` | `1` |
| min | 最小值 | `number` | `1` |
| max | 最大值 | `number` | `Infinity` |
| step | 步长 | `number` | `1` |
| integer | 是否只允许整数 | `boolean` | `false` |
| decimalLength | 小数位数 | `number` | - |
| disabled | 是否禁用 | `boolean` | `false` |
| disableInput | 是否禁用输入框 | `boolean` | `false` |
| disablePlus / disableMinus | 单独禁用加/减 | `boolean` | `false` |
| inputWidth | 输入框宽度 | `string \| number` | `32` |
| buttonSize | 按钮尺寸 | `string \| number` | `28` |
| beforeChange | 变更前拦截 | `(value: number) => boolean \| Promise<boolean>` | - |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 值变化 | `value: number` |
| change | 值变化 | `(value: number, detail: 'plus' \| 'minus' \| 'input')` |
| plus / minus | 点击加 / 减 | - |
| overlimit | 点击了被限制的按钮 | `type: 'plus' \| 'minus'` |

<script setup>
import StepperBasic from '@demos/stepper/basic.vue'
import code from '@demos/stepper/basic.vue?raw'
</script>
