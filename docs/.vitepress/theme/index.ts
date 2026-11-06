import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import XXUI from '@xxui/index'
import '@xxui/styles/index.scss'
import './styles/index.css'

import Layout from './Layout.vue'
import DemoBlock from './components/DemoBlock.vue'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(XXUI)
    app.component('DemoBlock', DemoBlock)
  },
} satisfies Theme
