export function getScriptParam() {
  const lastScript = document.currentScript
  console.log(`getScriptParam got element ${lastScript.outerHTML}`)
  return lastScript.getAttribute('data-param')
}
