# Field 输入框

表单中的基础输入控件，封装了常见的输入类型、清空、字数统计、图标、错误提示等能力，并与 [Form](/components/form) 校验体系无缝对接。

## 基础用法

<DemoBlock title="输入框形态" description="覆盖输入类型、状态、图标、右文字、对齐方式等常用场景" :code="code">
  <FieldBasic />
</DemoBlock>

## 输入类型

`type` 决定键盘与输入过滤规则：

| type | 键盘 | 行为 |
| --- | --- | --- |
| `text` | 默认 | 普通文本 |
| `password` | 默认 | 掩码输入 |
| `tel` | 电话键盘 | 允许 `+`、`-` |
| `number` | 数字键盘 | 自动过滤非数字字符 |
| `digit` | 带小数点的数字键盘 | 过滤非数字且只保留一个小数点 |
| `textarea` | 默认 | 多行文本，支持 `autosize` |

```vue
<x-field v-model="phone" type="tel" label="手机号" placeholder="请输入手机号" />
<x-field v-model="amount" type="digit" label="金额" />
```

## 清空按钮

`clearable` 会在有内容且聚焦时显示清空按钮；`clear-trigger="always"` 则始终显示。

```vue
<x-field v-model="value" clearable placeholder="输入后显示清空按钮" />
```

## 文本域

```vue
<x-field
  v-model="desc"
  type="textarea"
  :rows="3"
  maxlength="60"
  show-word-limit
  autosize
/>
```

`autosize` 会随内容自动增高，也可以限制最大高度：`:autosize="{ maxHeight: 120 }"`。

## 图标与按钮

`left-icon` / `right-icon` 用于装饰或操作，`right-text` 适合放「获取验证码」这类文字按钮，`button` 插槽可以塞入完整的按钮组件。

```vue
<x-field label="验证码" right-text="获取验证码" @click-right-text="send" />
```

## 错误提示

`error` 传入字符串即显示错误态与错误文案，通常由 `Form` 校验结果接管。

```vue
<x-field v-model="value" label="手机号" error="手机号格式不正确" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 输入值 | `string \| number` | - |
| label | 左侧标签 | `string` | - |
| label-width | 标签宽度（可继承 Form 配置） | `string \| number` | - |
| label-align | 标签对齐 | `left \| center \| right` | `left` |
| type | 输入类型 | `text \| password \| number \| digit \| tel \| textarea` | `text` |
| size | 尺寸 | `normal \| large` | `normal` |
| placeholder | 占位提示 | `string` | - |
| disabled | 禁用 | `boolean` | `false` |
| readonly | 只读 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `false` |
| clear-trigger | 清空按钮显示时机 | `focus \| always` | `focus` |
| maxlength | 最大长度 | `number \| string` | - |
| left-icon / right-icon | 两侧图标 | `string` | - |
| right-text | 右侧文字按钮 | `string` | - |
| error | 错误提示文案 | `string` | - |
| border | 是否显示下边框 | `boolean` | `true` |
| input-align | 输入内容对齐 | `left \| center \| right` | `left` |
| autofocus | 自动聚焦 | `boolean` | `false` |
| rows | 文本域行数 | `number \| string` | `2` |
| autosize | 文本域自适应高度 | `boolean \| { maxHeight }` | `false` |
| show-word-limit | 显示字数统计 | `boolean` | `false` |
| required | 标签前显示必填星号 | `boolean` | `false` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入变化 | `value: string` |
| input | 输入变化 | `value: string` |
| change | 失焦或内容确认 | `value: string` |
| focus / blur | 聚焦 / 失焦 | `event: FocusEvent` |
| clear | 点击清空 | - |
| click-input | 点击输入框区域 | `event: MouseEvent` |
| click-right-icon | 点击右侧图标 | `event: MouseEvent` |
| click-right-text | 点击右侧文字按钮 | - |
| enter | 回车 | `event: KeyboardEvent` |

### Slots

| 名称 | 说明 |
| --- | --- |
| left-icon / right-icon | 自定义两侧图标 |
| button | 输入框右侧的按钮 |

### Expose

| 方法 | 说明 |
| --- | --- |
| focus | 聚焦输入框 |
| blur | 使输入框失焦 |

<script setup>
import FieldBasic from '@demos/field/basic.vue'
import code from '@demos/field/basic.vue?raw'
</script>
