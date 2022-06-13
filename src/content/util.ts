import { SWBackgroundEvent } from "../shared/api";

export function injectScript(filename: string, param?: string) {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL(filename);
  if (param) {
      s.setAttribute("data-param", param)
  }
  s.onload = function () {
    s.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

export function injectScriptWithParam(filename: string, _paramName: string, paramVal: string) {
//   injectMeta(paramName, paramVal)
  injectScript(filename, paramVal)
}

function relayMessageToBackground(event: MessageEvent<unknown>) {
  if(event.source != window){
    return;
  }

  if (event.data) {
      console.log(`in relaymessage ${JSON.stringify(event.data)}`);
      chrome.runtime.sendMessage({data: event.data})
  }
}

export function setupRelayToBackground() {
    window.addEventListener('message', relayMessageToBackground, false);
}

export function onBackgroundEvent(fn: (event: SWBackgroundEvent) => void) {
  // handle remove decision from background
  chrome.runtime.onMessage.addListener(function (
    request,
    _sender,
    _sendResponse,
  ) {
    fn(request)
  });
}


