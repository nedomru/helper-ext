document.addEventListener("DOMContentLoaded", function () {
  // Загрузка сохраненных настроек
  if (navigator.userAgent.includes("Chrome") == false) {
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
        "hideTabDiagnosticNew",
        "hideTabSpecialOffers",
        "hideTabBalanceLimit",
        "hideTabMNP",
        "hideTabMainSales",
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

        document.getElementById("hideTabPL").checked =
          result.hideTabPL || false;

        document.getElementById("hideTabInvoices").checked =
          result.hideTabInvoices || false;

        document.getElementById("hideTabPayments").checked =
          result.hideTabPayments || false;

        document.getElementById("hideTabAutopayment").checked =
          result.hideTabAutopayment || false;

        document.getElementById("hideTabDiagnosticNew").checked =
          result.hideTabDiagnosticNew || false;

        document.getElementById("hideTabSpecialOffers").checked =
          result.hideTabSpecialOffers || false;

        document.getElementById("hideTabBalanceLimit").checked =
          result.hideTabBalanceLimit || false;

        document.getElementById("hideTabMNP").checked =
          result.hideTabMNP || false;

        document.getElementById("hideTabMainSales").checked =
          result.hideTabMainSales || false;
      });

    document
      .querySelectorAll(".custom-control-input")
      .forEach(function (checkbox) {
        checkbox.addEventListener("click", function (event) {
          const setting = checkbox.id;
          browser.storage.local.set({ [setting]: checkbox.checked });
        });
      });
  } else {
    chrome.storage.local.get(
      [
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
        "hideTabDiagnosticNew",
        "hideTabSpecialOffers",
        "hideTabBalanceLimit",
        "hideTabMNP",
        "hideTabMainSales",
      ],
      function (result) {
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

        document.getElementById("hideTabPL").checked =
          result.hideTabPL || false;

        document.getElementById("hideTabInvoices").checked =
          result.hideTabInvoices || false;

        document.getElementById("hideTabPayments").checked =
          result.hideTabPayments || false;

        document.getElementById("hideTabAutopayment").checked =
          result.hideTabAutopayment || false;

        document.getElementById("hideTabDiagnosticNew").checked =
          result.hideTabDiagnosticNew || false;

        document.getElementById("hideTabSpecialOffers").checked =
          result.hideTabSpecialOffers || false;

        document.getElementById("hideTabBalanceLimit").checked =
          result.hideTabBalanceLimit || false;

        document.getElementById("hideTabMNP").checked =
          result.hideTabMNP || false;

        document.getElementById("hideTabMainSales").checked =
          result.hideTabMainSales || false;
      }
    );

    document
      .querySelectorAll(".custom-control-input")
      .forEach(function (checkbox) {
        checkbox.addEventListener("click", function (event) {
          const setting = checkbox.id;
          chrome.storage.local.set({ [setting]: checkbox.checked });
        });
      });
  }
});

function onError(error) {
  console.log(`Ошибка: ${error}`);
}
