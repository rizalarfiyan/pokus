chrome.runtime.onMessage.addListener(message => {
  if (message.target === 'offscreen' && message.action === 'playSound') {
    const audioPlayer = new Audio(message.soundUrl)
    audioPlayer.play().catch(e => console.error('Error to play Audio: ', e))
  }

  return false
})
