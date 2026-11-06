# Skeleton 骨架屏

骨架屏在内容加载前占位，避免页面跳动，比单纯的 Loading 更接近最终布局。

## 基础用法

<DemoBlock title="骨架屏" description="切换开关观察骨架屏与真实内容的过渡" :code="code">
  <SkeletonBasic />
</DemoBlock>

## 用法

```vue
<vl-skeleton :loading="loading" :rows="3" animated>
  <vl-cell-group inset>
    <vl-cell title="真实内容" value="加载完成后展示" />
  </vl-cell-group>
</vl-skeleton>
```

`loading` 为 `false` 时渲染默认插槽的内容；为 `true` 时渲染骨架。

## 头像与行宽

```vue
<vl-skeleton avatar :rows="2" />
<vl-skeleton :row-width="['100%', '80%', '60%']" />
<vl-skeleton avatar avatar-shape="square" :avatar-size="56" round />
```

`row-width` 既可以是单值，也可以是数组（按行循环取值）。

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| loading | 是否显示骨架 | `boolean` | `true` |
| rows | 段落行数 | `number` | `3` |
| rowWidth | 行宽 | `string \| number \| array` | `100%` |
| avatar | 是否显示头像占位 | `boolean` | `false` |
| avatarSize | 头像尺寸 | `string \| number` | `48` |
| avatarShape | 头像形状 | `round \| square` | `round` |
| title | 是否显示标题占位 | `boolean` | `true` |
| titleWidth | 标题宽度 | `string \| number` | `40%` |
| animated | 是否显示扫光动画 | `boolean` | `false` |
| round | 占位块是否为圆角 | `boolean` | `false` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 加载完成后展示的内容 |

<script setup>
import SkeletonBasic from '@demos/skeleton/basic.vue'
import code from '@demos/skeleton/basic.vue?raw'
</script>
