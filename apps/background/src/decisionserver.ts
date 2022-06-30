import { type SWBackgroundEvent } from '@lib/api'
import { addRegistrationForDomainSync } from '@lib/storage'

// on decision being confirmed by ui
export async function onBlockingDecision(
  domain: string,
  scriptURL: string,
  isBlocked: boolean,
) {
  await addRegistrationForDomainSync(domain, scriptURL, isBlocked)
  await notifyBlockingDecision(domain, scriptURL, isBlocked)
}

// tell the tab to remove service worker, if registered
async function notifyBlockingDecision(
  domain: string,
  scriptURL: string,
  isBlocked: boolean,
) {
  console.log(`notifyBlockingDecision ${domain}*`)
  chrome.tabs.query({ url: `${domain}*` }, async function (tabs) {
    const tabId = tabs[0].id
    if (typeof tabId !== 'undefined') {
      if (!isBlocked) {
        await chrome.tabs.reload(tabId, {})
      } else {
        console.log(`notify ${domain} ${scriptURL}`)
        notifyEventToContentScript(tabId, {
          type: 'REMOVESW',
          scriptURL,
        })
      }
    }
  })
}

// notify content script
function notifyEventToContentScript(tabId: number, event: SWBackgroundEvent) {
  chrome.tabs.sendMessage(tabId, event)
}
