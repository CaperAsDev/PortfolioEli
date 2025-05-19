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
  //Get the pathname from the URL to manipulate it changing the language

  // Pathname can be "/" for home in english or "/es/education/girls-education" for education post in spanish

  const lang = getLangFromUrl(url)

  // take the languages and exclude the current one
  const toShiftLangs = Object.entries(Languages).filter((Languages) => Languages[0] !== lang) as [LangKey, Languages][];

  // for each language change the current lang inthe path and replace it with the new one, keep in mind the special case of defaultLang

  const linksObj = toShiftLangs.map((langEntry) => {
    let link;
    if (lang === defaultLang) {
      // If the current language is the default language, we need to add the new lang prefix at the beginning
      link = `/${langEntry[0]}${url.pathname}`;
    }else if (langEntry[0] === defaultLang) {
      // If the new language is the default language, we need to remove the current lang prefix from the path
      link = url.pathname.replace(`/${lang}`, '') || '/';
    } else {
      // For all other cases, we just replace the current lang prefix with the new one
      link = url.pathname.replace(`/${lang}`, `/${langEntry[0]}`);
    }

    return {
      available: true,
      path: link,
      lang: langEntry[0],
      label: langEntry[1]
    }
  })

  return linksObj
}

export function isPathAvailable(path: PathKey, lang: LangKey) : boolean {
  const langAvailable = Object.hasOwn(availableRoutes, lang)
  if (!langAvailable) { // Check if the language is available in availableRoutes
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

export function getLink(path: "/home" | "/about", lang: LangKey) : string {
  let link;
  if (lang === defaultLang) {
    // If the current lang is the default language, just add the path "/" for path: "/home" and the path for the rest
    link = path === '/home' ? '/' : path;
  } else {
    // If the current lang is not the default language, add the lang prefix to the path
    // for the path "/home" we need to add the lang prefix and for the rest we need to add the lang prefix and the path
    link = path === '/home' ? `/${lang}` : `/${lang}${path}`;
  }

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