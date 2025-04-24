import { paths, Languages } from '@/i18n/consts';

export type LangKey = keyof typeof Languages
export type PathKey = keyof typeof paths
export type LanguagesAnchorProps = {available: boolean, path: string, label: Languages, lang:LangKey}