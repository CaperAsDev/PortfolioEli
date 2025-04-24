import { Languages, defaultLang } from '@/i18n/consts';
import availableRoutes from "@/availableRoutes.js";
import type { LangKey, PathKey, LanguagesAnchorProps } from "@/i18n/types";


export function getLangFromUrl (url : URL)  {
  const pathArray = url.pathname.split('/');
  const langInPath = pathArray.find(e => e in Languages)
  if(langInPath) return langInPath as LangKey

  return defaultLang
}


export function shiftLang (url: URL) : LanguagesAnchorProps[] {
  const {url: path, lang } = parseURL(url);

  const LanguagesArray = Object.entries(Languages) as [LangKey, Languages][];
  const toShiftLangs = LanguagesArray.filter((Languages) => Languages[0] !== lang);

  const linksObj = toShiftLangs.reduce<LanguagesAnchorProps[]>((acc, lang ) => {

    const pathAvailable = isPathAvailable(path, lang[0])

    const link = getLink(path, lang[0])

    const linkObj = {
      available: pathAvailable,
      path: link,
      lang: lang[0],
      label: lang[1]
    }

    acc.push(linkObj)
    return acc
  }, [])

  return linksObj
}

export function isPathAvailable(path: PathKey, lang: LangKey) : boolean {
  const langAvailable = Object.hasOwn(availableRoutes, lang)
  if (!langAvailable) {
    console.warn(`Language ${lang} is not available in availableRoutes`);
    return false;
  }
  const pathAvailableInLang = Object.hasOwn(availableRoutes[lang], path)
  if (!pathAvailableInLang) {
    console.warn(`Path ${path} is not available in availableRoutes for language ${lang}`);
    return false;
  }
  return true
}

export function parseURL(urlObject: URL, pathmane: string= ""): { url: PathKey; lang: LangKey } {
  let pathname = pathmane || urlObject.pathname ;

  if (pathname === '/') return { url: '/home', lang: defaultLang }
  
  const pathSections = pathname.split('/').filter(part => part !== '');

  if (pathSections.length === 1) {
    if(pathSections[0] in Languages) return { url:"/home" , lang: pathSections[0] as LangKey}

    return { url: `/${pathSections[0]}` as PathKey, lang: defaultLang };

  } else if (pathSections.length >= 2) {
    const lang = getLangFromUrl(urlObject)
    
    if(lang === pathSections[0]) {
      const pathWithoutlang = pathSections.filter(part => part !== lang).join('/')
      return { url: `/${pathWithoutlang}` as PathKey, lang };
    }

    return { url: `/${pathname}` as PathKey, lang };

  } else {
    console.warn('Unexpected URL format');
    return { url: '/home', lang: defaultLang };
  }
}

export function getLink(path: PathKey, lang: LangKey) : string {
  let link = null

  if (!isPathAvailable(path, lang)) {
    link = (availableRoutes[defaultLang] as Record<PathKey, string>)[path]
    return link
  }
  link = (availableRoutes[lang] as Record<PathKey, string>)[path]

  return link
}

type MetaData = {
  title: string;
  description: string;
};

type PagesMeta = {
  [url in PathKey]: {
    [lang in LangKey]: MetaData
  };
}

export class MetaManager {
  metaCollection: PagesMeta;

  constructor(PagesMeta: PagesMeta) {
    this.metaCollection = PagesMeta;
  }
  getMetaData({url, lang = defaultLang}: {
    url: PathKey;
    lang?: LangKey;
}): MetaData {
    const urlMeta = this.metaCollection[url];
    if (urlMeta) {
      return urlMeta[lang] || urlMeta[defaultLang];
    } else {
      console.warn(`No metadata found for URL: ${url}`);
      return this.metaCollection['/home'][defaultLang];
    }
  }
}

/* // Ejemplo de uso
const metaManager = new MetaManager(pagesMeta);
const meta = metaManager.getMetaData('/home');
if (meta) {
  console.log(`Title: ${meta.title}`);
  console.log(`Description: ${meta.description}`);
} else {
  console.log('No metadata found.');
}
 */