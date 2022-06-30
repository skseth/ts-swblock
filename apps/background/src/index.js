import { showDecisionUI } from './decisionui.js';
chrome.runtime.onMessage.addListener(async function (request, _sender, _sendResponse) {
    const event = request.data;
    console.log(`#bg message listener : ${JSON.stringify(event, null, 2)}`);
    if (event.type === 'ASKSW') {
        await showDecisionUI(event.domain, event.scriptURL);
    }
});
