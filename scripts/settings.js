document.addEventListener("DOMContentLoaded", async function () {
  const version = browser.runtime.getManifest().version;
  document.getElementById("extension-version").textContent = version;

  // Загрузка сохраненных настроек
  const checkboxIds = [
    "GENESYS_showFastButtons",
    "GENESYS_hideUselessButtons",
    "GENESYS_hideChatHeader",
    "GENESYS_showOCTPLineStatus",
    "GENESYS_showClientChannelOnCard",
    "ARM_hideSPAS",
    "ARM_copyClientAddress",
    "ARM_copyClientCard",
    "ARM_copyClientAgreement",
    "ARM_showHelperSMSButtons",
    "ARM_copyTimeSlots",
    "ARM_changeRequestFastButtons",
    "ARM_changeRequestFastButtonsLeftFrame",
    "ARM_checkForSpecialClient",
    "ARM_hideTabIPTV",
    "ARM_hideTabMVNO",
    "ARM_hideTabAVTOSP",
    "ARM_hideTabPORTRET",
    "ARM_hideTabABONEMENT",
    "ARM_hideTabPL",
    "ARM_hideTabInvoices",
    "ARM_hideTabPayments",
    "ARM_hideTabAutopayment",
    "ARM_hideTabDiagnostic",
    "ARM_hideTabDiagnosticNew",
    "ARM_hideTabSpecialOffers",
    "ARM_hideTabBalanceLimit",
    "ARM_hideTabMNP",
    "ARM_hideTabMainSales",
    "ARM_hideTabLoans",
    "ARM_checkWrongTransfer",
    "ARM_checkSetToMe",
    "LINE_highlightOperators",
    "LINE_dutyButtons",
    "LINE_showFastButtons",
    "LINE_updateNeededSL",
  ];

  try {
    const result = await browser.storage.sync.get(checkboxIds);
    checkboxIds.forEach((id) => {
      const checkbox = document.getElementById(id);
      checkbox.checked = result[id] || false;
    });
  } catch (error) {
    console.error(`Ошибка при загрузке настроек: ${error}`);
  }

  function handleCheckboxChange(event) {
    const setting = event.target.id;
    const isChecked = event.target.checked;
    browser.storage.sync
      .set({ [setting]: isChecked })
      .then(() => {
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Настройка ${setting} изменена на ${isChecked}`
        );
      })
      .catch(onError);
  }

  // Привязка обработчика изменения к чекбоксам
  checkboxIds.forEach((id) => {
    const checkbox = document.getElementById(id);
    checkbox.addEventListener("change", handleCheckboxChange);
  });

  // Общая функция для кнопок с тогглами
  function toggleCheckboxes(checkboxIds) {
    checkboxIds.forEach((id) => {
      document.getElementById(id).checked = true;
    });

    browser.storage.sync
      .set(checkboxIds.reduce((acc, id) => ({ ...acc, [id]: true }), {}))
      .catch(onError);
  }

  // Обработчик для кнопки "toggleMoneyButton"
  const toggleMoneyButton = document.getElementById("toggleMoneyCheckboxes");
  toggleMoneyButton.addEventListener("click", function () {
    const moneyCheckboxIds = [
      "ARM_hideTabABONEMENT",
      "ARM_hideTabPL",
      "ARM_hideTabInvoices",
      "ARM_hideTabPayments",
      "ARM_hideTabAutopayment",
      "ARM_hideTabSpecialOffers",
      "ARM_hideTabBalanceLimit",
      "ARM_hideTabMainSales",
      "ARM_hideTabLoans",
    ];
    toggleCheckboxes(moneyCheckboxIds);
    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Скрыты вкладки начислений`
    );
  });

  // Обработчик для кнопки "toggleOtherButton"
  const toggleOtherButton = document.getElementById("toggleOtherCheckboxes");
  toggleOtherButton.addEventListener("click", function () {
    const otherCheckboxIds = [
      "ARM_hideTabIPTV",
      "ARM_hideTabMVNO",
      "ARM_hideTabAVTOSP",
      "ARM_hideTabPORTRET",
      "ARM_hideTabMNP",
      "ARM_hideTabDiagnostic",
      "ARM_hideTabDiagnosticNew",
    ];
    toggleCheckboxes(otherCheckboxIds);
    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Скрыты побочные вкладки`
    );
  });
});

function onError(error) {
  console.log(`Ошибка: ${error}`);
}
