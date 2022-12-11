import ReactMarkdown from "react-markdown";
import * as ReactDOMServer from "react-dom/server";

const Container = () => (
  <div
    id="chat-gpt-container"
    style={{
      padding: "16px",
      overflow: "scroll",
      maxHeight: "600px",
      marginBottom: "1rem",
      borderRadius: "0.375rem",
      border: "1px solid #e5e7eb",
      boxShadow: "0 0 #0000 ,0 0 #0000, 0 1px 2px 0 rgba(0,0,0,.05)",
    }}
  >
    <h2
      style={{
        paddingBottom: "1rem",
        borderBottom: "1px solid rgba(0,0,0,0.3)",
      }}
    >
      🤖 Response from AI
    </h2>
    <div id="chat-gpt-content"></div>
  </div>
);

export const messagesFromReactAppListener = (
  msg: { payload: string },
  _sender: chrome.runtime.MessageSender,
  _sendResponse: (content: string) => void
) => {
  if (!msg.payload) return;

  let existingContainer = document.getElementById("chat-gpt-container");

  if (!existingContainer) {
    const newContainer = document.createElement("div");
    newContainer.innerHTML = ReactDOMServer.renderToString(<Container />);

    const googleContent = document.getElementById("rcnt");
    googleContent?.children[0].prepend(newContainer);
  }

  const content = document.getElementById("chat-gpt-content");
  if (!content) return;

  content.innerHTML = ReactDOMServer.renderToString(
    <ReactMarkdown>{msg.payload}</ReactMarkdown>
  );
};

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
