import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import VelaUI from '@vela/index'
import '@vela/styles/index.scss'
import './styles/index.css'

import Layout from './Layout.vue'
import DemoBlock from './components/DemoBlock.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(VelaUI)
    app.component('DemoBlock', DemoBlock)
  },
} satisfies Theme
