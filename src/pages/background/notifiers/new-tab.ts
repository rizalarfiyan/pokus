class NewTabNotifier {
  public show(): void {
    chrome.runtime.openOptionsPage()
  }
}

export default NewTabNotifier
