import { getAllPreferences, removeRegistrationForServiceWorker, } from '@lib/storage';
function escapeHtml(unsafe) {
    return unsafe.replace(
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF]/g, (c) => '&#' + ('000' + c.charCodeAt(0)).slice(-4) + ';');
}
function hideElem(elem) {
    elem.style.display = 'none';
}
function showElem(elem) {
    elem.style.display = 'block';
}
function toggleElem(elem) {
    if (elem.style.display === 'none') {
        showElem(elem);
    }
    else {
        hideElem(elem);
    }
}
function byId(elementId) {
    const elem = document.getElementById(elementId);
    if (elem) {
        return elem;
    }
    else {
        throw Error(`Element with if ${elementId} not found`);
    }
}
function isEmptyObject(val) {
    return typeof val !== 'object' || Object.keys(val).length === 0;
}
function blockedClass(isBlocked) {
    return isBlocked ? 'blocked' : 'unblocked';
}
const buttonResetAll = byId('resetAll');
const ulDomains = byId('domains');
buttonResetAll.addEventListener('click', (_e) => {
    chrome.storage.sync.clear();
    hideElem(byId('domains'));
    hideElem(byId('clear_settings'));
});
document.addEventListener('click', async (e) => {
    var _a;
    const currentElem = e.target;
    const parentElem = currentElem.parentElement;
    if (parentElem &&
        parentElem.tagName === 'LI' &&
        'domain' in parentElem.dataset &&
        'type' in parentElem.dataset) {
        const entryType = parentElem.dataset.type;
        const domainElem = (entryType === 'domain'
            ? parentElem
            : (_a = parentElem === null || parentElem === void 0 ? void 0 : parentElem.parentElement) === null || _a === void 0 ? void 0 : _a.previousElementSibling);
        const domainName = domainElem.dataset.domain;
        const spanElem = domainElem.nextElementSibling;
        const removeDomain = async (domainName, scriptURL) => {
            try {
                const prefs = await removeRegistrationForServiceWorker(domainName, scriptURL);
                if (isEmptyObject(prefs.regs)) {
                    domainElem.remove();
                    spanElem.remove();
                }
                else {
                    parentElem.remove();
                }
            }
            catch (e) {
                console.log(e);
            }
        };
        if (!domainName) {
            throw Error(`Domain is unexpectedly not defined for document.clickevent`);
        }
        if (currentElem.tagName === 'A' && entryType === 'domain') {
            console.log(`  parent has domain - toggling view`);
            toggleElem(spanElem);
        }
        if (currentElem.tagName === 'BUTTON') {
            const scriptURL = entryType === 'domain' ? '' : parentElem.getAttribute('id');
            if (!scriptURL) {
                throw Error(`id field for scriptURL is unexpectedly not defined for document.clickevent`);
            }
            await removeDomain(domainName, scriptURL);
        }
    }
});
function renderSW(domain, sw, isBlocked) {
    return `<li id='${sw}' class='indent' data-type='sw' data-domain='${domain}'>
            <a class='${blockedClass(isBlocked)}' href='${sw}' target='_blank'>${sw}</a><button class='remove'>X</button>
          </li>`;
}
function renderDomain(domain, regs) {
    console.log(`render domain ${domain} ${JSON.stringify(regs)}`);
    let domainBlocked = false;
    Object.keys(regs).forEach((sw) => {
        if (regs[sw]) {
            domainBlocked = true;
        }
    });
    const elemHTML = `<li id='${domain}' data-domain='${domain}' data-type='domain'>
    <a href='#' class='${blockedClass(domainBlocked)}'>${domain}</a><button class='remove'>X</button></li>
    <span data-domain='${domain}' style='display:none'>
    ${Object.keys(regs)
        .sort()
        .map((reg) => renderSW(domain, reg, regs[reg]))}
    </span>
  `;
    return elemHTML;
}
;
(async () => {
    const prefs = await getAllPreferences();
    console.log(prefs);
    if (prefs.length === 0) {
        hideElem(buttonResetAll);
        return;
    }
    const allDomains = prefs.map((pref) => {
        return renderDomain(escapeHtml(pref.domain), pref.regs);
    });
    ulDomains.innerHTML = allDomains.join('');
    showElem(ulDomains);
})();
// chrome.storage.sync.get(null, function (data) {
//   if (isEmptyObject(data)) {
//     hideElem(buttonResetAll);
//     return;
//   }
//   Object.keys(data)
//     .sort()
//     .forEach(function (indomain) {
//       const value = data[indomain];
//       const domain = escapeHtml(indomain);
//       ulDomains.innerHTML = `${renderDomain(domain, value)}`;
//     });
//   showElem(ulDomains);
// });
