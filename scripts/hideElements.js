if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
  browser.storage.local
    .get([
      "hideSPAS",
      "hideTabIPTV",
      "hideTabMVNO",
      "hideTabAVTOSP",
      "hideTabPORTRET",
    ])
    .then((result) => {
      if (result.hideSPAS == true) {
        hideSPAS();
      }
      if (result.hideTabIPTV == true) {
        hideAgreementTab("Агентское IPTV");
      }
      if (result.hideTabMVNO == true) {
        hideAgreementTab("MVNO");
      }
      if (result.hideTabAVTOSP == true) {
        hideAgreementTab("АвтоСП");
      }
      if (result.hideTabPORTRET == true) {
        hideAgreementTab("Портрет клиента");
      }
    });
}

function hideSPAS() {
  var top3_button = document.getElementsByClassName(
    "btn btn-primary top_3_butt btn-xs"
  )[0];
  if (top3_button) {
    top3_button.click();
  }
}

function hideAgreementTab(tabName) {
  const listItems = document.querySelectorAll(".tabs_new");

  // Проходимся по каждой вкладке <li>
  listItems.forEach(function (item) {
    // Проверяем содержит ли элемент <li> нужный текст из tabName
    if (item.textContent.trim() === tabName) {
      // Удаляем элемент <li> с нужным текстом
      item.remove();
    }
  });
}

function hideAgreementTopButton(buttonName) {
  const boldElements = document.querySelectorAll("b");

  // Проходимся по каждой вкладке <b>
  boldElements.forEach(function (item) {
    // Проверяем содержит ли элемент <b> нужный текст из tabName
    const linkElement = item.querySelector("a");
    if (linkElement && linkElement.textContent.trim() === buttonName) {
      // Remove the <b> element from the DOM
      item.remove();
    }
  });
}
