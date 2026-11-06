import type { AreaOption, AreaValue } from './types'

/** 根据 value 数组拼出可读的地区文本，如「浙江省 杭州市 西湖区」 */
export function getAreaText(values: AreaValue[] = [], data: AreaOption[] = []): string {
  const texts: string[] = []
  let current: AreaOption[] | undefined = data

  for (const value of values) {
    const found: AreaOption | undefined = current?.find((option) => option.value === value)
    if (!found) break
    texts.push(found.text)
    current = found.children
  }

  return texts.join(' ')
}
