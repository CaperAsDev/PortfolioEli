import path from "path";
import fs from 'fs/promises';

const params = process.argv.slice(2);
console.log(`params: ${params}`);

const isbn = params[0];

const BaseApiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN%3A${isbn}&format=json&jscmd=data`;

fetch(BaseApiUrl)
  .then((response) => response.json())
  .then((data) => {
    const book = data[`ISBN:${isbn}`];
    saveBookToDatabase({book: book})
})
  .catch((error) => console.error("Error fetching book data:", error));

const saveBookToDatabase = async ({ book }) => {
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