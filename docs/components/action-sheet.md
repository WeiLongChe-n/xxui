# ActionSheet 动作面板

动作面板从底部弹出，用于承载一组与当前情境相关的操作。

## 基础用法

<DemoBlock title="动作面板" description="支持标题描述、图标、副标题、禁用项、自定义颜色与面板间距" :code="code">
  <ActionSheetBasic />
</DemoBlock>

## 数据结构

```ts
import type { ActionSheetAction } from 'xxui-mobile'

const actions: ActionSheetAction[] = [
  { name: '微信支付', subname: '推荐使用', icon: 'service' },
  { name: '银行卡', subname: '余额不足', disabled: true },
  { name: '删除', color: '#ef4444' },
]
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| name | `string` | 选项名称（必填） |
| subname | `string` | 选项描述 |
| icon | `string` | 选项图标 |
| color | `string` | 文字颜色 |
| disabled | `boolean` | 是否禁用 |
| loading | `boolean` | 是否显示加载中 |

## 点击行为

默认点击选项后会自动关闭面板（`close-on-click-action`），若需要保留面板（例如切换支付方式后再确认），设为 `false`。

```vue
<x-action-sheet v-model:show="show" :actions="actions" :close-on-click-action="false" @select="onSelect" />
```

## 面板间距

`gap` 会在面板与取消按钮之间留出空隙，空隙处透出页面背景，常见于 iOS 风格设计。

```vue
<x-action-sheet v-model:show="show" :actions="actions" :gap="12" />
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示（v-model:show） | `boolean` | `false` |
| title | 标题 | `string` | - |
| description | 描述 | `string` | - |
| actions | 选项列表 | `ActionSheetAction[]` | `[]` |
| cancelText | 取消按钮文字 | `string` | `取消` |
| gap | 面板与取消按钮的间距 | `number` | `0` |
| closeOnClickAction | 点击选项后关闭 | `boolean` | `true` |
| closeOnClickOverlay | 点击遮罩关闭 | `boolean` | `true` |
| safeAreaInsetBottom | 适配底部安全区 | `boolean` | `true` |
| zIndex | 层级 | `number` | 自动递增 |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐变化 | `value: boolean` |
| select | 点击选项 | `(action, index)` |
| cancel | 点击取消 | - |
| closed | 关闭动画结束 | - |

## Slots

| 名称 | 说明 |
| --- | --- |
| title | 自定义标题 |

<script setup>
import ActionSheetBasic from '@demos/action-sheet/basic.vue'
import code from '@demos/action-sheet/basic.vue?raw'
</script>
