export type ValidateTrigger = 'change' | 'blur' | 'submit'

export interface FieldRule {
  /** 是否必填 */
  required?: boolean
  /** 错误提示文案，支持 {label} 占位 */
  message?: string
  /** 正则校验 */
  pattern?: RegExp
  /** 最小长度 / 数值 */
  min?: number
  /** 最大长度 / 数值 */
  max?: number
  /** 内置格式校验 */
  type?: 'email' | 'phone' | 'number' | 'url'
  /** 自定义校验，返回 true / undefined 表示通过，返回字符串表示错误信息 */
  validator?: (value: unknown, rule: FieldRule) => boolean | string | undefined | Promise<boolean | string | undefined>
  /** 触发时机 */
  trigger?: ValidateTrigger | ValidateTrigger[]
  /** 校验时使用的字段名，默认取 label */
  label?: string
}

export const formatMessage = (rule: FieldRule, label?: string) => {
  const name = rule.label || label || '该项'
  if (rule.message) return rule.message.replace('{label}', name)
  if (rule.required) return `请填写${name}`
  if (rule.type === 'email') return '邮箱格式不正确'
  if (rule.type === 'phone') return '手机号格式不正确'
  if (rule.type === 'number') return '请输入数字'
  if (rule.type === 'url') return '链接格式不正确'
  if (rule.min !== undefined) return `${name}不能少于 ${rule.min}`
  if (rule.max !== undefined) return `${name}不能多于 ${rule.max}`
  return `${name}格式不正确`
}

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

const patterns: Record<string, RegExp> = {
  email: /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
  phone: /^1[3-9]\d{9}$/,
  number: /^-?\d+(\.\d+)?$/,
  url: /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/,
}

/** 执行一组规则，返回错误信息（无错误返回空字符串） */
export async function runRules(
  value: unknown,
  rules: FieldRule[] = [],
  label?: string,
): Promise<string> {
  for (const rule of rules) {
    if (rule.required && isEmpty(value)) {
      return formatMessage(rule, label)
    }
    if (isEmpty(value)) continue

    if (rule.type && patterns[rule.type] && !patterns[rule.type].test(String(value))) {
      return formatMessage(rule, label)
    }
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return formatMessage(rule, label)
    }
    const length = Array.isArray(value) ? value.length : String(value).length
    if (rule.min !== undefined && length < rule.min) {
      return formatMessage(rule, label)
    }
    if (rule.max !== undefined && length > rule.max) {
      return formatMessage(rule, label)
    }
    if (rule.validator) {
      const result = await rule.validator(value, rule)
      if (typeof result === 'string') return result
      if (result === false) return formatMessage(rule, label)
    }
  }
  return ''
}

/** 按路径读取对象值，支持 a.b.c */
export function getValueByPath(target: Record<string, any> | undefined, path?: string) {
  if (!target || !path) return undefined
  return path.split('.').reduce<any>((acc, key) => (acc == null ? undefined : acc[key]), target)
}
