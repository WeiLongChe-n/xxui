# Form 表单

表单组件负责数据收集、校验与错误提示。`Form` 维护校验规则与整体状态，`FormItem` 负责单个字段的布局与校验，`Field` 等输入组件会自动与所在的 `FormItem` 通信。

## 基础用法

<DemoBlock title="收货信息表单" description="包含必填校验、正则校验、单选与自定义校验，提交时统一校验并聚焦错误提示" :code="code">
  <FormBasic />
</DemoBlock>

## 校验规则

规则既可以在 `Form` 的 `rules` 中按字段名统一配置，也可以在 `FormItem` 上用 `rules` 局部覆盖。

```ts
import type { FieldRule } from '@xxui/mobile'

const rules: Record<string, FieldRule[]> = {
  username: [
    { required: true, message: '请填写用户名' },
    { min: 3, max: 12, message: '长度需在 3~12 个字符之间' },
  ],
  phone: [
    { required: true },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' },
  ],
}
```

### FieldRule

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| required | `boolean` | 是否必填（空值拦截） |
| message | `string` | 错误文案，支持 `{label}` 占位符 |
| pattern | `RegExp` | 正则校验 |
| type | `'email' \| 'phone' \| 'number' \| 'url'` | 内置格式校验 |
| min | `number` | 最小长度（数组比较元素个数） |
| max | `number` | 最大长度 |
| validator | `(value, rule) => boolean \| string \| Promise` | 自定义校验，返回字符串即错误信息 |
| trigger | `'change' \| 'blur' \| 'submit'` | 触发时机，缺省表示全部时机 |
| label | `string` | 覆盖错误文案中的字段名 |

```ts
// 自定义校验：异步检查用户名是否被占用
{
  validator: async (value) => {
    const exists = await checkUsername(value)
    return exists ? '用户名已被占用' : true
  },
}
```

## 触发时机

默认在输入时（`change`）与失焦时（`blur`）校验，提交时全量校验。可以用规则的 `trigger` 精确控制：

```ts
{ required: true, trigger: 'blur' }  // 只在失焦时提示，避免输入过程打扰
```

## 手动调用

通过 ref 获取表单实例：

```vue
<x-form ref="formRef" :model="form" :rules="rules" />
```

```ts
await formRef.value.validate()      // 校验全部，失败时抛出 Error
await formRef.value.validateField('phone') // 校验单个字段
formRef.value.resetFields()         // 清除所有错误提示
formRef.value.clearValidate()       // 同上
```

## 布局

`label-width` 统一标签宽度，`label-align` 控制对齐，`star-position` 控制必填星号在左或在右。

```vue
<x-form :model="form" label-width="88" label-align="right" star-position="left" />
```

## 与控件配合

`Field`、`Checkbox`、`Radio`、`Rate`、`Stepper` 等都可以放进 `FormItem`。非输入类控件同样可以校验，只要 `name` 对应的 model 值存在：

```vue
<x-form-item name="agree" :rules="[{ validator: (v) => v === true || '请先同意协议' }]">
  <x-checkbox v-model="form.agree">我已阅读并同意</x-checkbox>
</x-form-item>
```

## API

### Form Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| model | 表单数据对象 | `Record<string, any>` | - |
| rules | 统一校验规则 | `Record<string, FieldRule[]>` | - |
| label-width | 标签宽度 | `string \| number` | - |
| label-align | 标签对齐 | `left \| center \| right` | `left` |
| star-position | 必填星号位置 | `left \| right` | `left` |
| show-error | 是否展示错误信息 | `boolean` | `true` |
| disabled | 禁用全部表单项 | `boolean` | `false` |
| scroll-to-error | 校验失败时滚动到错误项 | `boolean` | `true` |
| validate-on-blur | 失焦时触发校验 | `boolean` | `true` |

### Form Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 触发表单提交（原生 submit） | `values: Record<string, any>` |
| failed | 校验失败 | `errors: string[]` |

### Form Methods

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| validate | 校验全部字段 | `Promise<boolean>` |
| validateField | 校验指定字段 | `Promise<boolean>` |
| resetFields | 清除错误提示 | `void` |
| clearValidate | 清除错误提示 | `void` |

### FormItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 字段名，对应 model 与 rules 的 key | `string` | - |
| label | 标签文字 | `string` | - |
| rules | 局部校验规则（优先于 Form） | `FieldRule[]` | - |
| required | 是否显示必填星号 | `boolean` | 由规则推断 |
| label-width / label-align / star-position | 布局覆盖 | 同 Form | - |
| error | 手动指定的错误信息 | `string` | - |
| show-error | 是否展示错误信息 | `boolean` | 继承 Form |
| validate-trigger | 触发校验的时机 | `ValidateTrigger` | `change` |

### FormItem Slots

| 名称 | 说明 |
| --- | --- |
| default | 表单项内容 |
| label | 自定义标签 |
| help | 无错误时展示的帮助文字 |

<script setup>
import FormBasic from '@demos/form/basic.vue'
import code from '@demos/form/basic.vue?raw'
</script>
