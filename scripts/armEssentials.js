if (document.URL.indexOf("wcc2_main.frame_left_reasons") != -1) {
  const ARM_config = {
    ARM_changeRequestFastButtonsLeftFrame: fastButtonsARM,
  };

  browser.storage.sync.get(Object.keys(ARM_config)).then((result) => {
    Object.keys(ARM_config).forEach((key) => {
      if (result[key]) {
        ARM_config[key]();
      }
    });
  });
}

if (
  document.URL.includes("db.ertelecom.ru/cgi-bin/ppo/excells/adv_act_retention")
) {
  moveAccidentCompensation();
}

if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
  const TABS_config = {
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

  const ARM_config = {
    ARM_hideSPAS: hideSPAS,
    ARM_copyClientAddress: copyClientAddress,
    ARM_copyClientCard: copyClientCard,
    ARM_copyClientAgreement: copyClientAgreement,
    ARM_showHelperSMSButtons: smsButtons,
    ARM_checkForSpecialClient: checkForSpecialClient,
  };

  browser.storage.sync.get(Object.keys(TABS_config)).then((result) => {
    const tabsToDelete = [];

    Object.keys(TABS_config).forEach((key) => {
      if (result[key]) {
        tabsToDelete.push(TABS_config[key]);
      }
    });

    console.log(TABS_config);
    deleteTabs(tabsToDelete);
  });

  browser.storage.sync
    .get(Object.keys(ARM_config))
    .then((result) => {
      Object.keys(ARM_config).forEach((key) => {
        if (result[key]) {
          ARM_config[key]();
        }
      });
    })
    .catch((error) => {
      console.error("Ошибка при получении настроек:", error);
    });

  setHelperAnticipation();
}

if (
  document.URL.includes(
    "db.ertelecom.ru/cgi-bin/ppo/excells/wcc_request_appl_support.change_request_appl"
  )
) {
  showClientAgreementOnChangeRequest();

  const ARM_config = {
    ARM_checkWrongTransfer: wrongTransferFalse,
    ARM_checkSetToMe: removeSetForMe,
    ARM_copyTimeSlots: copyTimeSlots,
    ARM_changeRequestFastButtons: fastButtonsRequests,
  };

  browser.storage.sync.get(Object.keys(ARM_config)).then((result) => {
    Object.keys(ARM_config).forEach((key) => {
      if (result[key]) {
        ARM_config[key]();
      }
    });
  });
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
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Удаление вкладок] Вкладки удалены: ${tabList}`
  );
}

function checkForSpecialClient() {
  const observerSpecial = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForSpecial);
      }
    }
  });

  special = document.querySelectorAll(".bl_antic_head_w");
  if (special) {
    special.forEach((element) => {
      if (element.textContent.trim() === "Особый Клиент") {
        alert("Внимание! Особый клиент!");
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Особый клиент] Найден особый клиент`
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
          alert("Внимание! Особый клиент!");

          observerSpecial.disconnect();
          clearTimeout(timeout);

          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Особый клиент] Найден особый клиент`
          );
        }
      }
    }
    observerSpecial.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerSpecial.disconnect();
    }, 3000);
  }
}

// Замена предвосхищения
function setHelperAnticipation() {
  var button = document.querySelector(".top_3_butt");
  if (button.textContent.includes("Помощник")) {
    return;
  }
  button.textContent = "Помощник";

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

function hideSPAS() {
  // Своваричаем предвосхищение
  document.getElementById("collapse-top-3").className = "collapse";
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

function copyClientAddress() {
  if (document.querySelector(".helper-address") != null) {
    return;
  }
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
  copyButton.classList.add("btn", "btn-primary", "btn-sm", "helper-address"); // Добавляем классы для стилизации

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
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Копирование адреса] Добавлена кнопка копирования адреса`
  );
}

