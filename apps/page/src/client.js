function sendEvent(data) {
    window.postMessage(data, '*');
}
export function sendAskServiceWorkerEvent(domain, scriptURL) {
    sendEvent({
        type: 'ASKSW',
        domain,
        scriptURL: scriptURL,
    });
}
