# 更新日志

## v0.3.5

`2026-11-09`

修复一批组件与文档站问题（含 `0.3.1` ~ `0.3.4` 期间已发布但未记录的改动），并补齐发布与开发文档。

### 组件修复

- **Badge**：独立徽标（不包裹元素时）被 `.x-badge__wrap` 的绝对定位命中，容器宽度塌成 0，多个徽标会叠在同一个点上
- **Tabs**：角标改为相对标题文字右上角定位，不再用 `margin-left` 跟在文字后面
- **Picker**：补上 PC 端滚轮支持，鼠标 / 触控板可切换选项，带冷却与累积阈值，不会一次滚过好几项
- **ImagePreview**：触摸事件改为 Pointer Events，桌面端可拖拽；新增左右箭头与方向键，`Esc` 关闭；拖拽结束不再误触关闭
- **Swipe**：新增 `indicatorActiveColor` 与 `--x-swipe-indicator-*` CSS 变量，并开放 `indicator` 插槽完全自定义
- **Grid**：列宽改为 `minmax(0, 1fr)`，格子文字较长时不再把列撑破导致横向溢出；文字超长改为省略

### 文档站

- 每张示例卡片里的「交互演示在右侧预览框中」提示改为**页面级一次性引导**，卡片不再留一块空占位
- 修复焦点进入右侧预览沙箱后 `Ctrl+K` 失效：把搜索热键从 iframe 转发回宿主页面
- 修复中文输入法下 `Ctrl+K` 失效：改看物理键位 `event.code`，不再依赖 `event.key`
- 修复演示的 `<style scoped>` 使用 CSS 嵌套时样式进不了沙箱（表现为 ImagePreview 的图片网格横向溢出）
- 补齐 `favicon.ico`，消除控制台的 404
- README 拆分：发布流程并入 `RELEASING.md`，开发辅助脚本独立到 `DEVELOPMENT.md`

## v0.3.0

`2026-11-06`

文档站的交互演示改为「右侧单一预览盒」，同时让弹层组件可以被宿主指定挂载目标。

### 命名

- 包名改为 `xxui-mobile`，内部标识同步统一为 `x`：CSS 类名 `x-button`、CSS 变量 `--x-primary`、组件名 `XButton`，全局安装导出 `XXUI`
- 主题持久化 key 改为 `xxui-theme`；构建产物为 `xxui.mjs` / `xxui.umd.js` / `xxui.css`

### 文档站

- **统一预览盒**：组件页左侧只保留说明与代码，整页所有示例共用右侧一个手机预览，滚动联动 + 点击卡片切换，不再出现一长串重复的设备外壳
- **组件导航**：盒子顶部新增 navbar，`←` 返回上一个组件，组件名下拉列出全部组件（按分组），`1/4` 下拉切换本页示例；手机铺满盒子剩余高度
- **框架比例**：侧栏收窄至 240px、正文加宽、留白更舒展，确立 xxui 文档自身的版式比例
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
- 引入色相令牌 `--x-hue`，一套规则推导主色所有状态
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
