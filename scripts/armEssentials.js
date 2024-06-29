if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
  const ARM_config = {
    ARM_hideSPAS: "hideSPAS",
    ARM_hideTabIPTV: "Агентское IPTV",
    ARM_hideTabMVNO: "MVNO",
    ARM_hideTabAVTOSP: "АвтоСП",
    ARM_hideTabPORTRET: "Портрет клиента",
    ARM_hideTabABONEMENT: "Абонемент",
    ARM_hideTabPL: "Новая ПЛ",
    ARM_hideTabInvoices: "Счета",
    ARM_hideTabPayments: "Платежи",
    ARM_hideTabAutopayment: "Карты и автоплатеж",
    ARM_hideTabDiagnostic: "Диагностика",
    ARM_hideTabDiagnosticNew: "Диагностика (new)",
    ARM_hideTabSpecialOffers: "Спецпредложения",
    ARM_hideTabBalanceLimit: "Ограничение по балансу",
    ARM_hideTabMNP: "MNP",
    ARM_hideTabMainSales: "Основные продажи",
    ARM_hideTabLoans: "Кредиты",
  };

  browser.storage.local.get(Object.keys(ARM_config)).then((result) => {
    if (result.ARM_hideSPAS) {
      hideSPAS();
    }

    const tabsToDelete = Object.keys(ARM_config)
      .filter((key) => result[key])
      .map((key) => ARM_config[key]);

    deleteTabs(tabsToDelete);
  });

  copyAddress();
  copyClientCard();
  copyClientAgreement();
}

