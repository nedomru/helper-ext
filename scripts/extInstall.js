browser.runtime.onInstalled.addListener(() => {
  console.log("Расширение установлено.");
  const defaultSettings = {
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
});
