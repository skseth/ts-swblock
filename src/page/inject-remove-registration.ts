import { getScriptParam } from './util'

if ('serviceWorker' in navigator) {
  const removeURL = getScriptParam()

  console.log(`Request to remove ${removeURL}`)

  removeServiceWorkerRegistration(removeURL)
}

export function removeServiceWorkerRegistration(removeURL: string) {
  navigator.serviceWorker.getRegistrations().then(function (regs) {
    for (const reg of regs) {
      console.log(`removeServiceWorkerRegistration - ${reg.active.scriptURL}`)
      if (reg.active.scriptURL === removeURL) {
        console.log(`Unregistering ${reg.active.scriptURL}`)
        reg.unregister()
      }
    }
  })
}
