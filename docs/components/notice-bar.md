# NoticeBar 通知栏

通知栏用于在页面顶部展示一条需要用户注意的信息，支持滚动播放与关闭。

## 基础用法

<DemoBlock title="通知栏" description="文字超出容器时自动滚动；也可换行完整展示" :code="code">
  <NoticeBarBasic />
</DemoBlock>

## 滚动播放

文字宽度超过容器时会自动滚动，滚动速度由 `speed` 控制（px/s）：

```vue
<x-notice-bar text="本月会员日全场 8 折" :speed="80" />
```

设置 `wrapable` 后不再滚动，而是自动换行完整展示。

## 操作模式

| mode | 表现 |
| --- | --- |
| `link` | 右侧显示箭头，整条可点击 |
| `closeable` | 右侧显示关闭按钮 |
| `none` | 纯展示 |

```vue
<x-notice-bar text="可点击的通知" mode="link" @click="onClick" />
<x-notice-bar text="可关闭的通知" mode="closeable" @close="onClose" />
```

## 自定义样式

```vue
<x-notice-bar
  text="自定义颜色与图标"
  color="#8b4ef5"
  background="rgba(139,78,245,.12)"
  left-icon="gift"
/>
```

## 重新播放

通过 ref 调用 `replay()` 可以重播滚动动画：

```ts
const barRef = ref()
barRef.value?.replay()
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 通知内容 | `string` | - |
| mode | 操作模式 | `link \| closeable \| none` | `link` |
| color | 文字颜色 | `string` | `--x-warning` |
| background | 背景色 | `string` | 警告色 12% 透明度 |
| leftIcon | 左侧图标 | `string` | `bell` |
| showIcon | 是否显示左侧图标 | `boolean` | `true` |
| speed | 滚动速度（px/s） | `number` | `60` |
| wrapable | 是否换行展示 | `boolean` | `false` |
| scrollable | 是否允许滚动 | `boolean` | `true` |
| delay | 滚动延迟（秒） | `number` | `1` |

## Events

| 事件 | 说明 |
| --- | --- |
| click | 点击通知栏 |
| close | 点击关闭 |
| replay | 重播滚动 |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 追加在文字后的内容（如图标） |

<script setup>
import NoticeBarBasic from '@demos/notice-bar/basic.vue'
import code from '@demos/notice-bar/basic.vue?raw'
</script>
