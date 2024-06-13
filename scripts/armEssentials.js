if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
  copyAddress();
  copyClientCard();
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

function copyTextToClipboard(text) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
  } catch (err) {
    console.error("Oops, unable to copy", err);
  }
  document.body.removeChild(textarea);
}

// TODO пофиксить копирование с абзацем
function copyAddress() {
  var address_text = document.getElementById("dr").innerText;
  if (!address_text) {
    address_text = document.getElementById("#dr").innerText;
  }

  // Проверка наличия индекса
  const postcode_regex = /\d{6}|\d{3}/;
  const match = address_text.match(postcode_regex);
  if (match) {
    const postalCode = match[0] + ", ";
    address_text = address_text = address_text.replace(postalCode, "").trim();
  }

  // Поиск клетки Адрес для добавления кнопки
  const address = document.querySelector("#dr").previousElementSibling;
  var lineBreak = document.createElement("br");

  // Обманка АРМа, чтобы не думал, что это кнопка
  var copyButton = document.createElement("button");
  copyButton.textContent = "Копировать адрес";
  copyButton.classList.add("btn", "btn-primary", "btn-sm"); // Добавляем классы для стилизации

  // Отслеживание кликов на кнопку для копирования текста
  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    copyTextToClipboard(address_text);
    $.notify("Адрес скопирован", "success");
  });

  address.appendChild(lineBreak);
  address.appendChild(copyButton);
}

function copyClientCard() {
  var clientCardRow = document.getElementById("namcl");
  var clientCardShowButton = document.getElementById("write_let");

  // Раскрываем карточку
  clientCardShowButton.click();

  var clienCardText = $("#to_copy").val();

  // Скрываем карточки
  clientCardShowButton.click();

  const clientCard = clientCardRow.previousElementSibling;
  var lineBreak = document.createElement("br");

  // Обманка АРМа, чтобы не думал, что это кнопка
  var copyButton = document.createElement("button");
  copyButton.textContent = "Копировать карточку";
  copyButton.classList.add("btn", "btn-primary", "btn-sm"); // Добавляем классы для стилизации

  // Отслеживание кликов на кнопку для копирования текста
  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    copyTextToClipboard(clienCardText);
    $.notify("Карточка скопирована", "success");
  });

  clientCard.appendChild(lineBreak);
  clientCard.appendChild(copyButton);
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
