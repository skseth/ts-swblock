import { SWPreferences } from '@lib/api'

export function getAllPreferences(): Promise<SWPreferences[]> {
  return new Promise((resolve, _reject) => {
    chrome.storage.sync.get(null, (data) => {
      console.log(JSON.stringify(data, null, 2))
      const allPrefs = Object.keys(data).map((domain) => {
        return {
          domain,
          regs: data[domain],
        }
      })
      resolve(allPrefs)
    })
  })
}

export async function getPreferencesForDomainSync(
  domain: string,
): Promise<SWPreferences> {
  console.log(`storage - GET preferences for ${domain}`)
  return new Promise((resolve, _reject) => {
    chrome.storage.sync.get([domain], function (data) {
      let regs = data[domain]
      if (regs === null || typeof regs !== 'object') {
        regs = {}
      }
      resolve({ domain, regs })
    })
  })
}

export async function addRegistrationForDomainSync(
  domain: string,
  scriptURL: string,
  isBlocked: boolean,
): Promise<void> {
  console.log(`addReg domain ${domain} scriptURL ${scriptURL} isBlocked`)
  const prefs = await getPreferencesForDomainSync(domain)
  console.log(`addReg ${prefs.domain}`)
  prefs.regs[scriptURL] = isBlocked
  await writePrefs(prefs)
}

async function removeRegistrationForDomain(
  domain: string,
): Promise<SWPreferences> {
  await chrome.storage.sync.remove(domain)
  return { domain, regs: {} }
}

async function writePrefs(prefs: SWPreferences): Promise<SWPreferences> {
  return new Promise((resolve, _reject) => {
    chrome.storage.sync.set(
      {
        [prefs.domain]: prefs.regs,
      },
      () => {
        resolve(prefs)
      },
    )
  })
}

export async function removeRegistrationForServiceWorker(
  domain: string,
  scriptURL = '',
): Promise<SWPreferences> {
  if (scriptURL === '') {
    console.log(`removing reg from domain`)
    return removeRegistrationForDomain(domain)
  }
  console.log(`removing scriptURL`)
  const prefs = await getPreferencesForDomainSync(domain)
  if (scriptURL in prefs.regs) {
    delete prefs.regs[scriptURL]
    if (Object.keys(prefs.regs).length === 0) {
      return removeRegistrationForDomain(domain)
    } else {
      return writePrefs(prefs)
    }
  } else {
    throw new Error(
      `removeRegistrationForServiceWorker: Attempt to delete non-existent script ${scriptURL} from domain ${domain}`,
    )
  }
}
