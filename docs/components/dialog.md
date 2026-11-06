# Dialog 对话框

对话框用于需要用户确认的关键操作。提供 `Dialog.confirm()` / `Dialog.alert()` 函数式调用，也可以使用 `<x-dialog>` 组件嵌入复杂内容。

## 基础用法

<DemoBlock title="对话框形态" description="确认框、提示框、圆角按钮主题、异步关闭与组件式用法" :code="code">
  <DialogBasic />
</DemoBlock>

## 确认与提示

```ts
import { Dialog } from 'xxui-mobile'

const confirmed = await Dialog.confirm({
  title: '确认删除',
  message: '删除后不可恢复，确定要删除吗？',
})

if (confirmed) {
  // 用户点了确认
}
```

`confirm` 返回 `Promise<boolean>`：确认 `true`，取消 / 关闭 `false`。`Dialog.alert()` 只有确认按钮。

## 异步关闭

`beforeClose` 在关闭前触发，返回 `false` 或 `Promise<false>` 可阻止关闭，适合「提交中」这类需要等待的场景：

```ts
Dialog.confirm({
  title: '提交订单',
  message: '确定提交吗？',
  beforeClose: async (action) => {
    if (action !== 'confirm') return true
    await submitOrder()
    return true
  },
})
```

`action` 可能是 `confirm`、`cancel` 或 `overlay`（点击遮罩）。

## 圆角按钮主题

```ts
Dialog.confirm({ title: '开通会员', message: '首月 ¥9.9', theme: 'round-button' })
```

## 组件式调用

需要自定义内容（表单、列表、富文本）时使用组件：

```vue
<x-dialog v-model:show="visible" title="标题" show-cancel-button @confirm="onConfirm">
  <x-field v-model="reason" placeholder="请输入原因" />
</x-dialog>
```

## 全局默认值

```ts
Dialog.setDefaultOptions({ confirmButtonText: '好的', cancelButtonText: '再想想' })
Dialog.resetDefaultOptions()
```

## API

### DialogOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| message | 内容 | `string` | - |
| theme | 主题 | `default \| round-button` | `default` |
| showConfirmButton | 是否显示确认按钮 | `boolean` | `true` |
| showCancelButton | 是否显示取消按钮 | `boolean` | `false` |
| confirmButtonText | 确认按钮文案 | `string` | `确认` |
| cancelButtonText | 取消按钮文案 | `string` | `取消` |
| confirmButtonColor | 确认按钮颜色 | `string` | `--x-primary` |
| cancelButtonColor | 取消按钮颜色 | `string` | `--x-text-color-2` |
| confirmButtonDisabled | 禁用确认按钮 | `boolean` | `false` |
| cancelButtonDisabled | 禁用取消按钮 | `boolean` | `false` |
| closeOnClickOverlay | 点击遮罩是否关闭 | `boolean` | `false` |
| beforeClose | 关闭前拦截 | `(action) => boolean \| Promise<boolean>` | - |
| zIndex | 层级 | `number` | `8000` |

### 方法

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| `Dialog(options)` | 打开对话框 | `Promise<boolean>` |
| `Dialog.confirm(options)` | 打开带取消按钮的对话框 | `Promise<boolean>` |
| `Dialog.alert(options)` | 打开只有确认按钮的对话框 | `Promise<boolean>` |
| `Dialog.close()` | 关闭当前对话框 | `void` |
| `Dialog.setDefaultOptions(options)` | 修改全局默认配置 | `void` |
| `Dialog.resetDefaultOptions()` | 重置全局默认配置 | `void` |

### 组件 Props

与 `DialogOptions` 一致，通过 `v-model:show` 控制显隐。

### 组件 Events

| 事件 | 说明 |
| --- | --- |
| update:show | 显隐变化 |
| confirm | 点击确认 |
| cancel | 点击取消或遮罩 |
| closed | 关闭动画结束 |

### 组件 Slots

| 名称 | 说明 |
| --- | --- |
| default | 内容区域 |
| title | 自定义标题 |

<script setup>
import DialogBasic from '@demos/dialog/basic.vue'
import code from '@demos/dialog/basic.vue?raw'
</script>
