# PullRefresh 下拉刷新

下拉刷新在页面顶部下拉时触发，常用于列表页重新拉取数据。

## 基础用法

<DemoBlock title="下拉刷新" description="触屏设备可直接下拉；桌面端可用按钮模拟刷新流程" :code="code">
  <PullRefreshBasic />
</DemoBlock>

## 基本结构

```vue
<x-pull-refresh v-model="loading" @refresh="onRefresh">
  <div class="content">...</div>
</x-pull-refresh>
```

`v-model` 绑定 loading 状态：组件内部在触发时会设为 `true`，请求结束后需要手动设为 `false`，组件会展示「刷新成功」并回弹。

```ts
const loading = ref(false)

const onRefresh = async () => {
  await fetchData()
  loading.value = false
}
```

## 文案与阈值

```vue
<x-pull-refresh
  v-model="loading"
  pulling-text="下拉即可刷新"
  loosing-text="释放立即刷新"
  loading-text="加载中..."
  success-text="刷新成功"
  :threshold="60"
/>
```

`threshold` 为触发刷新的下拉距离（px），下拉过程中有阻尼效果，实际位移会小于手指移动距离。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 是否加载中 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| threshold | 触发距离 | `number` | `60` |
| headHeight | 头部区域高度 | `number` | `50` |
| pullingText | 下拉中文案 | `string` | `下拉即可刷新` |
| loosingText | 释放前文案 | `string` | `释放立即刷新` |
| loadingText | 加载中文案 | `string` | `加载中...` |
| successText | 成功文案（为空则不展示成功态） | `string` | `刷新成功` |
| successDuration | 成功态停留时长（ms） | `number` | `500` |

## Events

| 事件 | 说明 |
| --- | --- |
| update:modelValue | loading 变化 |
| refresh | 触发刷新 |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 可下拉的内容 |

::: tip 与 List 组合
下拉刷新 + 触底加载是列表页的标准组合：`PullRefresh` 负责首屏与重置，`List` 负责分页追加。刷新时记得重置 `finished` 与页码。
:::

<script setup>
import PullRefreshBasic from '@demos/pull-refresh/basic.vue'
import code from '@demos/pull-refresh/basic.vue?raw'
</script>
