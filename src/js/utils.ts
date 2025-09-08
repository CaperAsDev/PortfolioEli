import type { MarkdownFile } from '@/types';
import { Languages, defaultLang } from '@/i18n/consts';
import { blogsNames } from '@/i18n/ui';
import { getLangFromUrl } from '@/i18n/utils';

export const getBreadcrumbs = ({ url, postTitle }: { url: URL, postTitle: string }) => {
  const homeLabel = {
  en: "Home",
  es: "Inicio",
  pt: "Início",
};
  //split the path by /
  const paths = url.pathname.split("/").filter((p) => p !== "");

  //if the lang is in the path, its not the defautl lang
  const isLangInPath = paths.find((e) => e in Languages);

  //if the lang is in the path we can build the breadcrumb with a map
  // create an array of objets with a label and a path that always starts with /

  //if the lang is not in the path, we can assume its the default lang and add it to the path
  isLangInPath || paths.unshift(defaultLang);

  const breadcrumbs = paths.map((path, i) => {
    let link = `/${path}`;
    let label;
    let index = i + 1;

    if (path in Languages) {
      label = homeLabel[path as keyof typeof homeLabel];
    } else if (path in blogsNames) {
      //capitalize the first letter of the path
      label = blogsNames[path as keyof typeof blogsNames][getLangFromUrl(url)];
    } else {
      //if the path is not a lang or a blog, we can assume its a blog name with the format of blog-name
      //split the path by - and capitalize the first letter of each word
      label = postTitle;
      /*label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
        */
    }

    return {
      label,
      link,
      index,
    };
  });

  return breadcrumbs;
};

export const selectImage = ({title, images}: {title:string, images: [string, {
    default: ImageMetadata;
}][] }) : ImageMetadata => {
  // espera una entrada en images obtenida por un codigo como el siguiente: 
  /*
  Object.entries(
  import.meta.glob<{ default: ImageMetadata }>(
    "@/assets/images/Thumbnails/*.{jpg,jpeg,png}",
    {
      eager: true,
    }
  )
);
  */
  const image = images.filter(imgData => {
    //dividimos el path de la imagen que usualmente llega como '/src/assets/images/blogs/heroes/books.jpeg' y seleccionamos la ultima seccion que es el nombre del archivo
    const filePathLastPosition = imgData[0].split("/").at(-1)?.toLowerCase()

    // si el archivo contiene en nombre de la imagen devuelve true
    return filePathLastPosition?.includes(title.toLowerCase())
  });
  // si el filtrado devuelve alguna imagen selecciona la primera del filtrado y devuelve el default de la segunda posicion que seria el imageMetaData
  if (image.length > 0) return image[0][1].default;

  // Si no hubieron coincidencias devuelve la primera imagen del import asi que procuremos que exista la imagen, tener en cuenta que el import tiene en cuenta los tipos de imagen, si no se importa la imagen puede que se requiera agregar el tipo de imagen para que aparezca.
  return images[0][1].default;
}

export const getContentFromImport = ({ mdFiles, lang }: { mdFiles: MarkdownFile[]; lang: string }) => {
  const md = mdFiles.find((file) => file.frontmatter.lang === lang
  );
  return {Content: md?.Content, frontmatter: md?.frontmatter};
}

export const postPath = (pathWithLang: string) => {
  const path = pathWithLang.split("/");
  const blogIndex = "/" + path.at(-1);
  return blogIndex;
};