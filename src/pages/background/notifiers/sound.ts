const OFFSCREEN_DOCUMENT_PATH = '/src/pages/offscreen/index.html'

class SoundNotifier {
  public async play(soundUrl: string): Promise<void> {
    try {
      await this.setupOffscreenDocument()

      await chrome.runtime.sendMessage({
        target: 'offscreen',
        action: 'playSound',
        soundUrl: chrome.runtime.getURL(soundUrl),
      })
    } catch (error) {
      console.error('Sound Notifier failed:', error)
    }
  }

  private async setupOffscreenDocument(): Promise<void> {
    if (await chrome.offscreen.hasDocument()) {
      return
    }

    await chrome.offscreen.createDocument({
      url: OFFSCREEN_DOCUMENT_PATH,
      reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
      justification: 'To play notification sounds for the timer',
    })
  }
}

export default SoundNotifier
