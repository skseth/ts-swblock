
import { AskServiceWorkerEvent, SWBackgroundEvent } from '../shared/api';
import { browserIsFirefox } from '../shared/util';
import { addRegistrationForDomainSync } from '../shared-bg/storage';

// on decision being confirmed by ui
export async function onBlockingDecision(
  domain: string,
  scriptURL: string,
  isBlocked: boolean,
) {
  await addRegistrationForDomainSync(domain, scriptURL, isBlocked);
  notifyBlockingDecision(domain, scriptURL, isBlocked);
}

// request from tab to ask for blocking decision
export async function onAskEvent(event: AskServiceWorkerEvent) {
  const isFirefox = browserIsFirefox();
  if (isFirefox) {
    await addRegistrationForDomainSync(event.domain, event.scriptURL, true);
  }
}

// tell the tab to remove service worker, if registered
function notifyBlockingDecision(
  domain: string,
  scriptURL: string,
  isBlocked: boolean,
) {
  console.log(`notifyBlockingDecision ${domain}*`)
  chrome.tabs.query({ url: `${domain}*` }, function (tabs) {
    if (!isBlocked) {
      chrome.tabs.reload(tabs[0].id);
    } else {
      console.log(`notify ${domain} ${scriptURL}`);
      notifyEventToContentScript(tabs[0].id, {
        type: 'REMOVESW',
        scriptURL,
      });
    }
  });
}

// notify content script
function notifyEventToContentScript(tabId: number, event: SWBackgroundEvent) {
  chrome.tabs.sendMessage(tabId, event);
}
