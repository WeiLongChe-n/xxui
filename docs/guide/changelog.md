# 更新日志

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

- 新增 Picker、DatePicker、Upload、Image、CountDown 等组件
- CSS 按组件拆分，支持真正的样式按需
- 补充 Playwright 视觉回归测试
- 提供暗色模式下的插图资源包
