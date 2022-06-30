import { onBlockingDecision } from './decisionserver.js';
import { browserIsFirefox } from '@lib/browser-util';
let askListenersInitialized = false;
function splitDomainURLFromNotificationId(notificationId) {
    const split = notificationId.split('|');
    return { domain: split[0], scriptURL: split[1] };
}
function initializeAskListeners() {
    if (askListenersInitialized) {
        return;
    }
    const handleClick = (notificationId, isBlocked) => {
        console.log(`handleClick notificationid ${notificationId}`);
        const { domain, scriptURL } = splitDomainURLFromNotificationId(notificationId);
        console.log(`handleClick domain ${domain} ${scriptURL}`);
        onBlockingDecision(domain, scriptURL, isBlocked);
    };
    if (browserIsFirefox()) {
        chrome.notifications.onClicked.addListener((notificationId) => handleClick(notificationId, true));
    }
    else {
        chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => handleClick(notificationId, buttonIndex === 1));
    }
    askListenersInitialized = true;
}
export async function showDecisionUI(domain, scriptURL) {
    console.log(`show decision UI domain ${domain} scriptURL ${scriptURL}`);
    const isFirefox = browserIsFirefox();
    if (isFirefox) {
        await onBlockingDecision(domain, scriptURL, true);
    }
    const options = {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('logo.png'),
        message: isFirefox ? 'Click to allow' : 'Select option',
        title: `(${domain}:${scriptURL}) Service worker`,
        buttons: isFirefox ? undefined : [{ title: 'ALLOW' }, { title: 'BLOCK' }],
        requireInteraction: isFirefox ? undefined : true,
    };
    initializeAskListeners();
    chrome.notifications.create(domain + '|' + scriptURL, options);
}
