import { SWBackgroundEvent } from '@lib/api'
import { addRegistrationForDomainSync } from '@lib/storage'

// on decision being confirmed by ui
export async function onBlockingDecision(
  domain: string,
  scriptURL: string,
  isBlocked: boolean,
) {
  await addRegistrationForDomainSync(domain, scriptURL, isBlocked)
  notifyBlockingDecision(domain, scriptURL, isBlocked)
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
      chrome.tabs.reload(tabs[0].id)
    } else {
      console.log(`notify ${domain} ${scriptURL}`)
      notifyEventToContentScript(tabs[0].id, {
        type: 'REMOVESW',
        scriptURL,
      })
    }
  })
}

// notify content script
function notifyEventToContentScript(tabId: number, event: SWBackgroundEvent) {
  chrome.tabs.sendMessage(tabId, event)
}
