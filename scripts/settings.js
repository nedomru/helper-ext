document.addEventListener("DOMContentLoaded", function () {
  // Загрузка сохраненных настроек
  const checkboxIds = [
    "GENESYS_showFastButtons",
    "GENESYS_hideUselessButtons",
    "GENESYS_hideChatHeader",
    "GENESYS_showOCTPLineStatus",
    "ARM_hideSPAS",
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

  browser.storage.local.get(checkboxIds).then((result) => {
    checkboxIds.forEach((id) => {
      const checkbox = document.getElementById(id);

      checkbox.checked = result[id] || false;
    });
  });

  // Функция для обработчика изменения чекбоксов

  function handleCheckboxChange(event) {
    const setting = event.target.id;

    const isChecked = event.target.checked;

    browser.storage.local.set({ [setting]: isChecked });

    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Настройка ${setting} изменена на ${isChecked}`
    );
  }

  // Применение обработчика для всех чекбоксов

  document.querySelectorAll(".custom-control-input").forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckboxChange);
  });

  // Общая функция для кнопок с тогглами

  function toggleCheckboxes(checkboxIds) {
    checkboxIds.forEach((id) => {
      document.getElementById(id).checked = true;
    });

    browser.storage.local.set(
      checkboxIds.reduce((acc, id) => ({ ...acc, [id]: true }), {})
    );
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
      `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Скрыты остальные вкладки`
    );
  });
});

function onError(error) {
  console.log(`Ошибка: ${error}`);
}
