import { createHighlighter, type Highlighter } from 'shiki'

let highlighter: Highlighter | null = null
let loading: Promise<Highlighter> | null = null

const langs = ['vue', 'typescript', 'javascript', 'bash', 'html', 'css', 'json']

export async function getHighlighter() {
  if (highlighter) return highlighter
  if (!loading) {
    loading = createHighlighter({
      themes: ['vitesse-light', 'vitesse-dark'],
      langs,
    })
  }
  highlighter = await loading
  return highlighter
}

export async function highlight(code: string, lang = 'vue', dark = false) {
  const instance = await getHighlighter()
  const supported = langs.includes(lang) ? lang : 'vue'
  return instance.codeToHtml(code.trim(), {
    lang: supported,
    theme: dark ? 'vitesse-dark' : 'vitesse-light',
  })
}
