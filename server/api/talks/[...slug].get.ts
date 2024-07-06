import { eventHandler } from 'h3'
import { ofetch } from "ofetch";

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

async function getTalkKeys(endpoint: string) {
  const { data } = await ofetch(endpoint, {
    method: "post",
    body: {
      query: `
          query Talks($first: Int!) {
            talks(first: $first, orderBy: date_DESC) {
              id
            }
          }
          `,
      variables: {
        first: 200,
      },
    },
  });

  return data.talks
};

async function getTalk(endpoint: string, id: string) {
  const { data } = await ofetch(endpoint, {
    method: "post",
    body: {
      query: `
          query Talk($id: ID!) {
            talk(where: { id: $id }) {
              id
              conference
              talk
              location
              date
              link
            }
          }
          `,
      variables: {
        id,
      },
    },
  });

  return data.talk
};


function convertToMarkdown(markdownData: MarkdownData) {
  const frontMatter = Object.entries(markdownData)
    .filter(([key]) => key !== "body")
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n");

  const markdownContent = `---\n${frontMatter}\n---\n\n${markdownData.body ? markdownData.body : ''}`;

  return markdownContent;
}

export default eventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const endoint = runtimeConfig.gqlEndpoint

  const slug = event.context.params?.slug


  // unstorage getKeys
  if (slug === ':') {
    const talks = await getTalkKeys(endoint)
    return talks.map((talk: any) => {
      return `${talk.id}.md`
    })
  }

  // unstorage getMeta
  if (slug?.endsWith('$')) {
    return {
      "meta": "value"
    }
  }

  // unstorage getItem
  const talkInfo = await getTalk(endoint, slug?.replace(".md", "") as string)
  return convertToMarkdown({
    "title": talkInfo.talk,
    "description": talkInfo.conference,
    ...talkInfo,
    // "body": `# ${talkInfo.talk} on ${talkInfo.conference} at ${talkInfo.date}`
  });
})
