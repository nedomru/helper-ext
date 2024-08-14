async function checkForUpdates() {
  // Получаем настройки из sync
  const settings = await browser.storage.sync.get("OTHER_CheckUpdates");

  // Проверяем, включена ли проверка обновлений
  if (settings.OTHER_CheckUpdates) {
    function compareVersions(v1, v2) {
      const v1Parts = v1.split(".").map(Number);
      const v2Parts = v2.split(".").map(Number);
      for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;
        if (v1Part < v2Part) return -1; // v1 меньше v2
        if (v1Part > v2Part) return 1; // v1 больше v2
      }
      return 0; // версии равны
    }

    const response = await fetch(
      "https://api.github.com/repos/AuthFailed/domhelper/releases/latest"
    );

    const data = await response.json();

    const latestVersion = data.tag_name;
    const currentVersion = browser.runtime.getManifest().version;

    if (compareVersions(latestVersion, currentVersion) > 0) {
      browser.tabs.create({
        url: browser.runtime.getURL("update.html"),
      });
    }
  }
}

async function setDefaults() {
  const defaultSettings = {
    OTHER_CheckUpdates: true,
    GENESYS_showFastButtons: true,
    GENESYS_hideUselessButtons: false,
    GENESYS_hideChatHeader: false,
    GENESYS_showOCTPLineStatus: false,
    GENESYS_showClientChannelOnCard: false,
    ARM_hideSPAS: false,
    ARM_copyClientAddress: true,
    ARM_copyClientCard: true,
    ARM_copyClientAgreement: true,
    ARM_showHelperSMSButtons: true,
    ARM_copyTimeSlots: true,
    ARM_changeRequestFastButtons: true,
    ARM_changeRequestFastButtonsLeftFrame: true,
    ARM_checkForSpecialClient: true,
    ARM_hideTabIPTV: false,
    ARM_hideTabMVNO: false,
    ARM_hideTabAVTOSP: false,
    ARM_hideTabPORTRET: false,
    ARM_hideTabABONEMENT: false,
    ARM_hideTabPL: false,
    ARM_hideTabInvoices: false,
    ARM_hideTabPayments: false,
    ARM_hideTabAutopayment: false,
    ARM_hideTabDiagnostic: false,
    ARM_hideTabDiagnosticNew: false,
    ARM_hideTabSpecialOffers: false,
    ARM_hideTabBalanceLimit: false,
    ARM_hideTabMNP: false,
    ARM_hideTabMainSales: false,
    ARM_hideTabLoans: false,
    ARM_checkWrongTransfer: false,
    ARM_checkSetToMe: false,
    LINE_highlightOperators: false,
    LINE_dutyButtons: false,
    LINE_showFastButtons: true,
    LINE_updateNeededSL: false,
    LINE_countAppointments: false,
  };

  browser.storage.sync
    .get(Object.keys(defaultSettings))
    .then((existingSettings) => {
      // Устанавливаем только если значений нет
      const settingsToSet = {};

      Object.keys(defaultSettings).forEach((key) => {
        if (existingSettings[key] === undefined) {
          settingsToSet[key] = defaultSettings[key];
        }
      });
      return browser.storage.sync.set(settingsToSet);
    })
    .then(() => {
      console.log("Настройки установлены:", defaultSettings);
    })
    .catch((error) => {
      console.error("Ошибка установки настроек:", error);
    });
}

browser.runtime.onInstalled.addListener(() => {
  checkForUpdates();
  setDefaults();
});
browser.runtime.onStartup.addListener(checkForUpdates);
