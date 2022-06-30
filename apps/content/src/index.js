import { getPreferencesForDomainSync } from '@lib/storage';
import { injectScript, onBackgroundEvent, setupRelayToBackground, } from './util.js';
console.log(`SWBlock - content location ${location.href}`);
// first - stop all registrations
injectScript('inject-stop-registrations.js');
// setup relay to send events from page to background
setupRelayToBackground();
// setup handler for events from backgrounds
onBackgroundEvent((e) => {
    if (e.type === 'REMOVESW') {
        injectScript('inject-remove-registration.js', e.scriptURL);
    }
});
(async () => {
    const domainURL = new URL('/', location.href).href;
    console.log(`content script ${domainURL}`);
    console.log(`SWBlock CS - domainURL ${domainURL}`);
    const prefs = await getPreferencesForDomainSync(domainURL);
    console.log(`SWBlock prefs domain ${prefs.domain}`);
    if (prefs) {
        injectScript('inject-apply-preferences.js', JSON.stringify(prefs));
    }
})();
