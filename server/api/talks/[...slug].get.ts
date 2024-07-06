import { eventHandler } from 'h3'
import { talks } from '../../data/talks.json';

type MarkdownData = {
  [key: string]: string;
} & {
  body?: number;
};

type Talk = {
  talk: string;
  conference: string;
  date: string;
  id: string;
  location: string;
}

function convertToMarkdown(markdownData: MarkdownData) {
  const frontMatter = Object.entries(markdownData)
    .filter(([key]) => key !== "body")
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");

  return `---\n${frontMatter}\n---\n\n${markdownData.body ? markdownData.body : ''}`;
}

export default eventHandler(async (event) => {
  const slug = event.context.params?.slug

  // unstorage getKeys
  if (slug && slug === ':') {
    return talks.map((talk: any) => {
      return `${talk.id}.md`
    })
  }

  // unstorage getMeta
  if (slug && slug?.endsWith('$')) {
    return {
      "meta": "YOLO"
    }
  }

  // unstorage getItem
  const id = slug?.replace(".md", "") as string
  const talk = talks.find((talk: Talk) => talk.id === id)

  if (!talk) {
    return false
  }

  return convertToMarkdown({
    ...talk
  });
})
