# ConfigProvider 全局配置

`ConfigProvider` 通过一个包裹元素把主题属性（`data-theme` / `data-brand`）与自定义 CSS 变量传给内部组件，实现**局部主题**或**统一配置**。

## 基础用法

<DemoBlock title="局部主题" description="同一页面并存深色紫罗兰与品牌红直角两套局部样式" :code="code">
  <ConfigProviderBasic />
</DemoBlock>

## 局部主题

```vue
<vl-config-provider theme="dark" brand="violet">
  <vl-cell-group inset>
    <vl-cell title="订单状态" value="待发货" />
  </vl-cell-group>
</vl-config-provider>
```

由于主题变量通过 CSS 变量继承，内部所有组件都会生效，且不会影响外部——这是实现「亮暗对比预览」「局部强调区」最轻量的方式。

## 覆盖变量

```vue
<vl-config-provider :theme-vars="{ '--vl-primary': '#ff5000', '--vl-radius': '2px' }">
  <vl-button type="primary">品牌红</vl-button>
</vl-config-provider>
```

`theme-vars` 的键必须是 CSS 变量名（以 `--` 开头），值可以是字符串或数字。

## 与全局主题的关系

| 场景 | 建议 |
| --- | --- |
| 全站换肤 | 使用 `setTheme` / `useTheme`（作用于 `html`） |
| 局部试点新主题 | 使用 `ConfigProvider` |
| 单个组件改色 | 直接传组件的 `color` 属性或覆盖局部 CSS 变量 |

## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| theme | 局部明暗模式 | `light \| dark` | 继承全局 |
| brand | 局部品牌配色 | `BrandName` | 继承全局 |
| themeVars | 覆盖 CSS 变量 | `Record<string, string \| number>` | - |
| tag | 渲染的标签 | `string` | `div` |

## Slots

| 名称 | 说明 |
| --- | --- |
| default | 受主题影响的内容 |

<script setup>
import ConfigProviderBasic from '@demos/config-provider/basic.vue'
import code from '@demos/config-provider/basic.vue?raw'
</script>
