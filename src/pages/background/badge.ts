class Badge {
  public setText(text: string): void {
    chrome.action.setBadgeText({ text })
  }

  public setColor(color: string): void {
    chrome.action.setBadgeBackgroundColor({ color })
  }

  public clear(): void {
    this.setText('')
  }
}

export default Badge
