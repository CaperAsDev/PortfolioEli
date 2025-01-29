export const enum Languages {
  es = "Español",
  en = "English",
}

const defaultLang :keyof typeof Languages = 'en'

export const languages: {[key: string]: Languages} = {
  es: Languages.es,
  en: Languages.en,
}

const paths = {
  '/home' : '/',
  '/about' : '/about'
}

export function getLangFromUrl (url : URL)  {
  const [, lang] = url.pathname.split('/');
  if(lang in languages) return lang as keyof typeof Languages
  return defaultLang
}

export function shiftLang (url: URL) : { path: string, label: string, lang:keyof typeof Languages}[] {
  const {url: path, lang } = parseURL(url);
  const languagesArray = Object.entries(languages);
  const reminderLangs = languagesArray.filter(
  (languages) => languages[0] !== lang
);
  const linksObj = reminderLangs.reduce<{path: string, label: Languages, lang:keyof typeof Languages}[]>((acc, lang) => {
    const currentLang = lang as  [keyof typeof Languages, Languages]
    const isDefLang = currentLang[0] === defaultLang 
    const currentPath = paths[path as keyof typeof paths]
    const definedPath = isDefLang ? currentPath
    : '/' + currentLang[0] + currentPath
    const linkObj = {
      path: definedPath,
      lang: currentLang[0],
      label: currentLang[1]
    }
    acc.push(linkObj)
    return acc
  }, [])

  return linksObj
}

export function parseURL(urlObject: URL): { url: keyof typeof paths; lang: keyof typeof Languages } {
  let pathname = urlObject.pathname;
  if (pathname === '/') {
    return { url: '/home', lang: defaultLang };
  }

  const parts = pathname.split('/').filter(part => part !== '');
  if (parts.length === 1) {
    if(parts[0] in languages) return { url:"/home" , lang: parts[0] as keyof typeof Languages}
    return { url: `/${parts[0]}` as keyof typeof paths, lang: defaultLang };
  } else if (parts.length === 2) {
    const twoParts = parts as [keyof typeof Languages, string]
    const [lang, page] = twoParts;
    return { url: `/${page}` as keyof typeof paths, lang };
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
  [url in keyof typeof paths]: {
    [lang in keyof typeof Languages]: MetaData
  };
}

export class MetaManager {
  metaCollection: PagesMeta;

  constructor(PagesMeta: PagesMeta) {
    this.metaCollection = PagesMeta;
  }
  getMetaData({url, lang = defaultLang}: {
    url: keyof typeof paths;
    lang?: keyof typeof Languages;
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