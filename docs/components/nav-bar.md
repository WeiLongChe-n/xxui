# NavBar 导航栏

导航栏固定在页面顶部，包含返回、标题与右侧操作区。支持吸顶、占位与安全区适配。

## 基础用法

<DemoBlock title="导航栏" description="左侧返回箭头、右侧操作、自定义插槽与无返回箭头形态" :code="code">
  <NavBarBasic />
</DemoBlock>

## 固定顶部

```vue
<x-nav-bar title="页面标题" fixed placeholder safe-area-inset-top />
```

`fixed` 会脱离文档流，`placeholder` 会生成一个等高的占位元素避免内容被遮挡；`safe-area-inset-top` 在刘海屏上自动增加顶部内边距。

## 自定义两侧

```vue
<x-nav-bar title="标题">
  <template #left>
    <x-icon name="arrow-left" />
  </template>
  <template #right>
    <x-icon name="setting" />
  </template>
</x-nav-bar>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string` | - |
| leftText | 左侧文字 | `string` | - |
| rightText | 右侧文字 | `string` | - |
| leftArrow | 是否显示返回箭头 | `boolean` | `true` |
| fixed | 是否固定顶部 | `boolean` | `false` |
| placeholder | 固定时是否生成占位 | `boolean` | `false` |
| safeAreaInsetTop | 是否适配顶部安全区 | `boolean` | `false` |
| border | 是否显示下边框 | `boolean` | `true` |
| zIndex | 层级 | `number` | `100` |
| leftDisabled / rightDisabled | 禁用点击 | `boolean` | `false` |

## Events

| 事件 | 说明 |
| --- | --- |
| click-left | 点击左侧区域 |
| click-right | 点击右侧区域 |

## Slots

| 名称 | 说明 |
| --- | --- |
| left | 左侧内容 |
| title | 标题内容 |
| right | 右侧内容 |

<script setup>
import NavBarBasic from '@demos/nav-bar/basic.vue'
import code from '@demos/nav-bar/basic.vue?raw'
</script>
