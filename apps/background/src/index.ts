import { AddFieldValueEvent, type SWEvent } from '@lib/api'
import { showDecisionUI } from './decisionui.js'

chrome.runtime.onMessage.addListener(async function (
  request,
  _sender,
  _sendResponse,
) {
  const event: SWEvent = request.data

  console.log(`#bg message listener : ${JSON.stringify(event, null, 2)}`)

  if (event.type === 'ASKSW') {
    await showDecisionUI(event.domain, event.scriptURL)
  }
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status != 'complete') {
    return
  }

  if (tab.url?.indexOf('stackoverflow.com') != -1) {
    const event: AddFieldValueEvent = {
      type: 'ADD_FIELD_VALUE',
      fields: [{ selector: 'input[name="q"]', value: 'hello, search this!' }],
    }
    chrome.tabs.sendMessage(tabId, event)
  }
})
