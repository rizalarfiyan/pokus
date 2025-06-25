// src/background/Blocker.ts

import type { BlockingSettings } from '@/types/blocking'

const RULE_ID_START = 1
const RE_DOMAIN = /^(https?:\/\/)?(www\.)?/

export class Blocker {
  public async enable(blockingConfig: BlockingSettings, tempWhitelist: string[] = []): Promise<void> {
    const domainsToBlock = Object.values(blockingConfig.websites)
      .filter(website => website.isActive && !tempWhitelist.includes(website.domain.replace(RE_DOMAIN, '')))
      .map(website => website.domain.replace(RE_DOMAIN, ''))

    if (domainsToBlock.length === 0) {
      await this.disable()
      return
    }

    const newRules: chrome.declarativeNetRequest.Rule[] = domainsToBlock.map((domain, index) => ({
      id: RULE_ID_START + index,
      priority: 1,
      action: {
        type: 'redirect',
        redirect: {
          extensionPath: '/src/pages/blocking/index.html',
        },
      },
      condition: {
        requestDomains: [domain, `www.${domain}`],
        resourceTypes: ['main_frame'],
      },
    }))

    const oldRules = await chrome.declarativeNetRequest.getDynamicRules()
    const oldRuleIds = oldRules.map(rule => rule.id)

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRuleIds,
      addRules: newRules,
    })

    console.log(`Blocking enabled for ${domainsToBlock.length} domains.`)
  }

  public async disable(): Promise<void> {
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules()
    const oldRuleIds = oldRules.map(rule => rule.id)
    if (oldRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRuleIds,
      })
    }

    console.log('Blocking disabled.')
  }
}
