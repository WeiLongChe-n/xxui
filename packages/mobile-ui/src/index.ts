import type { App } from 'vue'
import './styles/index.scss'

import VlButton from './components/button/Button.vue'
import VlIcon from './components/icon/Icon.vue'
import VlCell from './components/cell/Cell.vue'
import VlCellGroup from './components/cell/CellGroup.vue'
import VlBadge from './components/badge/Badge.vue'
import VlTag from './components/tag/Tag.vue'
import VlDivider from './components/divider/Divider.vue'
import VlConfigProvider from './components/config-provider/ConfigProvider.vue'
import VlLoading from './components/loading/Loading.vue'
import VlOverlay from './components/overlay/Overlay.vue'
import VlPopup from './components/popup/Popup.vue'
import VlToast from './components/toast/Toast.vue'
import VlDialog from './components/dialog/Dialog.vue'
import VlActionSheet from './components/action-sheet/ActionSheet.vue'
import VlNavBar from './components/nav-bar/NavBar.vue'
import VlTabbar from './components/tabbar/Tabbar.vue'
import VlTabbarItem from './components/tabbar/TabbarItem.vue'
import VlTabs from './components/tabs/Tabs.vue'
import VlTab from './components/tabs/Tab.vue'
import VlField from './components/field/Field.vue'
import VlForm from './components/form/Form.vue'
import VlFormItem from './components/form/FormItem.vue'
import VlSwitch from './components/switch/Switch.vue'
import VlCheckbox from './components/checkbox/Checkbox.vue'
import VlCheckboxGroup from './components/checkbox/CheckboxGroup.vue'
import VlRadio from './components/radio/Radio.vue'
import VlRadioGroup from './components/radio/RadioGroup.vue'
import VlStepper from './components/stepper/Stepper.vue'
import VlSlider from './components/slider/Slider.vue'
import VlRate from './components/rate/Rate.vue'
import VlSearch from './components/search/Search.vue'
import VlProgress from './components/progress/Progress.vue'
import VlSkeleton from './components/skeleton/Skeleton.vue'
import VlEmpty from './components/empty/Empty.vue'
import VlNoticeBar from './components/notice-bar/NoticeBar.vue'
import VlCollapse from './components/collapse/Collapse.vue'
import VlCollapseItem from './components/collapse/CollapseItem.vue'
import VlSteps from './components/steps/Steps.vue'
import VlStep from './components/steps/Step.vue'
import VlSticky from './components/sticky/Sticky.vue'
import VlSwipe from './components/swipe/Swipe.vue'
import VlSwipeItem from './components/swipe/SwipeItem.vue'
import VlList from './components/list/List.vue'
import VlPullRefresh from './components/pull-refresh/PullRefresh.vue'
import VlGrid from './components/grid/Grid.vue'
import VlGridItem from './components/grid/GridItem.vue'

import { Toast } from './components/toast/toast'
import { Dialog } from './components/dialog/dialog'
import {
  initTheme,
  useTheme,
  setTheme,
  setMode,
  setBrand,
  toggleMode,
  resetTheme,
  isDark,
  resolvedMode,
  brandOptions,
  themeModes,
  THEME_STORAGE_KEY,
} from './theme'

export {
  Toast,
  Dialog,
  initTheme,
  useTheme,
  setTheme,
  setMode,
  setBrand,
  toggleMode,
  resetTheme,
  isDark,
  resolvedMode,
  brandOptions,
  themeModes,
  THEME_STORAGE_KEY,
}

export { iconPaths } from './components/icon/icons'
export type { ThemeConfig, ThemeMode, BrandName } from './theme'
import type { BrandName, ThemeMode } from './theme'
export type { FieldRule, ValidateTrigger } from './components/form/types'
export type { ActionSheetAction } from './components/action-sheet/types'
export type { DialogOptions } from './components/dialog/dialog'
export type { ToastOptions } from './components/toast/toast'

export const components = [
  VlButton,
  VlIcon,
  VlCell,
  VlCellGroup,
  VlBadge,
  VlTag,
  VlDivider,
  VlConfigProvider,
  VlLoading,
  VlOverlay,
  VlPopup,
  VlToast,
  VlDialog,
  VlActionSheet,
  VlNavBar,
  VlTabbar,
  VlTabbarItem,
  VlTabs,
  VlTab,
  VlField,
  VlForm,
  VlFormItem,
  VlSwitch,
  VlCheckbox,
  VlCheckboxGroup,
  VlRadio,
  VlRadioGroup,
  VlStepper,
  VlSlider,
  VlRate,
  VlSearch,
  VlProgress,
  VlSkeleton,
  VlEmpty,
  VlNoticeBar,
  VlCollapse,
  VlCollapseItem,
  VlSteps,
  VlStep,
  VlSticky,
  VlSwipe,
  VlSwipeItem,
  VlList,
  VlPullRefresh,
  VlGrid,
  VlGridItem,
]

export {
  VlButton,
  VlIcon,
  VlCell,
  VlCellGroup,
  VlBadge,
  VlTag,
  VlDivider,
  VlConfigProvider,
  VlLoading,
  VlOverlay,
  VlPopup,
  VlToast,
  VlDialog,
  VlActionSheet,
  VlNavBar,
  VlTabbar,
  VlTabbarItem,
  VlTabs,
  VlTab,
  VlField,
  VlForm,
  VlFormItem,
  VlSwitch,
  VlCheckbox,
  VlCheckboxGroup,
  VlRadio,
  VlRadioGroup,
  VlStepper,
  VlSlider,
  VlRate,
  VlSearch,
  VlProgress,
  VlSkeleton,
  VlEmpty,
  VlNoticeBar,
  VlCollapse,
  VlCollapseItem,
  VlSteps,
  VlStep,
  VlSticky,
  VlSwipe,
  VlSwipeItem,
  VlList,
  VlPullRefresh,
  VlGrid,
  VlGridItem,
}

export const version = '0.1.0'

const install = (app: App, options: { theme?: ThemeMode; brand?: BrandName } = {}) => {
  components.forEach((component) => {
    const name = (component as { name?: string }).name
    if (name) app.component(name, component)
  })
  initTheme({ defaultTheme: { mode: options.theme, brand: options.brand } })
}

export const VelaUI = { install, version }

export default VelaUI