function copyClientCard() {
  if (document.querySelector(".helper-card") != null) {
    return;
  }
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
  copyButton.classList.add("btn", "btn-primary", "btn-sm", "helper-card"); // Добавляем классы для стилизации

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
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Копирование карточки] Добавлена кнопка копирования карточки`
  );
}

function copyClientAgreement() {
  if (document.querySelector(".helper-agreement") != null) {
    return;
  }
  var agreementTab = document.getElementById("agr_with_type");
  var agreementBeforeTab = agreementTab.previousElementSibling;
  var agreement_number = agreementTab.getElementsByTagName("b")[0];

  var lineBreak = document.createElement("br");
  var copyButton = document.createElement("button");
  copyButton.textContent = "📋 Договор";
  copyButton.classList.add("btn", "btn-primary", "btn-sm", "helper-agreement"); // Добавляем классы для стилизации

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
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Копирование договора] Добавлена кнопка копирования договора`
  );
}

function copyTimeSlots() {
  function formatOptions(options) {
    return options
      .map((option) => {
        if (
          !option.value ||
          option.text.includes("Выберите время") ||
          option.text.includes("«Абонент не может быть дома!»")
        )
          return null; // Пропускаем элемент "Выберите время"
        let timeValue = option.value.split(" ")[1];
        if (timeValue) {
          const [hours, minutes] = timeValue.split(":");
          const endHour = (parseInt(hours) + 1).toString().padStart(2, "0");
          return `${hours}-${endHour}`;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");
  }

  const observer = new MutationObserver((mutations, obs) => {
    const targetNode = document.getElementById("uni_tech_time_req");

    if (targetNode) {
      // Проверяем, существует ли кнопка рядом с целевым элементом
      if (
        !targetNode.nextElementSibling ||
        !targetNode.nextElementSibling.classList.contains("btn")
      ) {
        const button = document.createElement("button");
        button.setAttribute("class", "btn btn-sm btn-primary helper");
        button.textContent = "📋 Слоты";
        button.style.marginLeft = "10px";
        button.style.display = "inline-block";

        button.addEventListener("click", () => {
          const formattedOptions = formatOptions(
            Array.from(targetNode.options).filter(
              (option) => option.value && option.classList.contains("time_one")
            )
          );
          navigator.clipboard.writeText(formattedOptions).then(() => {
            $.notify("Слоты скопированы", "success");
            console.log("Скопировано в буфер обмена");
          });
        });

        // Вставляем кнопку справа от целевого элемента
        targetNode.insertAdjacentElement("afterend", button);
        targetNode.parentNode.style.display = "flex";
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function showClientAgreementOnChangeRequest() {
  headerText = document.querySelector(".text-primary");
  headerText.innerText = `Обращение по договору №${
    document.querySelector('input[name="agr_num"]').value
  }`;
}

function smsButtons() {
  const sendButton = $(".tab-content .send_sms_from_info .sms_web_a");
  const changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });

  const buttonContainer = $(
    '<div class="button-container" style="display: flex; flex-wrap: wrap; margin-top: 6px; gap: 6px;"></div>'
  );

  const static_btn = $(
    '<input type="button" value="🔑 Static" class="btn btn-primary btn-sm helper"/>'
  );
  const pppoe_btn = $(
    '<input type="button" value="🔑 PPPoE" class="btn btn-primary btn-sm helper"/>'
  );
  const lk_btn = $(
    '<input type="button" value="🔐 ЛК" class="btn btn-primary btn-sm helper"/>'
  );
  const pay_btn = $(
    '<input type="button" value="💸 Оплата" class="btn btn-primary btn-sm helper"/>'
  );

  static_btn.on("click", function () {
    $(".type_sms_a").val(27);
    $(".type_sms_a")[0].dispatchEvent(changeEvent);
  });

  pppoe_btn.on("click", function () {
    $(".type_sms_a").val(25);
    $(".type_sms_a")[0].dispatchEvent(changeEvent);
  });

  lk_btn.on("click", function () {
    $(".type_sms_a").val(26);
    $(".type_sms_a")[0].dispatchEvent(changeEvent);
  });

  pay_btn.on("click", function () {
    $(".type_sms_a").val(24);
    $(".type_sms_a")[0].dispatchEvent(changeEvent);
  });

  function addButtonIfExists(button, value) {
    if (
      $(".type_sms_a option[value='" + value + "']").length &&
      $(".helper[value='" + button.val() + "']").length === 0
    ) {
      buttonContainer.append(button);
    }
  }

  addButtonIfExists(pay_btn, 24);
  addButtonIfExists(lk_btn, 26);
  addButtonIfExists(pppoe_btn, 25);
  addButtonIfExists(static_btn, 27);

  // Перемещение кнопок под элемент select
  $(".type_sms_a").after(buttonContainer);
}

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

  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Убрано назначение обращения на себя`
  );
}

function fastButtonsRequests() {
  if (document.querySelector(".helper") != null) {
    return;
  }

  var changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });
  // Находим кнопку изменения обращения
  const existingButton = document.getElementById("update_request_appl");

  // Создаем текстовые узлы с пробелами
  const space1 = document.createTextNode(" ");
  const space2 = document.createTextNode(" ");
  const space3 = document.createTextNode(" ");
  const space4 = document.createTextNode(" ");
  const space5 = document.createTextNode(" ");
  const space6 = document.createTextNode(" ");

  // Кнопка Онлайн-Вход-КС
  const online_cs = document.createElement("input");
  online_cs.setAttribute("type", "button");
  online_cs.setAttribute("class", "btn btn-sm btn-info helper");
  online_cs.setAttribute("value", "КС - НЦК1");

  // Кнопка ОЦТП-Исход-КС
  const octp_cs = document.createElement("input");
  octp_cs.setAttribute("type", "button");
  octp_cs.setAttribute("class", "btn btn-sm btn-info helper");
  octp_cs.setAttribute("value", "КС - НЦК2");

  // Кнопка ТС/ААО
  const ts_aao = document.createElement("input");
  ts_aao.setAttribute("type", "button");
  ts_aao.setAttribute("class", "btn btn-sm btn-danger helper");
  ts_aao.setAttribute("value", "ТС - ААО");

  // Кнопка НРД - Исход
  const nrd_ishod = document.createElement("input");
  nrd_ishod.setAttribute("type", "button");
  nrd_ishod.setAttribute("class", "btn btn-sm btn-danger helper");
  nrd_ishod.setAttribute("value", "НРД - Исход");

  // Кнопка НТП - Исход
  const ntp_ishod = document.createElement("input");
  ntp_ishod.setAttribute("type", "button");
  ntp_ishod.setAttribute("class", "btn btn-sm btn-warning helper");
  ntp_ishod.setAttribute("value", "НТП - Исход");

  // Кнопка Абон - Исход
  const abon_ishod = document.createElement("input");
  abon_ishod.setAttribute("type", "button");
  abon_ishod.setAttribute("class", "btn btn-sm btn-warning helper");
  abon_ishod.setAttribute("value", "Абон - Исход");

  online_cs.addEventListener("click", handleOnlineCSClick);
  octp_cs.addEventListener("click", handleOCTPCSClick);
  ts_aao.addEventListener("click", handleTSAAOClick);
  nrd_ishod.addEventListener("click", handleNRDClick);
  ntp_ishod.addEventListener("click", handleNTPIshodClick);
  abon_ishod.addEventListener("click", handleAbonIshodClick);

  // Вставляем новую кнопку после существующей кнопки
  existingButton.before(
    nrd_ishod,
    space6,
    ts_aao,
    space5,
    abon_ishod,
    space4,
    ntp_ishod,
    space3,
    online_cs,
    space2,
    octp_cs,
    space1
  );

  function handleOnlineCSClick() {
    step = document.querySelector("#change_step_id");
    objReason = document.querySelector(".uni_load_obj_reason");
    let exists = false;

    for (let option of step.options) {
      if (option.text === "Онлайн - Входящая связь") {
        exists = true;

        break;
      }
    }
    if (!exists) {
      $.notify("Смена классификатора на Онлайн - Входящая связь недоступна");
      return;
    }

    if (document.getElementById("change_class").checked === false) {
      document.getElementById("change_class").click();
    }

    if (step.value != "2296") {
      step.value = "2296";
      step.dispatchEvent(changeEvent);

      const observer = new MutationObserver((mutations) => {
        const objReason = document.querySelector(".uni_load_obj_reason");
        if (objReason) {
          observer.disconnect();
          setTimeout(function () {
            objReason.value = "2123";
            objReason.dispatchEvent(changeEvent);
          }, 400);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на Онлайн вход - КС`
    );

    $.notify("Обращение изменено: Онлайн вход - КС", "success");
  }

  function handleOCTPCSClick() {
    step = document.querySelector("#change_step_id");
    objReason = document.querySelector(".uni_load_obj_reason");
    let exists = false;

    for (let option of step.options) {
      if (option.text === "ОЦТП - Исходящая связь") {
        exists = true;

        break;
      }
    }
    if (!exists) {
      $.notify("Смена классификатора на ОЦТП - Исходящая связь недоступна");
      return;
    }

    if (document.getElementById("change_class").checked === false) {
      document.getElementById("change_class").click();
      $("tr.classifier_line").removeAttr("hidden").removeAttr("style");
    }

    if (step.value != "1520") {
      step.value = "1520";
      step.dispatchEvent(changeEvent);

      const observer = new MutationObserver((mutations) => {
        $("tr.classifier_line").removeAttr("hidden").removeAttr("style");
        const objReason = document.querySelector(".uni_load_obj_reason");
        if (objReason) {
          observer.disconnect();
          setTimeout(function () {
            objReason.value = "2123";
            objReason.dispatchEvent(changeEvent);
          }, 400);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на ОЦТП Исход - КС`
    );
    $.notify("Обращение изменено на ОЦТП Исход - КС", "success");
  }

  function handleTSAAOClick() {
    step = document.querySelector("#change_step_id");
    objReason = document.querySelector(".uni_load_obj_reason");
    let exists = false;

    for (let option of step.options) {
      if (option.text === "Передано ТС/ААО") {
        exists = true;

        break;
      }
    }
    if (!exists) {
      $.notify("Смена классификатора на Передано ТС/ААО недоступна");
      return;
    }
    $("tr.classifier_line").removeAttr("hidden").removeAttr("style");

    if (document.getElementById("change_class").checked === false) {
      document.getElementById("change_class").click();
    }

    if (step.value != "1056") {
      step.value = "1056";
      step.dispatchEvent(changeEvent);

      const observer = new MutationObserver((mutations) => {
        const objReason = document.querySelector(".uni_load_obj_reason");
        if (objReason) {
          observer.disconnect();
          setTimeout(function () {
            objReason.value = "1046";
            objReason.dispatchEvent(changeEvent);
          }, 400);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на ТС/ААО`
    );
    $.notify("Обращение изменено на ТС/ААО", "success");
  }

  function handleNRDClick() {
    step = document.querySelector("#change_step_id");
    let exists = false;

    for (let option of step.options) {
      if (option.text === "Направление сохранения Клиентов - Исходящая связь") {
        exists = true;

        break;
      }
    }
    if (!exists) {
      $.notify(
        "Смена классификатора на Передано Направление сохранения Клиентов - Исходящая связь недоступна"
      );
      return;
    }
    $("tr.classifier_line").removeAttr("hidden").removeAttr("style");

    if (document.getElementById("change_class").checked === false) {
      document.getElementById("change_class").click();
    }

    if (step.value != "1521") {
      step.value = "1521";
      step.dispatchEvent(changeEvent);

      const observer = new MutationObserver((mutations) => {
        const objReason = document.querySelector(".uni_load_obj_reason");
        if (objReason) {
          observer.disconnect();
          setTimeout(function () {
            objReason.value = "2286";
            objReason.dispatchEvent(changeEvent);
          }, 400);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на НРД - Исход`
    );
    $.notify("Обращение изменено на НРД - Исход", "success");
  }

  function handleNTPIshodClick() {
    step = document.querySelector("#change_step_id");
    objReason = document.querySelector(".uni_load_obj_reason");
    let exists = false;

    for (let option of step.options) {
      if (option.text === "НТП первая линия - Исходящая связь") {
        exists = true;

        break;
      }
    }
    if (!exists) {
      $.notify("Смена классификатора на НТП - Исход недоступна");
      return;
    }
    $("tr.classifier_line").removeAttr("hidden").removeAttr("style");

    if (document.getElementById("change_class").checked === false) {
      document.getElementById("change_class").click();
    }

    if (step.value != "2277") {
      step.value = "2277";
      step.dispatchEvent(changeEvent);

      const observer = new MutationObserver((mutations) => {
        const objReason = document.querySelector(".uni_load_obj_reason");
        if (objReason) {
          observer.disconnect();
          setTimeout(function () {
            objReason.value = "1046";
            objReason.dispatchEvent(changeEvent);
          }, 400);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на НТП - Исход`
    );
    $.notify("Обращение изменено на НТП - Исход", "success");
  }

  function handleAbonIshodClick() {
    step = document.querySelector("#change_step_id");
    let exists = false;

    for (let option of step.options) {
      if (option.text === "ОКЦ - Исходящая связь") {
        exists = true;

        break;
      }
    }
    if (!exists) {
      $.notify("Смена классификатора на ОКЦ - Исходящая связь недоступна");
      return;
    }
    $("tr.classifier_line").removeAttr("hidden").removeAttr("style");

    if (document.getElementById("change_class").checked === false) {
      document.getElementById("change_class").click();
    }

    if (step.value != "616") {
      step.value = "616";
      step.dispatchEvent(changeEvent);
    }

    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Обращения] Обращение изменено на Абон - Исход`
    );
    $.notify("Обращение изменено на Абон - Исход", "success");
  }
}

function fastButtonsARM() {
  if (document.querySelector(".helper") != null) {
    return;
  }
  const container = document.querySelector(".create_request_block");

  // Создаем новые кнопки
  const buttons = [
    {
      value: "Авария",
      class: "btn btn-sm btn-info helper",
      action: handleAccident,
    },
    {
      value: "ВХОД НРД",
      class: "btn btn-sm btn-info helper",
      action: handleNRD,
    },
    {
      value: "СЗВГ",
      class: "btn btn-sm btn-info helper",
      action: handleSZVG,
    },
    {
      value: "КС НЦК2",
      class: "btn btn-sm btn-info helper",
      action: handleKСNCK2Click,
    },
    {
      value: "КС НЦК1",
      class: "btn btn-sm btn-info helper",
      action: handleKСNCK1Click,
    },
  ];

  // Вставляем кнопки в начало контейнера
  buttons.forEach((button) => {
    const btnElement = document.createElement("input");
    btnElement.setAttribute("type", "button");
    btnElement.setAttribute("class", button.class);
    btnElement.setAttribute("value", button.value);
    btnElement.addEventListener("click", button.action);

    btnElement.style.backgroundColor = "#337ab7";
    btnElement.style.color = "white";

    // Вставляем кнопку в начало блока
    container.insertAdjacentElement("afterbegin", btnElement);

    // Вставляем пробел как текстовый узел
    container.insertAdjacentText("afterbegin", " ");
  });

  var changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });

  function waitForElement(selector, callback) {
    const observer = new MutationObserver((mutationsList, observer) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect(); // Отключаем наблюдателя, когда элемент найден
        callback(element);
      }
    });

    // Наблюдаем за изменениями в документе
    observer.observe(document, { childList: true, subtree: true });
  }

  function handleAccident() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1125";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "4110";
      substep.dispatchEvent(changeEvent);
    });
  }
  function handleNRD() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "1195";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "2286";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSZVG() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "383";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1044";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "4171";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleKСNCK1Click() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "2123";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleKСNCK2Click() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "1520";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "2123";
      substep.dispatchEvent(changeEvent);
    });
  }
}

function moveAccidentCompensation() {
  const tableBody = document.querySelector("tbody");

  const rows = tableBody.querySelectorAll("tr");
  let targetRow;

  rows.forEach((row) => {
    const cell = row.querySelector("th");
    if (cell && cell.textContent.includes("Компенсация за аварию")) {
      targetRow = row;
    }
  });

  if (targetRow) {
    tableBody.insertBefore(targetRow, rows[1]);
  }
}
