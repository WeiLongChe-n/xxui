# Divider 分割线

用于分隔内容区块，支持文字位置、虚线、细线。

## 基础用法

<DemoBlock title="分割线样式" description="文字可以居中或偏向左右，虚线用于更弱的视觉分割" :code="code">
  <DividerBasic />
</DemoBlock>

## 文字位置

```vue
<vl-divider>文字居中</vl-divider>
<vl-divider content-position="left">左侧文字</vl-divider>
<vl-divider content-position="right">右侧文字</vl-divider>
```

## 虚线

```vue
<vl-divider dashed>虚线分割</vl-divider>
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content-position | 文字位置 | `left \| center \| right` | `center` |
| dashed | 是否为虚线 | `boolean` | `false` |
| hairline | 是否使用 0.5px 细线 | `boolean` | `true` |
| color | 文字颜色 | `string` | - |
| border-color | 线条颜色 | `string` | `--vl-border-color` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 分割线中间的文字 |

<script setup>
import DividerBasic from '@demos/divider/basic.vue'
import code from '@demos/divider/basic.vue?raw'
</script>
