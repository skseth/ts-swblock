import { onBlockingDecision } from './decisionserver'
import { browserIsFirefox } from '../shared/util'

let askListenersInitialized = false

function splitDomainURLFromNotificationId(notificationId: string) {
  const split = notificationId.split('|')
  return { domain: split[0], scriptURL: split[1] }
}

function initializeAskListeners() {
  if (askListenersInitialized) {
    return
  }

  const handleClick = (notificationId: string, isBlocked: boolean) => {
    console.log(`handleClick notificationid ${notificationId}`)
    const { domain, scriptURL } =
      splitDomainURLFromNotificationId(notificationId)
    console.log(`handleClick domain ${domain} ${scriptURL}`)
    onBlockingDecision(domain, scriptURL, isBlocked)
  }

  if (browserIsFirefox()) {
    chrome.notifications.onClicked.addListener((notificationId) =>
      handleClick(notificationId, true),
    )
  } else {
    chrome.notifications.onButtonClicked.addListener(
      (notificationId, buttonIndex) =>
        handleClick(notificationId, buttonIndex === 1),
    )
  }
  askListenersInitialized = true
}

export function showDecisionUI(domain: string, scriptURL: string) {
  console.log(`show decision UI domain ${domain} scriptURL ${scriptURL}`)
  const isFirefox = browserIsFirefox()

  const options: chrome.notifications.NotificationOptions<true> = {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('logo.png'),
    message: isFirefox ? 'Click to allow' : 'Select option',
    title: `(${domain}:${scriptURL}) Service worker`,
    buttons: isFirefox ? undefined : [{ title: 'ALLOW' }, { title: 'BLOCK' }],
    requireInteraction: isFirefox ? undefined : true,
  }

  initializeAskListeners()

  chrome.notifications.create(domain + '|' + scriptURL, options)
}
