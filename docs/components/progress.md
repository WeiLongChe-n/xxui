# Progress 进度条

用于展示任务进度，支持自定义高度、颜色、条纹动画与进度文字位置。

## 基础用法

<DemoBlock title="进度条形态" description="支持内外两种进度文字、条纹动画与动态更新" :code="code">
  <ProgressBasic />
</DemoBlock>

## 基础配置

```vue
<x-progress :percentage="40" />
<x-progress :percentage="65" color="#16a34a" :stroke-width="8" />
```

`percentage` 会被限制在 `0 ~ 100` 之间，非法值按 0 处理。

## 进度文字

```vue
<x-progress :percentage="30" show-pivot />
<x-progress :percentage="80" show-pivot pivot-position="outside" />
<x-progress :percentage="30" show-pivot pivot-text="3/10" />
```

`outside` 会把文字放到进度条右侧，适合细进度条。

## 条纹动画

```vue
<x-progress :percentage="60" striped animated :stroke-width="8" />
```

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| percentage | 进度百分比 | `number \| string` | `0` |
| strokeWidth | 进度条高度 | `string \| number` | `4` |
| color | 进度条颜色 | `string` | `--x-primary` |
| trackColor | 轨道颜色 | `string` | `--x-background-3` |
| showPivot | 是否显示进度文字 | `boolean` | `false` |
| pivotText | 自定义进度文字 | `string` | `${percentage}%` |
| pivotPosition | 文字位置 | `inside \| outside` | `inside` |
| striped | 是否显示条纹 | `boolean` | `false` |
| animated | 条纹是否流动 | `boolean` | `false` |
| size | 尺寸预设 | `normal \| small` | `normal` |

<script setup>
import ProgressBasic from '@demos/progress/basic.vue'
import code from '@demos/progress/basic.vue?raw'
</script>
