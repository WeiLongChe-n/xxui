# Loading 加载

加载指示器，包含圆环、旋转线条、跳点三种风格，可用于按钮、列表、全屏加载等场景。

## 基础用法

<DemoBlock title="加载样式" description="三种风格覆盖不同场景：圆环通用、线条轻量、跳点更活泼" :code="code">
  <LoadingBasic />
</DemoBlock>

## 三种类型

```vue
<vl-loading />                     <!-- 圆环 -->
<vl-loading type="spinner" />      <!-- 旋转线条 -->
<vl-loading type="dots" />         <!-- 跳点 -->
```

## 尺寸与颜色

`size` 同时作用于图标与文字（默认继承字号），`color` 使用 `currentColor` 机制作用于整个组件。

```vue
<vl-loading size="14" />
<vl-loading size="32" color="#16a34a" />
```

## 带文字

```vue
<vl-loading text="加载中..." />
<vl-loading vertical text="向上排列" />
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 加载类型 | `circular \| spinner \| dots` | `circular` |
| size | 尺寸 | `string \| number` | 继承字号（20px） |
| color | 颜色 | `string` | `--vl-primary` |
| text | 文字 | `string` | - |
| textSize | 文字字号 | `string \| number` | - |
| vertical | 文字是否在下方 | `boolean` | `false` |

<script setup>
import LoadingBasic from '@demos/loading/basic.vue'
import code from '@demos/loading/basic.vue?raw'
</script>
