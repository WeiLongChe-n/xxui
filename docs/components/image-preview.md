# ImagePreview 图片预览

全屏图片预览，支持左右滑动切换、页码与关闭按钮。提供命令式调用与组件式两种用法。

## 命令式调用

最常用的方式，调用后立即全屏展示，返回实例可用于关闭或跳转。

<DemoBlock title="点击缩略图预览" description="内置 5 张示例图，可左右滑动切换" :code="code" background="page">
  <PreviewBasic />
</DemoBlock>

```ts
import { ImagePreview } from '@vela/mobile'

const instance = ImagePreview({
  images: ['a.jpg', 'b.jpg'],
  startPosition: 0,
  onChange: (index) => console.log(index),
})

instance.close()
instance.swipeTo(1)
```

## 组件式用法

需要把预览放进自己的弹层体系时，可以直接使用组件，通过 `v-model:show` 控制显隐。

```vue
<vl-image-preview v-model:show="show" :images="images" :start-position="1" @change="onChange" />
```

## 使用提示

- 图片地址支持字符串，也支持 `{ url, alt }` 对象。
- 单张图片不会响应滑动，点击任意位置或右上角按钮关闭。
- 命令式调用默认挂载在 `body`，可用 `teleport` 指定其它容器；宿主也可用 `setDefaultTeleportTarget(el)` 统一改写。

## API

### 命令式参数

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| images | 图片列表 | `(string \| { url, alt? })[]` | - |
| startPosition | 初始位置，从 0 开始 | `number` | `0` |
| closeable | 是否显示关闭按钮 | `boolean` | `true` |
| showIndex | 是否显示页码 | `boolean` | `true` |
| teleport | 挂载节点，默认跟随上下文 | `string \| HTMLElement` | `'body'` |
| onChange | 切换图片回调 | `(index: number) => void` | - |
| onClose | 关闭回调 | `() => void` | - |

### 实例方法

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| close | 关闭预览 | - |
| swipeTo | 跳转到指定图片 | `index: number` |

### 组件 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示，支持 `v-model:show` | `boolean` | `false` |
| images | 图片列表 | `(string \| ImagePreviewItem)[]` | `[]` |
| startPosition | 初始位置 | `number` | `0` |
| closeable | 是否显示关闭按钮 | `boolean` | `true` |
| showIndex | 是否显示页码 | `boolean` | `true` |
| teleport | 挂载节点，默认跟随上下文 | `string \| HTMLElement` | `'body'` |

### 组件 Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐变化 | `value: boolean` |
| change | 切换图片 | `index: number` |
| close | 关闭 | - |

<script setup>
import PreviewBasic from '@demos/image-preview/basic.vue'
import code from '@demos/image-preview/basic.vue?raw'
</script>
