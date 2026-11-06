# Search 搜索

搜索框用于页面顶部的关键词检索，封装了搜索图标、清空、取消按钮与多种外观。

## 基础用法

<DemoBlock title="搜索框形态" description="支持方形与圆形、自定义背景、右侧操作按钮与禁用状态" :code="code">
  <SearchBasic />
</DemoBlock>

## 事件

```vue
<vl-search v-model="keyword" @search="onSearch" @cancel="onCancel" />
```

- `search`：回车或点击右侧图标时触发；
- `cancel`：点击取消按钮触发，同时清空输入；
- `clear`：点击清空图标触发。

## 外观

```vue
<vl-search v-model="keyword" shape="round" :show-action="false" />
<vl-search v-model="keyword" background="var(--vl-primary-light)" action-text="搜索" />
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 搜索关键词 | `string` | - |
| placeholder | 占位提示 | `string` | `搜索` |
| shape | 外观 | `square \| round` | `square` |
| background | 组件背景色 | `string` | `--vl-background` |
| showAction | 是否显示右侧按钮 | `boolean` | `true` |
| actionText | 右侧按钮文字 | `string` | `取消` |
| clearable | 是否可清空 | `boolean` | `true` |
| disabled | 是否禁用 | `boolean` | `false` |
| maxlength | 最大长度 | `number \| string` | - |
| autofocus | 自动聚焦 | `boolean` | `false` |
| leftIcon / rightIcon | 左右图标 | `string` | `search` / - |

## Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入变化 | `value: string` |
| search | 触发搜索 | `value: string` |
| clear | 点击清空 | - |
| cancel | 点击取消 | - |
| focus / blur | 聚焦 / 失焦 | `event: FocusEvent` |

## Slots

| 名称 | 说明 |
| --- | --- |
| action | 自定义右侧操作区域 |
| right-icon | 自定义右侧图标 |

<script setup>
import SearchBasic from '@demos/search/basic.vue'
import code from '@demos/search/basic.vue?raw'
</script>
