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
      "hideTabABONEMENT",
      "hideTabPL",
      "hideTabPayments",
      "hideTabInvoices",
      "hideTabAutopayment",
      "diagnosticNew",
      "specialOffers",
      "balanceLimit",
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
      if (result.hideTabABONEMENT == true) {
        hideAgreementTab("Абонемент");
      }
      if (result.hideTabPL == true) {
        hideAgreementTab("Новая ПЛ");
      }
      if (result.hideTabInvoices == true) {
        hideAgreementTab("Счета");
      }
      if (result.hideTabPayments == true) {
        hideAgreementTab("Платежи");
      }
      if (result.hideTabAutopayment == true) {
        hideAgreementTab("Карты и автоплатеж");
      }
      if (result.diagnosticNew == true) {
        hideAgreementTab("Диагностика (new)");
      }
      if (result.specialOffers == true) {
        hideAgreementTab("Спецпредложения");
      }
      if (result.balanceLimit == true) {
        hideAgreementTab("Ограничение по балансу");
      }
    });
}

// Скрытие СПАСа
function hideSPAS() {
  var button = document.getElementsByClassName(
    "btn btn-primary top_3_butt btn-xs"
  )[0];

  // Своваричаем предвосхищение
  document.getElementById("collapse-top-3").className = "collapse";
  button.append(" | Поиск СПАСа");
  button.style.backgroundColor = "#696969";

  // Отслеживаем изменения в СПАСе
  function checkForSPAS(node) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.classList.contains("spas_body")
    ) {
      button.style.backgroundColor = "#cc3300";
      button.innerHTML = "Топ 3 | СПАС есть";
      observer.disconnect();
      clearTimeout(timeoutId);
    }
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForSPAS);
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Таймер подгрузки СПАСа 2 секунды
  const timeoutId = setTimeout(() => {
    button.style.backgroundColor = "#008000";
    button.innerHTML = "Топ 3 | СПАСа нет";
    observer.disconnect();
  }, 2000);
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
