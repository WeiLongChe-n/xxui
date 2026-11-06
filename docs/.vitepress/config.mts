import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

const libRoot = fileURLToPath(new URL('../../packages/mobile-ui/src', import.meta.url))

/**
 * 部署到纯静态托管（Gitee Pages / GitHub Pages 等）时的路径处理：
 *
 *   DOCS_BASE=/vela-ui/   → 项目型仓库，站点地址 https://<user>.gitee.io/vela-ui/
 *   DOCS_BASE=/            → 个人站点仓库（<user>.gitee.io），站点在根路径
 *   不设置                  → 本地开发，base 为 /，链接使用干净的目录形式
 *
 * DOCS_STATIC=1 表示「产物要放到纯静态托管」：即使 base 是根路径，也要关闭 cleanUrls。
 *
 * 静态托管还要求关闭 cleanUrls：Gitee Pages 不做 URL 重写，
 * 访问 /guide/theme 不会自动映射到 guide/theme.html，因此链接必须带 .html。
 */
const rawBase = process.env.DOCS_BASE ?? ''
const isStaticDeploy = rawBase !== '' || process.env.DOCS_STATIC === '1'

const base = (() => {
  if (!isStaticDeploy) return '/'
  const trimmed = rawBase.replace(/^\/+|\/+$/g, '')
  return trimmed ? `/${trimmed}/` : '/'
})()

export default defineConfig({
  lang: 'zh-CN',
  title: 'XXUI',
  description: '轻量、可定制的 Vue 3 移动端组件库，内置多套主题与暗色模式',
  base,
  cleanUrls: !isStaticDeploy,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover' }],
    ['link', { rel: 'icon', href: `${base}favicon.svg`, type: 'image/svg+xml' }],
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: { api: 'modern-compiler' },
      },
    },
    resolve: {
      alias: {
        'xxui-mobile': `${libRoot}/index.ts`,
        '@xxui': libRoot,
        '@demos': fileURLToPath(new URL('../demos', import.meta.url)),
      },
    },
    server: {
      fs: {
        allow: [fileURLToPath(new URL('../..', import.meta.url))],
      },
      watch: {
        // 产物目录不参与监听：Windows 上被监听的目录无法重命名，
        // 会导致「开发服务器开着时执行构建」失败
        ignored: ['**/dist/**', '**/.old-dist/**', '**/.temp/**'],
      },
    },
  },
  markdown: {
    image: { lazyLoading: true },
  },
  themeConfig: {
    logo: '/logo.svg',
    outline: { level: [2, 3], label: '本页目录' },
    nav: [
      { text: '指南', link: '/guide/introduction', activeMatch: '/guide/' },
      { text: '组件', link: '/components/button', activeMatch: '/components/' },
      { text: '主题', link: '/guide/theme' },
      {
        text: 'v0.3.1',
        items: [
          { text: '更新日志', link: '/guide/changelog' },
          { text: '常见问题', link: '/guide/faq' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速上手', link: '/guide/getting-started' },
            { text: '按需引入', link: '/guide/on-demand' },
          ],
        },
        {
          text: '定制',
          items: [
            { text: '主题定制', link: '/guide/theme' },
            { text: '暗色模式', link: '/guide/dark-mode' },
            { text: '国际化与适配', link: '/guide/adaptation' },
          ],
        },
        {
          text: '其他',
          items: [
            { text: '常见问题', link: '/guide/faq' },
            { text: '更新日志', link: '/guide/changelog' },
          ],
        },
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
            { text: 'Cell 单元格', link: '/components/cell' },
            { text: 'Row 栅格布局', link: '/components/row' },
            { text: 'Grid 宫格', link: '/components/grid' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Badge 徽标', link: '/components/badge' },
            { text: 'Tag 标签', link: '/components/tag' },
          ],
        },
        {
          text: '表单组件',
          items: [
            { text: 'Field 输入框', link: '/components/field' },
            { text: 'Form 表单', link: '/components/form' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Stepper 步进器', link: '/components/stepper' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'Search 搜索', link: '/components/search' },
            { text: 'Picker 滚轮选择', link: '/components/picker' },
            { text: 'Area 省市区', link: '/components/area' },
            { text: 'Cascader 级联选择', link: '/components/cascader' },
          ],
        },
        {
          text: '反馈组件',
          items: [
            { text: 'Toast 轻提示', link: '/components/toast' },
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'ActionSheet 动作面板', link: '/components/action-sheet' },
            { text: 'Popup 弹出层', link: '/components/popup' },
            { text: 'Loading 加载', link: '/components/loading' },
            { text: 'Overlay 遮罩层', link: '/components/overlay' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'NoticeBar 通知栏', link: '/components/notice-bar' },
          ],
        },
        {
          text: '导航组件',
          items: [
            { text: 'NavBar 导航栏', link: '/components/nav-bar' },
            { text: 'Tabbar 标签栏', link: '/components/tabbar' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'DropdownMenu 下拉筛选', link: '/components/dropdown-menu' },
          ],
        },
        {
          text: '展示组件',
          items: [
            { text: 'Tree 树形选择', link: '/components/tree' },
            { text: 'ImagePreview 图片预览', link: '/components/image-preview' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Swipe 轮播', link: '/components/swipe' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Sticky 粘性布局', link: '/components/sticky' },
            { text: 'List 列表', link: '/components/list' },
            { text: 'PullRefresh 下拉刷新', link: '/components/pull-refresh' },
            { text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/' }],
    search: { provider: 'local' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    lastUpdatedText: '最后更新',
    footer: {
      message: '基于 MIT 协议发布 · 使用 Vue 3 + TypeScript 构建',
      copyright: '© 2026 XXUI',
    },
  },
})
