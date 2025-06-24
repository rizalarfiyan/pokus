class Alarms {
  public create(name: string, delayInMinutes: number): void {
    chrome.alarms.create(name, { delayInMinutes })
  }

  public clear(name: string): Promise<boolean> {
    return chrome.alarms.clear(name)
  }

  public onAlarm(callback: (alarm: chrome.alarms.Alarm) => void): void {
    chrome.alarms.onAlarm.addListener(callback)
  }
}

export default Alarms
