import { GPTConversation } from "../chat";
import { GOOGLE_REGEXP, GPT_AUTHORIZE_URL } from "../defenitions";

chrome.webNavigation.onCompleted.addListener(async (details) => {
  if (details.url === GPT_AUTHORIZE_URL) {
    const response = await fetch(GPT_AUTHORIZE_URL);
    const data = await response.json();

    chrome.storage.local.set({ "GPT-accessToken": data.accessToken }, () => {
      chrome.tabs.remove(details.tabId);
    });
  }

  if (details.url.match(GOOGLE_REGEXP)) {
    chrome.storage.local.get(["GPT-accessToken"], (items: any) => {
      const searchQuery = getSearchParams(details.url);
      const accessToken = items["GPT-accessToken"];

      if (!(searchQuery && accessToken)) {
        return;
      }

      GPTConversation(accessToken, searchQuery, (data) => {
        chrome.tabs.sendMessage(details.tabId, {
          payload: data,
        });
      });
    });
  }
});

const getSearchParams = (url: string): string | null =>
  new URLSearchParams(new URL(url).searchParams).get("q");

export {};
