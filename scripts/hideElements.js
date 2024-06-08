if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
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
        if (result.hideTabDiagnosticNew == true) {
          hideAgreementTab("Диагностика (new)");
        }
        if (result.hideTabSpecialOffers == true) {
          hideAgreementTab("Спецпредложения");
        }
        if (result.hideTabBalanceLimit == true) {
          hideAgreementTab("Ограничение по балансу");
        }
        if (result.hideTabMNP == true) {
          hideAgreementTab("hideTabMNP");
        }
        if (result.hideTabMainSales == true) {
          hideAgreementTab("Основные продажи");
        }
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
        if (result.hideTabDiagnosticNew == true) {
          hideAgreementTab("Диагностика (new)");
        }
        if (result.hideTabSpecialOffers == true) {
          hideAgreementTab("Спецпредложения");
        }
        if (result.hideTabBalanceLimit == true) {
          hideAgreementTab("Ограничение по балансу");
        }
        if (result.hideTabMNP == true) {
          hideAgreementTab("MNP");
        }
        if (result.hideTabMainSales == true) {
          hideAgreementTab("Основные продажи");
        }
      }
    );
  }
}

// Скрытие предвосхищения
function hideSPAS() {
  var button = document.getElementsByClassName(
    "btn btn-primary top_3_butt btn-xs"
  )[0];
  button.textContent = "Помощник";

  // Своваричаем предвосхищение
  document.getElementById("collapse-top-3").className = "collapse";

  const observerSPAS = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForSPAS);
      }
    }
  });

  const observerAccess = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForAccess);
      }
    }
  });

  const observerAccident = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForAccident);
      }
    }
  });

  const observerSpecial = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForSpecial);
      }
    }
  });

  var problems = 0;

  // СПАС
  spas = document.querySelector(".spas_body");
  if (spas) {
    button.innerHTML += " | СПАС";
    button.style.backgroundColor = "#cc3300";
    problems++;
  } else {
    function checkForSPAS(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("spas_body")
      ) {
        button.innerHTML += " | СПАС";
        button.style.backgroundColor = "#cc3300";
        problems++;
        observerSPAS.disconnect();
        clearTimeout(timeoutSPASId);
      }
    }
    observerSPAS.observe(document.body, { childList: true, subtree: true });
    const timeoutSPASId = setTimeout(() => {
      observerSPAS.disconnect();
    }, 3000);
  }

  // Закрытый доступ
  access = document.querySelectorAll(".bl_antic_head_w");
  if (access) {
    access.forEach((element) => {
      if (element.textContent.trim() === "Доступ отсутствует") {
        button.innerHTML += " | Доступ";
        button.style.backgroundColor = "#cc3300";
        problems++;
      }
    });
  } else {
    function checkForAccess(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "Доступ отсутствует") {
          button.innerHTML += " | Доступ";
          button.style.backgroundColor = "#cc3300";
          problems++;
          observerAccess.disconnect();
          clearTimeout(timeoutAccessId);
        }
      }
    }
    observerAccess.observe(document.body, { childList: true, subtree: true });
    const timeoutAccessId = setTimeout(() => {
      observerAccess.disconnect();
    }, 3000);
  }

  // Авария
  accident = document.querySelectorAll(".bl_antic_head_w");
  if (accident) {
    accident.forEach((element) => {
      if (element.textContent.trim() === "Аварии на адресе") {
        button.innerHTML += " | Авария";
        button.style.backgroundColor = "#cc3300";
        problems++;
      }
    });
  } else {
    function checkForAccident(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "Аварии на адресе") {
          button.innerHTML += " | Авария";
          button.style.backgroundColor = "#cc3300";
          problems++;
          observerAccess.disconnect();
          clearTimeout(timeoutAccidentId);
        }
      }
    }
    observerAccident.observe(document.body, { childList: true, subtree: true });
    const timeoutAccidentId = setTimeout(() => {
      observerAccident.disconnect();
    }, 3000);
  }

  // Особый клиент
  special = document.querySelectorAll(".bl_antic_head_w");
  if (special) {
    special.forEach((element) => {
      if (element.textContent.trim() === "Особый Клиент") {
        button.innerHTML += " | Особый";
        button.style.backgroundColor = "#cc3300";
        problems++;
      }
    });
  } else {
    function checkForSpecial(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "Особый Клиент") {
          button.innerHTML += " | Особый";
          button.style.backgroundColor = "#cc3300";
          problems++;
          observerSpecial.disconnect();
          clearTimeout(timeoutSpecialId);
        }
      }
    }
    observerSpecial.observe(document.body, { childList: true, subtree: true });
    const timeoutSpecialtId = setTimeout(() => {
      timeoutSpecialtId.disconnect();
    }, 3000);
  }

  if (problems == 0) {
    button.style.backgroundColor = "#008000";
  }
}

// Скрытие кнопок договора
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

// Скрытие ссылок в хедере АРМа
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
