import type { BlockingTheme } from '@/types/blocking'
import './style.css'

const root = document.getElementById('__root')!

let prevUrl = ''
const updateState = () => {
  const excludeBtn = document.getElementById('excludeBtn') as HTMLButtonElement
  const siteUrlElement = document.getElementById('blockedSiteUrl') as HTMLElement
  if (!excludeBtn || !siteUrlElement) return
  excludeBtn.disabled = true

  chrome.runtime.sendMessage({ action: 'getOriginalUrl' }, response => {
    if ((!response || !response.url) && prevUrl === '') {
      console.error('Could not get the original URL from the background script.')
      siteUrlElement.textContent = 'Unknown page'
      return
    }

    const blockedUrl = response?.url || prevUrl
    prevUrl = blockedUrl
    const url = new URL(blockedUrl)
    const domain = url.hostname.replace(/^www\./, '')

    siteUrlElement.textContent = domain
    excludeBtn.disabled = false

    excludeBtn.addEventListener('click', async () => {
      excludeBtn.textContent = 'Loading...'
      excludeBtn.disabled = true

      await chrome.runtime.sendMessage({
        action: 'addTempWhitelist',
        domain: domain,
      })

      window.location.href = blockedUrl
    })
  })
}

const setContent = (theme: BlockingTheme | 'error' | 'default') => {
  document.body.className = theme
  root.className = 'content'

  switch (theme) {
    case 'error':
      root.innerHTML = `<div class="container"><h1>Error</h1><p>Could not load blocking settings. Please try again later.</p></div>`
      break

    case 'theme-1': // "Zen Focus"
      root.innerHTML = `
        <div class="container">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="M12 8v4l2 2"></path>
            </svg>
            <h1>A Moment of Focus</h1>
            <p>The path to productivity is paved with intention. This site can wait.</p>
            <button id="excludeBtn">Continue for a Moment</button>
            <div class="site-info">
                Attempted to access: <strong id="blockedSiteUrl">...</strong>
            </div>
        </div>`
      break

    case 'theme-2': // "Digital Void"
      root.innerHTML = `
        <div class="container">
          <div class="content-box">
            <h1>ACCESS DENIED</h1>
            <p>// FOCUS PROTOCOL ENGAGED //</p>
            <p>Distraction detected on local network. Rerouting is not an option. To override the protocol, use the command below.</p>
            <button id="excludeBtn">> TEMPORARY_OVERRIDE</button>
            <div class="site-info">
                Target: <strong id="blockedSiteUrl">...</strong>
            </div>
          </div>
        </div>`
      break

    case 'theme-3': // "Playful Stop"
      root.innerHTML = `
        <div class="container">
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                <line x1="12" y1="2" x2="12" y2="12"></line>
            </svg>
            <h1>Whoa There!</h1>
            <p>Let's get back to the mission! That magical internet land can be explored later.</p>
            <button id="excludeBtn">Just a quick peek!</button>
            <div class="site-info">
                You were heading to: <strong id="blockedSiteUrl">...</strong>
            </div>
        </div>`
      break

    default: // The default theme
      root.innerHTML = `
        <div class="container">
            <h1>Stay Focus!</h1>
            <p>This site is temporarily blocked during your Pomodoro session.</p>
            <button id="excludeBtn">Exclude from current focus</button>
            <div class="site-info">
                You tried to access: <strong id="blockedSiteUrl">...</strong>
            </div>
        </div>`
      break
  }

  updateState()
}

const getBlocking = (): Promise<{ theme: BlockingTheme | 'default' }> =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.get(['blocking'], response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        const theme = response.blocking?.theme || 'default'
        resolve({ theme })
      }
    })
  })

chrome.storage.sync.onChanged.addListener(changes => {
  if (!changes.blocking) return
  setContent(changes.blocking.newValue.theme || 'default')
})

document.addEventListener('DOMContentLoaded', () => {
  getBlocking()
    .then(res => {
      setContent(res.theme)
    })
    .catch(err => {
      setContent('error')
      console.error('Error fetching blocking settings:', err)
    })
})
