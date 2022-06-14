import { SWEvent } from '../shared/api'

function sendEvent(data: SWEvent) {
  window.postMessage(data, '*')
}

export function sendAskServiceWorkerEvent(domain: string, scriptURL: string) {
  sendEvent({
    type: 'ASKSW',
    domain,
    scriptURL: scriptURL,
  })
}
