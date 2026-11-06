# 更新日志

## v0.3.0

`2026-11-06`

文档站的交互演示改为「右侧单一预览盒」，同时让弹层组件可以被宿主指定挂载目标。

### 文档站

- **统一预览盒**：组件页左侧只保留说明与代码，整页所有示例共用右侧一个手机预览，滚动联动 + 点击卡片切换，不再出现一长串重复的设备外壳
- 卡片会标记「预览中 / 查看」状态，当前示例有高亮边框；切换示例时保留各自的交互状态
- 窄于 `1280px` 时自动回落到卡片内嵌手机框，交互能力不变
- 宽屏下页面目录（outline）让位给预览盒

### 组件库

- 新增 `setDefaultTeleportTarget()`：改写弹层默认挂载目标，沙箱预览、微前端等场景可把弹层限制在容器内
- `ConfigProvider` 新增 `teleport` 属性，可对子树内的 Popup / Toast / Dialog / ImagePreview 统一指定挂载目标
- `Popup`、`Toast`、`ImagePreview` 的 `teleport` 默认值由固定 `body` 改为跟随上下文，未设置时行为不变
- `lockScroll` 改为锁定挂载目标所在文档，弹层在 iframe 内时不会锁住宿主页面滚动
- 命令式组件（`Dialog`、`Toast`、`ImagePreview`）支持容器被移除后重新挂回

## v0.2.0

`2026-11-06`

新增 8 个组件，补齐多列布局、树形选择、选择器与图片预览场景。

### 组件

- **布局**：Row / Col 24 栅格，支持 gutter、offset、order、justify / align 与嵌套
- **展示**：Tree 树形选择（单选 / 多选、父子联动、半选、手风琴）、ImagePreview 图片预览（命令式 + 组件式）
- **选择**：Picker 滚轮选择（单列 / 多列 / 级联）、Area 省市区三级联动（内置 34 个省级行政区、3806 个节点）、Cascader 级联选择（单选 / 多选、面包屑回退）
- **导航**：DropdownMenu / DropdownItem 下拉筛选（单选、多选、自定义面板）

### 优化

- 组件内部与文档站的滚动容器统一隐藏竖向滚动条，保留滚动与手势能力
- 文档站新增 7 篇组件文档与 16 个可交互示例

### 尺寸

- ES 306.5 kB（gzip 65.9 kB），CSS 51.6 kB（gzip 9.0 kB）
- 内置省市区数据约 137 kB，未使用 Area 时可被 tree-shaking 移除

## v0.1.0

`2026-11-05`

首个可用版本，包含组件库骨架、主题系统与文档站。

### 组件

- **基础**：Button、Icon（40+ 内置图标）、Cell、CellGroup、Grid、GridItem、Divider、Badge、Tag
- **表单**：Field、Form、FormItem、Switch、Checkbox、CheckboxGroup、Radio、RadioGroup、Stepper、Slider、Rate、Search
- **反馈**：Toast、Dialog、ActionSheet、Popup、Loading、Overlay、Skeleton、Progress、NoticeBar
- **导航**：NavBar、Tabbar、TabbarItem、Tabs、Tab、Steps、Step
- **展示**：Collapse、CollapseItem、Swipe、SwipeItem、Empty、Sticky、List、PullRefresh、ConfigProvider

### 主题

- 全新主题模型：明暗模式 × 品牌配色，共 12 种预设组合
- 引入色相令牌 `--vl-hue`，一套规则推导主色所有状态
- 主题运行时 API：`setTheme` / `setMode` / `setBrand` / `toggleMode` / `resetTheme` / `useTheme`
- 支持 `localStorage` 持久化与 `auto` 跟随系统
- `ConfigProvider` 支持局部主题与 CSS 变量覆盖

### 工程

- 基于 Vite 的库构建（ES + UMD + 类型声明）
- 完整 TypeScript 类型
- VitePress 文档站，支持实时代码演示、主题切换与全文搜索
- 组件演示运行在 iframe 沙箱内，样式与文档站彻底隔离；预览工具条可单独换肤、切明暗、重置与全屏
- 明确环境要求：Node.js `>= 18`（推荐 20 / 22 LTS）、npm `>= 9`、Vue `>= 3.3`；`package.json` 声明 `engines`，仓库根目录提供 `.nvmrc`
- 开发验证环境：Node.js v22.22.2 / npm 10.9.7 / Vue 3.5.44 / Vite 6.4.5 / VitePress 1.6.4 / TypeScript 5.9.3 / Sass 1.107.1

### 已知问题

- 按需引入目前只作用于 JS，CSS 仍为一次性引入
- 未内置 RTL 布局支持
- Tabs 在隐藏容器中首次渲染时下划线位置需要手动触发重算

## 后续计划

- 新增 DatePicker、Upload、CountDown、Signature 等组件
- CSS 按组件拆分，支持真正的样式按需
- 补充 Playwright 视觉回归测试
- 提供暗色模式下的插图资源包
