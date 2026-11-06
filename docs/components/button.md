# Button 按钮

按钮用于触发一个操作，是最基础的交互元素。支持五种类型、四种尺寸、朴素/圆角/块级等形态，以及加载中与图标组合。

## 基础用法

<DemoBlock title="类型与形态" description="通过 type 切换语义色，通过 size 控制尺寸，plain 用于次要操作" :code="code">
  <ButtonBasic />
</DemoBlock>

## 按钮类型

`type` 决定按钮的语义：`primary` 主操作、`success` 成功、`warning` 警告、`danger` 危险、`default` 次要操作。

```vue
<x-button type="primary">主要按钮</x-button>
<x-button type="success">成功按钮</x-button>
<x-button type="warning">警告按钮</x-button>
<x-button type="danger">危险按钮</x-button>
<x-button>默认按钮</x-button>
```

## 朴素按钮

设置 `plain` 后背景透明、边框与文字使用类型色，适合与主按钮并排时的次要操作。

```vue
<x-button type="primary" plain>主要按钮</x-button>
<x-button type="danger" plain>危险按钮</x-button>
```

## 尺寸

| size | 高度 | 字号 | 使用场景 |
| --- | --- | --- | --- |
| `large` | 50px，宽度 100% | 16px | 页面底部主操作 |
| `normal`（默认） | 44px | 15px | 常规操作 |
| `small` | 34px | 13px | 卡片内操作 |
| `mini` | 26px | 12px | 列表行内操作 |

## 禁用与加载

`disabled` 会降低不透明度并阻止点击；`loading` 会展示加载图标并阻止重复提交，可通过 `loading-text` 替换文案。

```vue
<x-button disabled>禁用</x-button>
<x-button type="primary" loading loading-text="提交中">提交</x-button>
```

## 图标

`icon` 传入 [图标名称](/components/icon)，`icon-position` 控制图标在文字左侧或右侧。

```vue
<x-button type="primary" icon="plus">新建</x-button>
<x-button icon="share" icon-position="right">分享</x-button>
```

## 自定义颜色

`color` 支持任意 CSS 颜色，也支持渐变；此时边框与背景会被同时设置为该值。

```vue
<x-button type="primary" color="linear-gradient(135deg, #6a5cff, #3b82f6)">渐变按钮</x-button>
```

::: tip 与主题的关系
`color` 属于单点覆盖，不会随主题变化。需要跟随主题的强调色，请优先使用 `type`，或覆盖 `--x-primary`。
:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 按钮类型 | `primary \| success \| warning \| danger \| default` | `default` |
| size | 按钮尺寸 | `large \| normal \| small \| mini` | `normal` |
| plain | 是否为朴素按钮 | `boolean` | `false` |
| block | 是否为块级按钮 | `boolean` | `false` |
| round | 是否为圆角按钮 | `boolean` | `false` |
| square | 是否为直角按钮 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| loading | 是否显示加载状态 | `boolean` | `false` |
| loading-text | 加载时展示的文字 | `string` | - |
| icon | 图标名称 | `string` | - |
| icon-position | 图标位置 | `left \| right` | `left` |
| color | 自定义背景色/渐变 | `string` | - |
| hairline | 使用 0.5px 描边 | `boolean` | `false` |
| native-type | 原生 type 属性 | `button \| submit \| reset` | `button` |
| tag | 渲染的标签 | `string` | `button` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮（禁用/加载中不触发） | `event: MouseEvent` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |

<script setup>
import ButtonBasic from '@demos/button/basic.vue'
import code from '@demos/button/basic.vue?raw'
</script>
