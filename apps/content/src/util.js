export function injectScript(filename, param) {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(filename);
    if (param) {
        s.setAttribute('data-param', param);
    }
    s.onload = function () {
        s.remove();
    };
    (document.head || document.documentElement).appendChild(s);
}
export function injectScriptWithParam(filename, _paramName, paramVal) {
    //   injectMeta(paramName, paramVal)
    injectScript(filename, paramVal);
}
function relayMessageToBackground(event) {
    if (event.source != window) {
        return;
    }
    if (event.data) {
        console.log(`in relaymessage ${JSON.stringify(event.data)}`);
        chrome.runtime.sendMessage({ data: event.data });
    }
}
export function setupRelayToBackground() {
    window.addEventListener('message', relayMessageToBackground, false);
}
export function onBackgroundEvent(fn) {
    // handle remove decision from background
    chrome.runtime.onMessage.addListener(function (request, _sender, _sendResponse) {
        fn(request);
    });
}
