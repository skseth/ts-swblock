import { getScriptParam } from './util.js';
if ('serviceWorker' in navigator) {
    const removeURL = getScriptParam();
    console.log(`Request to remove ${removeURL}`);
    if (typeof removeURL === 'string') {
        removeServiceWorkerRegistration(removeURL);
    }
}
export function removeServiceWorkerRegistration(removeURL) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
        var _a, _b;
        for (const reg of regs) {
            console.log(`removeServiceWorkerRegistration - ${(_a = reg.active) === null || _a === void 0 ? void 0 : _a.scriptURL}`);
            if (((_b = reg.active) === null || _b === void 0 ? void 0 : _b.scriptURL) === removeURL) {
                console.log(`Unregistering ${reg.active.scriptURL}`);
                reg.unregister();
            }
        }
    });
}
