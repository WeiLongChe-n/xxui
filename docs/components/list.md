# List 列表

列表组件负责触底加载：滚动到接近底部时触发 `load` 事件，并自动处理加载中、加载完成、加载失败三种状态。

## 基础用法

<DemoBlock title="触底加载" description="滚动到接近底部自动加载下一页，加载 3 页后显示「没有更多了」" :code="code">
  <ListBasic />
</DemoBlock>

## 基本结构

```vue
<x-list
  :loading="loading"
  :finished="finished"
  :error="error"
  finished-text="没有更多了"
  @load="onLoad"
>
  <x-cell v-for="item in list" :key="item.id" :title="item.title" />
</x-list>
```

`@load` 会在以下时机触发：

1. 组件挂载时（`immediate-check` 为 `true`，默认开启）；
2. 占位元素进入视口下方 `offset` 像素范围内；
3. 每次 `loading` 结束后重新观察。

## 状态流转

```ts
const loading = ref(false)
const finished = ref(false)
const error = ref(false)

const onLoad = async () => {
  loading.value = true
  try {
    const data = await fetchList()
    list.value.push(...data)
    if (data.length < pageSize) finished.value = true
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}
```

## 错误重试

`error` 为 `true` 时会展示错误文案，点击后触发 `update:error(false)`，随后自动重新检查是否需要加载。

```vue
<x-list v-model:error="error" :loading="loading" :finished="finished" @load="onLoad" />
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否加载中 | `boolean` | `false` |
| finished | 是否加载完成 | `boolean` | `false` |
| error | 是否加载失败 | `boolean` | `false` |
| offset | 距底部多少像素触发 | `number` | `200` |
| immediateCheck | 挂载时是否立即检查 | `boolean` | `true` |
| loadingText | 加载中文案 | `string` | `加载中...` |
| finishedText | 完成文案 | `string` | `没有更多了` |
| errorText | 失败文案 | `string` | `加载失败，点击重试` |
| disabled | 是否禁用加载 | `boolean` | `false` |

## Events

| 事件 | 说明 |
| --- | --- |
| load | 需要加载更多 |
| update:error | 点击错误文案，参数为 `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 列表内容 |

<script setup>
import ListBasic from '@demos/list/basic.vue'
import code from '@demos/list/basic.vue?raw'
</script>
