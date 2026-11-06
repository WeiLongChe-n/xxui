# Icon 图标

图标基于 24×24 的线性 SVG 绘制，使用 `currentColor` 着色，因此可以自动跟随文本颜色与主题。

## 图标列表

<DemoBlock title="内置图标" description="共 40+ 个常用图标，name 即为图标名" :code="code" background="card">
  <IconBasic />
</DemoBlock>

## 基础用法

```vue
<x-icon name="search" />
<x-icon name="like" color="#ef4444" size="24" />
```

## 尺寸与颜色

`size` 支持数字（px）与字符串（如 `"1.4em"`），默认继承父级字号（`1em`）；`color` 支持任意 CSS 颜色。

点下面的色板可直接切换颜色。图标默认跟随父级文字颜色（`currentColor`），所以传入主题变量（如 `var(--x-primary)`）时，切换品牌配色它也会跟着变。

<DemoBlock title="颜色与尺寸" description="点击色板切换颜色；最后一组展示 size 的缩放" :code="colorCode" background="card">
  <IconColor />
</DemoBlock>

```vue
<x-icon name="star" :size="16" />
<x-icon name="star" size="32" color="var(--x-warning)" />
<x-icon name="like" color="#ef4444" />
```

## 旋转

`spin` 会添加匀速旋转动画，适合表示加载中。

```vue
<x-icon name="spinner" spin />
```

## 红点与角标

```vue
<x-icon name="bell" dot />
<x-icon name="comment" :badge="5" />
<x-icon name="cart" :badge="120" />
```

## 自定义图标

三种方式，优先级从高到低：

1. `name` 为网络图片地址（`http(s)://`、`data:`）时渲染为图片；
2. 传入未注册的 `name` 时渲染默认插槽；
3. 直接使用默认插槽放入自定义 SVG。

```vue
<x-icon name="https://example.com/logo.png" size="24" />

<x-icon :size="20">
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="var(--x-primary)" /></svg>
</x-icon>
```

## 图标命名约定

图标使用短横线命名，常用图标：

| 分类 | 图标 |
| --- | --- |
| 方向 | `arrow` `arrow-left` `arrow-right` `arrow-up` `arrow-down` |
| 操作 | `plus` `minus` `close` `check` `search` `clear` `edit` `delete` `share` `filter` `scan` |
| 状态 | `success` `fail` `warning` `info` `question` `spinner` |
| 内容 | `star` `like` `comment` `bell` `photo` `play` `tag` `coupon` `gift` |
| 导航 | `home` `cart` `user` `setting` `location` `clock` `shop` `service` `qr` `lock` |

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 图标名称或图片地址 | `string` | - |
| size | 尺寸 | `string \| number` | 继承字号 |
| color | 颜色 | `string` | `currentColor` |
| spin | 是否旋转 | `boolean` | `false` |
| dot | 是否显示右上角红点 | `boolean` | `false` |
| badge | 角标内容 | `string \| number` | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义图标内容（SVG） |

<script setup>
import IconBasic from '@demos/icon/basic.vue'
import IconColor from '@demos/icon/color.vue'
import code from '@demos/icon/basic.vue?raw'
import colorCode from '@demos/icon/color.vue?raw'
</script>
