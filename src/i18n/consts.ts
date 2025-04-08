export const paths = {
  '/home' : '/',
  '/about' : '/about',
  '/focus' : '/focus',
  '/science' : '/science',
  '/social' : '/social',
}

export enum Languages {
  es = "Español",
  en = "English",
}

export type LangKey = keyof typeof Languages

export const defaultLang :keyof typeof Languages = 'en'