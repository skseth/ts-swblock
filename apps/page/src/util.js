export function getScriptParam() {
    const lastScript = document.currentScript;
    console.log(`getScriptParam got element ${lastScript === null || lastScript === void 0 ? void 0 : lastScript.outerHTML}`);
    return lastScript === null || lastScript === void 0 ? void 0 : lastScript.getAttribute('data-param');
}
