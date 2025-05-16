import { paths, Languages } from '@/i18n/consts';

export type LangKey = keyof typeof Languages
export type PathKey = keyof typeof paths
export type LanguagesAnchorProps = {available: boolean, path: string, label: Languages, lang:LangKey}

export enum Blogs {
  Education = 'Education',
  Social = 'Social',
  Science = 'Science',
}

export enum Langs {
  en = 'en',
  es = 'es',
  pt = 'pt'
}