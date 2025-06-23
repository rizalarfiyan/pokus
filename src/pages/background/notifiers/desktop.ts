interface NotificationButton {
  title: string
}

class DesktopNotifier {
  public show(id: string, title: string, message: string, buttons?: NotificationButton[]): void {
    const options: chrome.notifications.NotificationCreateOptions = {
      type: 'basic',
      iconUrl: '/icon-128.png',
      title: title,
      message: message,
      priority: 2,
    }

    if (buttons && buttons.length > 0) {
      options.buttons = buttons
    }

    chrome.notifications.create(id, options)
  }
}

export default DesktopNotifier
