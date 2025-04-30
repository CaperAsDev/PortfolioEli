export type MarkdownFile = {
  file: string;
  url: string;
  frontmatter: {
    [key: string]: any;
    lang: string;
  };
  Content: any;
  rawContent: () => string;
  compiledContent: () => Promise<string>;
  getHeadings: () => Promise<{ depth: number; slug: string; text: string }[]>;
};


// Book data types
interface BookAuthor {
  url: string;
  name: string;
}

interface BookPublisher {
  name: string;
}

interface BookCover {
  small: string;
  medium: string;
  large: string;
}

export interface BookData {
  url: string;
  key: string;
  title: string;
  subtitle?: string;
  authors: BookAuthor[];
  number_of_pages: number;
  identifiers: {
    isbn_10: string[];
    isbn_13: string[];
    openlibrary: string[];
  };
  publishers: BookPublisher[];
  publish_date: string;
  notes?: string;
  cover: BookCover;
}

export interface ApiResponse {
  [key: string]: BookData;
}