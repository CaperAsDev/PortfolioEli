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