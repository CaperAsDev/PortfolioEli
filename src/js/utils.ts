import path from 'path';
import fs from 'fs/promises';
import type { MarkdownFile, ApiResponse, BookData } from '@/types';
import { Languages, defaultLang } from '@/i18n/consts';
import { Blogs } from '@/i18n/types';
import { blogsNames } from '@/i18n/ui';
import { getLangFromUrl } from '@/i18n/utils';

export const getBreadcrumbs = ({ url }: { url: URL }) => {
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
      label = path
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    return {
      label,
      link,
      index,
    };
  });

  return breadcrumbs;
};

export const getContentFromImport = ({ mdFiles, lang }: { mdFiles: MarkdownFile[]; lang: string }) => {
  const md = mdFiles.find((file) => file.frontmatter.lang === lang
  );
  return {Content: md?.Content, frontmatter: md?.frontmatter};
}

export const getBookInfo = async ({isbn}: {isbn: number}) =>  {
  const bookInfoAvailable = await isBookInDatabase(isbn);
  if (bookInfoAvailable) {
    return bookInfoAvailable;
  } else {
    console.log(`Book with ISBN ${isbn} not found in local database. Fetching from API...`);
    
    const BaseApiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN%3A${isbn}&format=json&jscmd=data`;

    const newBook = await fetch(BaseApiUrl)
    .then((response) => response.json() as Promise<ApiResponse>)
    .then((data) => {

      const book = data[`ISBN:${isbn}`];
      saveBookToDatabase({book: book})

      return book;  })
    .catch((error) => console.error("Error fetching book data:", error));
    
    return newBook;
  }

}

const isBookInDatabase = async (isbn: number) => {
  try {
    const dataBasePath = path.resolve("src", './data/books.json');
    const localDataBase = JSON.parse(await fs.readFile(dataBasePath, 'utf-8'));
    const book = localDataBase.find((book: { isbn: string }) => {
      return Number(book.isbn) === Number(isbn);
    });

    return book;
  } catch (error) {
    console.error("Error reading local database:", error);
    return null;
  }
};

const saveBookToDatabase = async ({ book }: {book:BookData}) => {
  try {
    const dataBasePath = path.resolve("src", './data/books.json');
    const localDataBase = JSON.parse(await fs.readFile(dataBasePath, 'utf-8'));
    const newBook = {...book, isbn: book.identifiers.isbn_13[0], id: localDataBase.length}
    const newDataBase = [...localDataBase, newBook ];
    await fs.writeFile(dataBasePath, JSON.stringify(newDataBase, null, 2));

  } catch (error) {
    console.error("Error saving book to database:", error);
  }
}