export const paths = {
  '/home' : '/',
  '/about' : '/about',
  '/focus' : '/focus',
  '/science' : '/science',
  '/social' : '/social',
  '/education' : '/education',
  '/books': '/books',
}

export enum Languages {
  es = "Español",
  en = "English",
  pt = "Português",
}

export type LangKey = keyof typeof Languages

export const defaultLang :keyof typeof Languages = 'en'