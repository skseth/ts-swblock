import { SWEvent } from "../shared/api";
import { onAskEvent } from "./decisionserver";
import { showDecisionUI } from "./decisionui";


chrome.runtime.onMessage.addListener(async function(request, _sender, _sendResponse) {
  const event: SWEvent = request.data

  console.log(`bg message listener : ${JSON.stringify(event, null, 2)}`)

  if (event.type === 'ASKSW') {
    await onAskEvent(event);
    showDecisionUI(event.domain, event.scriptURL)
  }
});
