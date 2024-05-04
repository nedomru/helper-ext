document.addEventListener("DOMContentLoaded", function () {
  // Загрузка сохраненных настроек
  browser.storage.local
    .get([
      "hideSPAS",
      "hideChatHeader",
      "hideTabIPTV",
      "hideTabMVNO",
      "hideTabAVTOSP",
      "hideTabPORTRET",
      "hideTabABONEMENT",
      "hideTabPL",
      "hideTabInvoices",
      "hideTabPayments",
      "hideTabAutopayment",
      "diagnosticNew",
      "specialOffers",
      "balanceLimit",
      "MNP",
      "mainSales",
    ])
    .then((result) => {
      document.getElementById("hideSPAS").checked = result.hideSPAS || false;

      document.getElementById("hideTabIPTV").checked =
        result.hideTabIPTV || false;

      document.getElementById("hideTabMVNO").checked =
        result.hideTabMVNO || false;

      document.getElementById("hideTabAVTOSP").checked =
        result.hideTabAVTOSP || false;

      document.getElementById("hideTabPORTRET").checked =
        result.hideTabPORTRET || false;

      document.getElementById("hideTabABONEMENT").checked =
        result.hideTabABONEMENT || false;

      document.getElementById("hideTabPL").checked = result.hideTabPL || false;

      document.getElementById("hideTabInvoices").checked =
        result.hideTabInvoices || false;

      document.getElementById("hideTabPayments").checked =
        result.hideTabPayments || false;

      document.getElementById("hideTabAutopayment").checked =
        result.hideTabAutopayment || false;

      document.getElementById("diagnosticNew").checked =
        result.diagnosticNew || false;

      document.getElementById("specialOffers").checked =
        result.specialOffers || false;

      document.getElementById("balanceLimit").checked =
        result.balanceLimit || false;

      document.getElementById("hideChatHeader").checked =
        result.hideChatHeader || false;

      document.getElementById("MNP").checked = result.MNP || false;

      document.getElementById("mainSales").checked = result.mainSales || false;
    });

  document
    .querySelectorAll(".custom-control-input")
    .forEach(function (checkbox) {
      checkbox.addEventListener("click", function (event) {
        const setting = checkbox.id;
        browser.storage.local.set({ [setting]: checkbox.checked });
      });
    });
});

function onError(error) {
  console.log(`Ошибка: ${error}`);
}
