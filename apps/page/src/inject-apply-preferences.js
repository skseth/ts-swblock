import { getScriptParam } from './util.js';
if ('serviceWorker' in navigator) {
    const content = getScriptParam();
    if (typeof content === 'string') {
        const _sw_param = JSON.parse(content);
        if (_sw_param && typeof _sw_param === 'object') {
            globalThis.__swb_prefs__ = _sw_param;
        }
    }
}
