import type { App } from 'vue'
import './styles/index.scss'

import XButton from './components/button/Button.vue'
import XIcon from './components/icon/Icon.vue'
import XCell from './components/cell/Cell.vue'
import XCellGroup from './components/cell/CellGroup.vue'
import XBadge from './components/badge/Badge.vue'
import XTag from './components/tag/Tag.vue'
import XDivider from './components/divider/Divider.vue'
import XConfigProvider from './components/config-provider/ConfigProvider.vue'
import XLoading from './components/loading/Loading.vue'
import XOverlay from './components/overlay/Overlay.vue'
import XPopup from './components/popup/Popup.vue'
import XToast from './components/toast/Toast.vue'
import XDialog from './components/dialog/Dialog.vue'
import XActionSheet from './components/action-sheet/ActionSheet.vue'
import XNavBar from './components/nav-bar/NavBar.vue'
import XTabbar from './components/tabbar/Tabbar.vue'
import XTabbarItem from './components/tabbar/TabbarItem.vue'
import XTabs from './components/tabs/Tabs.vue'
import XTab from './components/tabs/Tab.vue'
import XField from './components/field/Field.vue'
import XForm from './components/form/Form.vue'
import XFormItem from './components/form/FormItem.vue'
import XSwitch from './components/switch/Switch.vue'
import XCheckbox from './components/checkbox/Checkbox.vue'
import XCheckboxGroup from './components/checkbox/CheckboxGroup.vue'
import XRadio from './components/radio/Radio.vue'
import XRadioGroup from './components/radio/RadioGroup.vue'
import XStepper from './components/stepper/Stepper.vue'
import XSlider from './components/slider/Slider.vue'
import XRate from './components/rate/Rate.vue'
import XSearch from './components/search/Search.vue'
import XProgress from './components/progress/Progress.vue'
import XSkeleton from './components/skeleton/Skeleton.vue'
import XEmpty from './components/empty/Empty.vue'
import XNoticeBar from './components/notice-bar/NoticeBar.vue'
import XCollapse from './components/collapse/Collapse.vue'
import XCollapseItem from './components/collapse/CollapseItem.vue'
import XSteps from './components/steps/Steps.vue'
import XStep from './components/steps/Step.vue'
import XSticky from './components/sticky/Sticky.vue'
import XSwipe from './components/swipe/Swipe.vue'
import XSwipeItem from './components/swipe/SwipeItem.vue'
import XList from './components/list/List.vue'
import XPullRefresh from './components/pull-refresh/PullRefresh.vue'
import XGrid from './components/grid/Grid.vue'
import XGridItem from './components/grid/GridItem.vue'
import XRow from './components/row/Row.vue'
import XCol from './components/row/Col.vue'
import XTree from './components/tree/Tree.vue'
import XPicker from './components/picker/Picker.vue'
import XArea from './components/area/Area.vue'
import XCascader from './components/cascader/Cascader.vue'
import XDropdownMenu from './components/dropdown-menu/DropdownMenu.vue'
import XDropdownItem from './components/dropdown-menu/DropdownItem.vue'
import XImagePreview from './components/image-preview/ImagePreview.vue'

import { Toast } from './components/toast/toast'
import { ImagePreview } from './components/image-preview/image-preview'
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
export type { TreeNode, TreeKey } from './components/tree/types'
export type { TeleportTarget } from './utils/teleport'
export type { PickerOption, PickerValue, PickerConfirmPayload } from './components/picker/types'
export type { AreaOption, AreaValue } from './components/area/types'
export type { DropdownOption, DropdownValue } from './components/dropdown-menu/types'
export type {
  ImageSource,
  ImagePreviewItem,
  ImagePreviewOptions,
  ImagePreviewInstance,
} from './components/image-preview/types'
export { setDefaultTeleportTarget } from './utils/teleport'
export { areaData } from './components/area/area-data'
export { getAreaText } from './components/area/utils'
export { ImagePreview }

export const components = [
  XButton,
  XIcon,
  XCell,
  XCellGroup,
  XBadge,
  XTag,
  XDivider,
  XConfigProvider,
  XLoading,
  XOverlay,
  XPopup,
  XToast,
  XDialog,
  XActionSheet,
  XNavBar,
  XTabbar,
  XTabbarItem,
  XTabs,
  XTab,
  XField,
  XForm,
  XFormItem,
  XSwitch,
  XCheckbox,
  XCheckboxGroup,
  XRadio,
  XRadioGroup,
  XStepper,
  XSlider,
  XRate,
  XSearch,
  XProgress,
  XSkeleton,
  XEmpty,
  XNoticeBar,
  XCollapse,
  XCollapseItem,
  XSteps,
  XStep,
  XSticky,
  XSwipe,
  XSwipeItem,
  XList,
  XPullRefresh,
  XGrid,
  XGridItem,
  XRow,
  XCol,
  XTree,
  XPicker,
  XArea,
  XCascader,
  XDropdownMenu,
  XDropdownItem,
  XImagePreview,
]

export {
  XButton,
  XIcon,
  XCell,
  XCellGroup,
  XBadge,
  XTag,
  XDivider,
  XConfigProvider,
  XLoading,
  XOverlay,
  XPopup,
  XToast,
  XDialog,
  XActionSheet,
  XNavBar,
  XTabbar,
  XTabbarItem,
  XTabs,
  XTab,
  XField,
  XForm,
  XFormItem,
  XSwitch,
  XCheckbox,
  XCheckboxGroup,
  XRadio,
  XRadioGroup,
  XStepper,
  XSlider,
  XRate,
  XSearch,
  XProgress,
  XSkeleton,
  XEmpty,
  XNoticeBar,
  XCollapse,
  XCollapseItem,
  XSteps,
  XStep,
  XSticky,
  XSwipe,
  XSwipeItem,
  XList,
  XPullRefresh,
  XGrid,
  XGridItem,
  XRow,
  XCol,
  XTree,
  XPicker,
  XArea,
  XCascader,
  XDropdownMenu,
  XDropdownItem,
  XImagePreview,
}

export const version = '0.3.3'

const install = (app: App, options: { theme?: ThemeMode; brand?: BrandName } = {}) => {
  components.forEach((component) => {
    const name = (component as { name?: string }).name
    if (name) app.component(name, component)
  })
  initTheme({ defaultTheme: { mode: options.theme, brand: options.brand } })
}

export const XXUI = { install, version }

export default XXUI
