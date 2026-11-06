# Toast 轻提示

轻提示用于短时反馈，支持函数式与组件式两种用法。默认 2 秒后自动关闭。

## 基础用法

<DemoBlock title="提示形态" description="文本、成功、失败、加载中，以及位置、遮罩、自定义图标等变体" :code="code">
  <ToastBasic />
</DemoBlock>

## 函数式调用

```ts
import { Toast } from 'xxui-mobile'

Toast('这是一条提示')
Toast.success('保存成功')
Toast.fail('操作失败')
Toast.loading({ message: '加载中...', duration: 0 })
Toast.clear()
```

`Toast.loading` 常用于请求前提示，`duration: 0` 表示不自动关闭，请求结束后调用 `Toast.clear()`。

## 配置项

```ts
Toast({
  message: '顶部提示',
  position: 'top',
  duration: 1500,
  mask: true,
  forbidClick: true,
})
```

`mask` 会显示透明遮罩，`forbidClick` 阻止用户操作背景（两者常一起使用）。

## 全局默认值

```ts
Toast.setDefaultOptions({ duration: 1500, position: 'bottom' })
Toast.resetDefaultOptions()
```

## 组件式调用

需要自定义内容（如带按钮的提示）时，使用 `<x-toast>`：

```vue
<x-toast v-model:show="visible">
  <div>自定义内容</div>
</x-toast>
```

## API

### ToastOptions

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| message | 提示内容 | `string` | - |
| type | 提示类型 | `text \| loading \| success \| fail` | `text` |
| icon | 自定义图标名称 | `string` | - |
| position | 显示位置 | `top \| middle \| bottom` | `middle` |
| duration | 展示时长（ms），0 表示不自动关闭 | `number` | `2000` |
| mask | 是否显示透明遮罩 | `boolean` | `false` |
| forbidClick | 遮罩期间是否禁止点击背景 | `boolean` | `false` |
| transparent | 是否透明背景 | `boolean` | `false` |
| textAlign | 文字对齐 | `left \| center` | `center` |

### 方法

| 方法 | 说明 |
| --- | --- |
| `Toast(options \| string)` | 显示提示，返回关闭函数 |
| `Toast.success(options)` | 成功提示 |
| `Toast.fail(options)` | 失败提示 |
| `Toast.loading(options)` | 加载提示 |
| `Toast.clear()` | 关闭当前提示 |
| `Toast.setDefaultOptions(options)` | 修改全局默认配置 |
| `Toast.resetDefaultOptions()` | 重置全局默认配置 |

### 组件 Props

组件版与 `ToastOptions` 一致，另外通过 `v-model:show` 控制显隐，默认插槽可替换内容。

::: warning 多个实例
同一时间只会存在一个函数式 Toast，后一次调用会覆盖前一次。需要同时展示多个提示时，请改用组件式。
:::

<script setup>
import ToastBasic from '@demos/toast/basic.vue'
import code from '@demos/toast/basic.vue?raw'
</script>
