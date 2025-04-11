import type { MarkdownFile } from '@/types';

export const getContentFromImport = ({ mdFiles, lang }: { mdFiles: MarkdownFile[]; lang: string }) => {
  const md = mdFiles.find((file) => file.frontmatter.lang === lang
  );
  return md?.Content
}