if (
  document.URL.includes(
    "db.ertelecom.ru/cgi-bin/ppo/excells/wcc_request_appl_support.change_request_appl"
  )
) {
  dutyButtons();

  browser.storage.local
    .get(["ARM_checkWrongTransfer", "ARM_checkSetToMe"])
    .then((result) => {
      if (result.ARM_checkWrongTransfer) wrongTransferFalse();
      if (result.ARM_checkSetToMe) removeSetForMe();
    });

  function wrongTransferFalse() {
    const radioButton = document.querySelector(
      'input[type="radio"][name="wrongTransfer"][value="0"]'
    );
    if (radioButton) {
      radioButton.removeAttribute("disabled");
      radioButton.click();
      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Отмечено как не ошибочное`
      );
    }
  }

  function removeSetForMe() {
    const checkbox = document.getElementById("chb_set_to_me");
    checkbox.removeAttribute("disabled");
    checkbox.checked = false;
  }

  function dutyButtons() {
    var changeEvent = new Event("change", {
      bubbles: true,
      cancelable: true,
    });
    // TODO дубль, нет вещания, неоткрывашки
    // Находим кнопку изменения обращения
    const existingButton = document.getElementById("update_request_appl");

    // Создаем текстовые узлы с пробелами
    const space1 = document.createTextNode(" ");
    const space2 = document.createTextNode(" ");

    // Кнопка Онлайн-Вход-КС
    const online_cs = document.createElement("input");
    online_cs.setAttribute("type", "button");
    online_cs.setAttribute("class", "btn btn-sm btn-danger");
    online_cs.setAttribute("value", "КС - НЦК1");

    // Кнопка ОЦТП-Исход-КС
    const octp_cs = document.createElement("input");
    octp_cs.setAttribute("type", "button");
    octp_cs.setAttribute("class", "btn btn-sm btn-danger");
    octp_cs.setAttribute("value", "КС - НЦК2");

    online_cs.addEventListener("click", handleOnlineCSClick);
    octp_cs.addEventListener("click", handleOCTPCSClick);
    // Вставляем новую кнопку после существующей кнопки
    existingButton.before(online_cs, space1, octp_cs, space2);

    function handleOnlineCSClick() {
      document.getElementById("change_class").click();
      $("tr.classifier_line").removeAttr("hidden").removeAttr("style");
      $("#change_step_id").val(2296);
      objReason = document.querySelector(".uni_load_obj_reason");
      objReason.value = 2123;
      objReason.dispatchEvent(changeEvent);
      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на Онлайн вход - КС`
      );
      $.notify("Класс обращения изменен");
    }

    function handleOCTPCSClick() {
      document.getElementById("change_class").click();
      $("tr.classifier_line").removeAttr("hidden").removeAttr("style");
      $("#change_step_id").val(1520);
      objReason = document.querySelector(".uni_load_obj_reason");
      objReason.value = 2123;
      objReason.dispatchEvent(changeEvent);
      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на ОЦТП Исход - КС`
      );
      $.notify("Класс обращения изменен");
    }
  }
}

// Скрытие кнопок договора
function deleteTabs(tabList) {
  const listItems = document.querySelectorAll(".tabs_new");

  // Перебираем все вкладки и удаляем их, если их название совпадает с переданными в массиве tabNames
  listItems.forEach(function (item) {
    if (tabList.includes(item.textContent.trim())) {
      item.remove();
    }
  });
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Удаление вкладок] Вкладки удалены`
  );
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

  const observerPPR = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForPPR);
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
    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден СПАС`
    );
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
        clearTimeout(timeout);
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден СПАС`
        );
      }
    }
    observerSPAS.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
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
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден закрытый доступ`
        );
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
          clearTimeout(timeout);
          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден закрытый доступ`
          );
        }
      }
    }
    observerAccess.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
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
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найдена авария`
        );
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
          clearTimeout(timeout);
          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найдена авария`
          );
        }
      }
    }
    observerAccident.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerAccident.disconnect();
    }, 3000);
  }

  // ППР
  ppr = document.querySelectorAll(".bl_antic_head_w");
  if (accident) {
    accident.forEach((element) => {
      if (element.textContent.trim() === "ППР на адресе") {
        button.innerHTML += " | ППР";
        button.style.backgroundColor = "#cc3300";
        problems++;
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден ППР`
        );
      }
    });
  } else {
    function checkForPPR(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "ППР на адресе") {
          button.innerHTML += " | ППР";
          button.style.backgroundColor = "#cc3300";
          problems++;
          observerPPR.disconnect();
          clearTimeout(timeout);
          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден ППР`
          );
        }
      }
    }
    observerPPR.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerPPR.disconnect();
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
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден особый клиент`
        );
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
          clearTimeout(timeout);
          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Найден особый клиент`
          );
        }
      }
    }
    observerSpecial.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerSpecial.disconnect();
    }, 3000);
  }

  if (problems == 0) {
    button.style.backgroundColor = "#008000";
  }
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Предвосхищение] Предвосхищение загружено`
  );
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

function copyAddress() {
  try {
    var address_text = document.getElementById("dr").innerText;
  } catch (e) {
    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Копирование адреса] Не найдено поле адреса для копирования`
    );
    return;
  }
  if (!address_text) {
    address_text = document.getElementById("#dr").innerText;
  }

  // Проверка наличия индекса
  const postcode_regex = /\d{6}|\d{3}/;
  const substring_to_check = address_text.substring(0, 6); // Извлекаем первые 6 символов
  const match = substring_to_check.match(postcode_regex);
  if (match) {
    const postalCode = match[0] + ", ";
    address_text = address_text.replace(postalCode, "").trim();
  }

  // Поиск клетки Адрес для добавления кнопки
  const address = document.querySelector("#dr").previousElementSibling;
  var lineBreak = document.createElement("br");

  // Обманка АРМа, чтобы не думал, что это кнопка
  var copyButton = document.createElement("button");
  copyButton.textContent = "📋 Адрес";
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
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] Добавлена кнопка копирования адреса`
  );
}

function copyClientCard() {
  try {
    var clientCardRow = document.getElementById("namcl");
    var clientCardShowButton = document.getElementById("write_let");

    // Раскрываем карточку
    clientCardShowButton.click();
  } catch (e) {
    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Копирование карточки] Не найдена карточка клиента`
    );
    return;
  }

  var clienCardText = $("#to_copy").val();

  // Скрываем карточки
  clientCardShowButton.click();

  const clientCard = clientCardRow.previousElementSibling;
  var lineBreak = document.createElement("br");

  // Обманка АРМа, чтобы не думал, что это кнопка
  var copyButton = document.createElement("button");
  copyButton.textContent = "📋 Карточка";
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
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] Добавлена кнопка копирования карточки`
  );
}

function copyClientAgreement() {
  var agreementTab = document.getElementById("agr_with_type");
  var agreementBeforeTab = agreementTab.previousElementSibling;
  var agreement_number = agreementTab.getElementsByTagName("b")[0];

  var lineBreak = document.createElement("br");
  var copyButton = document.createElement("button");
  copyButton.textContent = "📋 Договор";
  copyButton.classList.add("btn", "btn-primary", "btn-sm"); // Добавляем классы для стилизации

  // Отслеживание кликов на кнопку для копирования текста
  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    copyTextToClipboard(agreement_number.textContent);
    $.notify("Номер договора скопирован", "success");
  });

  agreementBeforeTab.appendChild(lineBreak);
  agreementBeforeTab.appendChild(copyButton);
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] Добавлена кнопка копирования договора`
  );
}
