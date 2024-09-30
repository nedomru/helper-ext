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
      "https://api.github.com/repos/AuthFailed/domru-helper/releases/latest"
    );

    const data = await response.json();

    const latestVersion = data.tag_name;
    const currentVersion = browser.runtime.getManifest().version;

    if (compareVersions(latestVersion, currentVersion) > 0) {
      await browser.tabs.create({
        url: browser.runtime.getURL("update.html"),
      });
    }
  }
}

async function setDefaults() {
  const defaultSettings = {
    OTHER_CheckUpdates: true,
    OTHER_DarkTheme: false,
    /*GENESYS_showLineMessages: true,*/
    GENESYS_showFastButtons: true,
    GENESYS_showFB_chatMaster: true,
    GENESYS_showFB_setupRouter: true,
    GENESYS_showFB_setupTV: true,
    GENESYS_hideUselessButtons: false,
    // GENESYS_hideChatHeader: false,
    GENESYS_showOCTPLineStatus: false,
    // GENESYS_showClientChannelOnCard: false,
    ARM_allowCopy: true,
    ARM_hideSPAS: false,
    ARM_copyClientAddress: true,
    ARM_copyClientCard: true,
    ARM_copyClientAgreement: true,
    ARM_copySearchMAC: true,
    ARM_showHelperSMSButtons: true,
    ARM_copyTimeSlots: true,
    ARM_changeRequestFBCR: true,
    ARM_changeRequestFBCR_Open_KCNCK1: true,
    ARM_changeRequestFBLF: true,
    ARM_changeRequestFBLF_Open_KCNCK1: true,
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
    ARM_copyClientAddressWithoutCity: false,
    ARM_highlightRequestsClasses: true,
    ARM_filterClientSessions: true,
    LINE_highlightOperators: false,
    LINE_dutyButtons: false,
    LINE_showFB: true,
    LINE_showFB_Mail: true,
    LINE_showFB_Lunch: true,
    LINE_updateNeededSL: false,
    LINE_countAppointments: false,

    // Стандартные цвета
    HIGHLIGHTER_CS: "#ff0000",
    HIGHLIGHTER_EMAIL: "#006400",
    HIGHLIGHTER_OCTP: "#008080",
    HIGHLIGHTER_SZVG: "#FF00FF",
    HIGHLIGHTER_COMPENSATION: "#66CDAA",
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
  checkForUpdates().then(() => {console.log("Хелпер - Проверка обновлений")});
  setDefaults().then(() => {console.log("Хелпер - Установка стандартных настроек")});
});
browser.runtime.onStartup.addListener(checkForUpdates);
