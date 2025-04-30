import path from 'path';
import fs from 'fs/promises';
import type { MarkdownFile, ApiResponse, BookData } from '@/types';

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