import { sendAskServiceWorkerEvent } from './client'

globalThis.__swb_prefs__ = {
  domain: new URL('/', location.href).href,
  regs: {},
}

type RegisterAction = 'BLOCK' | 'ALLOW' | 'ASK'

const originalRegisterFunc = navigator.serviceWorker.register

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register = newRegister
}

async function newRegister(
  path: string | URL,
  options?: RegistrationOptions,
): Promise<ServiceWorkerRegistration> {
  const scriptURL = new URL(path, window.location.href).href
  const action = chooseAction(scriptURL)

  if (action === 'ALLOW') {
    console.log(`Allowing registration for service worker ${path}`)
    navigator.serviceWorker.register = originalRegisterFunc
    return navigator.serviceWorker.register(path, options)
  }

  if (action === 'ASK') {
    sendAskServiceWorkerEvent(globalThis.__swb_prefs__.domain, scriptURL)
    console.log(`Requesting decision for service worker ${path}`)
  }

  console.log(`Blocking registration for service worker ${path}`)
  throw Error(`Service Worker ${path} has been blocked for this domain`)
}

function chooseAction(scriptURL: string): RegisterAction {
  const prefs = globalThis.__swb_prefs__

  if (prefs && prefs.regs && typeof prefs.regs[scriptURL] !== 'undefined') {
    const isBlocked = prefs.regs[scriptURL]
    if (isBlocked) {
      return 'BLOCK'
    } else {
      return 'ALLOW'
    }
  }

  return 'ASK'
}
