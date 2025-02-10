import { paths, Languages, defaultLang } from "./consts";
import availableRoutes from "@/availableRoutes.js";

type LangKey = keyof typeof Languages
type PathKey = keyof typeof paths
export type LanguagesAnchorProps = {available: boolean, path: string, label: Languages, lang:LangKey}

export function getLangFromUrl (url : URL)  {
  const pathArray = url.pathname.split('/');
  const langInPath = pathArray.find(e => e in Languages)
  if(langInPath) return langInPath as LangKey

  return defaultLang
}


export function shiftLang (url: URL) : LanguagesAnchorProps[] {
  const {url: path, lang } = parseURL(url);

  const LanguagesArray = Object.entries(Languages) as [LangKey, Languages][];
  const reminderLangs = LanguagesArray.filter((Languages) => Languages[0] !== lang);

  const linksObj = reminderLangs.reduce<LanguagesAnchorProps[]>((acc, lang ) => {

    const isAvailable = Boolean(availableRoutes[lang[0]][path])
    const link = isAvailable ? availableRoutes[lang[0]][path] : '/'

    const linkObj = {
      available: isAvailable,
      path: link,
      lang: lang[0],
      label: lang[1]
    }
    acc.push(linkObj)
    return acc
  }, [])

  return linksObj
}

export function parseURL(urlObject: URL): { url: PathKey; lang: LangKey } {
  let pathname = urlObject.pathname;

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