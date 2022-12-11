import { v4 as uuidv4 } from "uuid";
import { createParser } from "eventsource-parser";

async function* streamAsyncIterable(stream: ReadableStream) {
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        return;
      }

      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

const fetchEvent = async (
  resource: string,
  options: RequestInit & { onMessage: (value: string) => void }
) => {
  const { onMessage, ...fetchOptions } = options;
  const response = await fetch(resource, fetchOptions);

  const parser = createParser((event) => {
    if (event.type === "event") {
      onMessage(event.data);
    }
  });

  if (!response.body) return;

  for await (const chunk of streamAsyncIterable(response.body)) {
    const stringText = new TextDecoder().decode(chunk);
    parser.feed(stringText);
  }
};

export const GPTConversation = (
  accessToken: string,
  question: string,
  cb: (value: string) => void
) =>
  fetchEvent("https://chat.openai.com/backend-api/conversation", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },

    body: JSON.stringify({
      action: "next",
      messages: [
        {
          id: uuidv4(),
          role: "user",
          content: {
            content_type: "text",
            parts: [question],
          },
        },
      ],
      model: "text-davinci-002-render",
      parent_message_id: uuidv4(),
    }),

    onMessage(message: string) {
      if (message === "[DONE]") {
        return;
      }
      const data = JSON.parse(message);
      const text = data.message?.content?.parts?.[0];

      if (text) {
        cb(text);
      }
    },
  });
