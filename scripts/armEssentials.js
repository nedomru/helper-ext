if (
  document.URL.indexOf(
    "db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id"
  ) != -1
) {
  const config = {
    ARM_filterClientSessions: initFilterClientSessions,
  };

  browser.storage.sync.get(Object.keys(config)).then((result) => {
    Object.keys(config).forEach((key) => {
      if (result[key]) {
        config[key]();
      }
    });
  });
  loadLastDayClientSessions();
}

if (
  document.URL.indexOf(
    "db.ertelecom.ru/cgi-bin/ppo/excells/radius_accounting_info.login_detail?id_session"
  ) != -1 ||
  document.URL.indexOf(
    "db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id"
  ) != -1
) {
  const ARM_config = {
    ARM_copySearchMAC: copyMAC,
  };

  browser.storage.sync.get(Object.keys(ARM_config)).then((result) => {
    Object.keys(ARM_config).forEach((key) => {
      if (result[key]) {
        ARM_config[key]();
      }
    });
  });
}

if (document.URL.indexOf("wcc2_main.frame_left_reasons") != -1) {
  const ARM_config = {
    ARM_changeRequestFBLF: fastButtonsLeftFrame,
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
    ARM_changeRequestFBCR: fastButtonsChangeRequest,
  };

  browser.storage.sync.get(Object.keys(ARM_config)).then((result) => {
    Object.keys(ARM_config).forEach((key) => {
      if (result[key]) {
        ARM_config[key]();
      }
    });
  });
}

async function deleteTabs(tabList) {
  const listItems = document.querySelectorAll(".tabs_new");

  const removePromises = Array.from(listItems).map(async (item) => {
    if (tabList.includes(item.textContent.trim())) {
      item.remove();
    }
  });

  await Promise.all(removePromises);

  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Удаление вкладок] Вкладки удалены: ${tabList}`
  );
}

async function checkForSpecialClient() {
  const observerSpecial = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForSpecial);
      }
    }
  });

  const checkSpecialClient = (element) => {
    if (element.textContent.trim() === "Особый Клиент") {
      alert("Внимание! Особый клиент!");
      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [АРМ] - [Особый клиент] Найден особый клиент`
      );
      observerSpecial.disconnect();
    }
  };

  const special = document.querySelectorAll(".bl_antic_head_w");
  if (special.length > 0) {
    special.forEach(checkSpecialClient);
  } else {
    observerSpecial.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerSpecial.disconnect();
    }, 3000);

    const checkForSpecial = (node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        checkSpecialClient(node);
      }
    };

    // Подключение для вызывания для существующих дочерних элементов
    const existingNodes = document.body.querySelectorAll(".bl_antic_head_w");
    existingNodes.forEach(checkSpecialClient);
  }
}

async function setHelperAnticipation() {
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

async function copyClientAddress() {
  const settings = await browser.storage.sync.get(
    "ARM_copyClientAddressWithoutCity"
  );

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

  if (settings.ARM_copyClientAddressWithoutCity) {
    const city_regex = /.*ул\./i;
    address_text = address_text.replace(city_regex, "").trim();
    const city_match = address_text.match(city_regex);
    if (city_match) {
      address_text = address_text.replace(city_regex, "$1").trim();
    }
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

function copyMAC() {
  if (document.querySelector(".helper-copy-mac") != null) {
    return;
  }
  const addCopyButtons = () => {
    const macAddressElements = document.querySelectorAll(
      ".mac, .js-get-vendor-by-mac"
    );

    macAddressElements.forEach((macAddressElement) => {
      if (
        !macAddressElement.nextElementSibling ||
        !macAddressElement.nextElementSibling.classList.contains(
          "helper-copy-mac"
        )
      ) {
        const macAddress = macAddressElement.innerText;
        const copyButton = document.createElement("button");
        copyButton.classList.add("helper-copy-mac");
        copyButton.innerText = "📋";
        copyButton.onclick = function (event) {
          event.preventDefault();
          event.stopPropagation();
          copyTextToClipboard(macAddress);
          $.notify("MAC-адрес скопирован", "success");
        };

        const searchButton = document.createElement("button");
        searchButton.classList.add("helper-copy-mac");
        searchButton.innerText = "🔎";
        searchButton.onclick = function (event) {
          event.preventDefault();
          event.stopPropagation();
          try {
            fetch(`https://api.maclookup.app/v2/macs/${macAddress}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => {
                if (response.status == 429) {
                  $.notify("Превышен лимит запросов (2 в сек)", "error");
                  return;
                } else if (response.status != 200) {
                  $.notify("Не удалось найти", "error");
                  return;
                }
                return response.json();
              })
              .then((result) => {
                if (result.found == false) {
                  $.notify("Не удалось найти MAC в базе", "error");
                  return;
                }
                const companyName = result.company;

                if (companyName) {
                  $.notify(companyName, "success");
                  document.getElementById("input-mac").value = "";
                }
              });
          } catch (error) {
            console.error("Fetch error:", error);
          }
        };

        const buttonContainer = document.createElement("span");
        buttonContainer.style.position = "relative";
        buttonContainer.style.marginLeft = "5px";
        buttonContainer.appendChild(copyButton);
        buttonContainer.appendChild(searchButton);

        macAddressElement.parentElement.appendChild(buttonContainer);
      }
    });
  };

  const setupObserver = () => {
    const targetNode = document.getElementById("js-res-app");
    const config = { childList: true, subtree: true };
    const callback = function (mutationsList) {
      let foundMacAddress = false;

      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          // Проверяем на наличие MAC-адресов
          foundMacAddress =
            document.querySelector(".mac, .js-get-vendor-by-mac") !== null;
          if (foundMacAddress) {
            addCopyButtons();
            observer.disconnect(); // Остановим наблюдатель
            break; // Прерываем цикл
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  };

  // Запускаем наблюдатель, если это нужная страница
  if (
    document.URL.includes(
      "db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id"
    )
  ) {
    setupObserver();
  } else {
    // Если страница уже загружена, сразу добавляем кнопки
    addCopyButtons();
  }
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

async function fastButtonsChangeRequest() {
  if (document.querySelector(".helper") != null) {
    return;
  }

  var changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });

  // Находим кнопку изменения обращения
  const existingButton = document.getElementById("update_request_appl");

  // Получение значений настроек
  const settingsKeys = [
    "ARM_changeRequestFBCR_Open_KCNCK1",
    "ARM_changeRequestFBCR_Open_KCNCK2",
    "ARM_changeRequestFBCR_Open_TS",
    "ARM_changeRequestFBCR_Open_NRD",
    "ARM_changeRequestFBCR_Open_NTPISH",
    "ARM_changeRequestFBCR_Open_ABONISH",
  ];

  const settings = await Promise.all(
    settingsKeys.map((key) => browser.storage.sync.get(key))
  );

  const buttons = [];

  if (settings[0].ARM_changeRequestFBCR_Open_KCNCK1) {
    const online_cs = document.createElement("input");
    online_cs.setAttribute("type", "button");
    online_cs.setAttribute("class", "btn btn-sm btn-info helper");
    online_cs.setAttribute("value", "КС - НЦК1");
    online_cs.addEventListener("click", handleOnlineCSClick);
    buttons.push(online_cs);
  }

  if (settings[1].ARM_changeRequestFBCR_Open_KCNCK2) {
    const octp_cs = document.createElement("input");
    octp_cs.setAttribute("type", "button");
    octp_cs.setAttribute("class", "btn btn-sm btn-info helper");
    octp_cs.setAttribute("value", "КС - НЦК2");
    octp_cs.addEventListener("click", handleOCTPCSClick);
    buttons.push(octp_cs);
  }

  if (settings[2].ARM_changeRequestFBCR_Open_TS) {
    const ts_aao = document.createElement("input");
    ts_aao.setAttribute("type", "button");
    ts_aao.setAttribute("class", "btn btn-sm btn-danger helper");
    ts_aao.setAttribute("value", "ТС - ААО");
    ts_aao.addEventListener("click", handleTSAAOClick);
    buttons.push(ts_aao);
  }

  if (settings[3].ARM_changeRequestFBCR_Open_NRD) {
    const nrd_ishod = document.createElement("input");
    nrd_ishod.setAttribute("type", "button");
    nrd_ishod.setAttribute("class", "btn btn-sm btn-danger helper");
    nrd_ishod.setAttribute("value", "НРД - Исход");
    nrd_ishod.addEventListener("click", handleNRDClick);
    buttons.push(nrd_ishod);
  }

  if (settings[4].ARM_changeRequestFBCR_Open_NTPISH) {
    const ntp_ishod = document.createElement("input");
    ntp_ishod.setAttribute("type", "button");
    ntp_ishod.setAttribute("class", "btn btn-sm btn-warning helper");
    ntp_ishod.setAttribute("value", "НТП - Исход");
    ntp_ishod.addEventListener("click", handleNTPIshodClick);
    buttons.push(ntp_ishod);
  }

  if (settings[5].ARM_changeRequestFBCR_Open_ABONISH) {
    const abon_ishod = document.createElement("input");
    abon_ishod.setAttribute("type", "button");
    abon_ishod.setAttribute("class", "btn btn-sm btn-warning helper");
    abon_ishod.setAttribute("value", "Абон - Исход");
    abon_ishod.addEventListener("click", handleAbonIshodClick);
    buttons.push(abon_ishod);
  }

  // Создаем текстовые узлы с пробелами для оформления кнопок
  const spaces = Array(6)
    .fill()
    .map(() => document.createTextNode(" "));

  // Вставляем новые кнопки после существующей кнопки
  const firstButton = existingButton;
  buttons.reduce((prev, curr, idx) => {
    prev.before(curr, spaces[idx]);
    return curr;
  }, firstButton);

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

async function fastButtonsLeftFrame() {
  if (document.querySelector(".helper") != null) {
    return;
  }

  const container = document.querySelector(".create_request_block");

  const settingsKeys = [
    "ARM_changeRequestFBLF_Closed_Accident",
    "ARM_changeRequestFBLF_Open_VhodNRD",
    "ARM_changeRequestFBLF_Open_SZVG",
    "ARM_changeRequestFBLF_Open_KCNCK2",
    "ARM_changeRequestFBLF_Open_KCNCK1",
    "ARM_changeRequestFBLF_Self_Balance",
    "ARM_changeRequestFBLF_Self_Priost",
    "ARM_changeRequestFBLF_Self_Activation",
    "ARM_changeRequestFBLF_Self_ChangeTP",
    "ARM_changeRequestFBLF_Self_PromisedPayment",
    "ARM_changeRequestFBLF_Self_SpeedBonus",
    "ARM_changeRequestFBLF_Self_WiFiKey",
    "ARM_changeRequestFBLF_Self_RouterSetup",
    "ARM_changeRequestFBLF_Self_RiseAP",
    "ARM_changeRequestFBLF_Self_KTV",
    "ARM_changeRequestFBLF_Self_ActivateKey",
    "ARM_changeRequestFBLF_Self_PIN",
    "ARM_changeRequestFBLF_Self_Zvonok",
    "ARM_changeRequestFBLF_Self_CameraVN",
    "ARM_changeRequestFBLF_Self_Pult",
    "ARM_changeRequestFBLF_Self_BadPult",
    "ARM_changeRequestFBLF_Closed_NoPages", // тут новое
    "ARM_changeRequestFBLF_Closed_NoSession",
    "ARM_changeRequestFBLF_Closed_LowSpeed",
    "ARM_changeRequestFBLF_Closed_Disconnections",
    "ARM_changeRequestFBLF_Closed_NoTV",
    "ARM_changeRequestFBLF_Open_Ticket",
    "ARM_changeRequestFBLF_Closed_Youtube",
    "ARM_changeRequestFBLF_Closed_CancelSZ",
  ];

  // Получение значений всех настроек

  const settings = await Promise.all(
    settingsKeys.map((key) => browser.storage.sync.get(key))
  );

  const buttons = [];

  // Проверка настроек и добавление кнопок
  if (settings[0][settingsKeys[0]]) {
    buttons.push({
      value: "Авария",
      class: "btn btn-sm btn-info helper",
      action: handleAccident,
    });
  }

  if (settings[1][settingsKeys[1]]) {
    buttons.push({
      value: "ВХОД НРД",
      class: "btn btn-sm btn-info helper",
      action: handleNRD,
    });
  }

  if (settings[2][settingsKeys[2]]) {
    buttons.push({
      value: "СЗВГ",
      class: "btn btn-sm btn-info helper",
      action: handleSZVG,
    });
  }

  if (settings[3][settingsKeys[3]]) {
    buttons.push({
      value: "КС НЦК2",
      class: "btn btn-sm btn-info helper",
      action: handleKСNCK2Click,
    });
  }

  if (settings[4][settingsKeys[4]]) {
    buttons.push({
      value: "КС НЦК1",
      class: "btn btn-sm btn-info helper",
      action: handleKСNCK1Click,
    });
  }

  if (settings[5][settingsKeys[5]]) {
    buttons.push({
      value: "СО Баланс",
      class: "btn btn-sm btn-info helper",
      action: handleSS_Balance,
    });
  }

  if (settings[6][settingsKeys[6]]) {
    buttons.push({
      value: "СО Приост",
      class: "btn btn-sm btn-info helper",
      action: handleSS_Priost,
    });
  }

  if (settings[7][settingsKeys[7]]) {
    buttons.push({
      value: "СО Активация ТП",
      class: "btn btn-sm btn-info helper",
      action: handleSS_Activation,
    });
  }

  if (settings[8][settingsKeys[8]]) {
    buttons.push({
      value: "СО Смена ТП",
      class: "btn btn-sm btn-info helper",
      action: handleSS_ChangeTP,
    });
  }

  if (settings[9][settingsKeys[9]]) {
    buttons.push({
      value: "СО Обещ. платеж",
      class: "btn btn-sm btn-info helper",
      action: handleSS_PromisedPayment,
    });
  }

  if (settings[10][settingsKeys[10]]) {
    buttons.push({
      value: "СО Скорост. бонус",
      class: "btn btn-sm btn-info helper",
      action: handleSS_SpeedBonus,
    });
  }

  if (settings[11][settingsKeys[11]]) {
    buttons.push({
      value: "СО Ключ сети",
      class: "btn btn-sm btn-info helper",
      action: handleSS_WiFiKey,
    });
  }

  if (settings[12][settingsKeys[12]]) {
    buttons.push({
      value: "СО Настройка роутера",
      class: "btn btn-sm btn-info helper",
      action: handleSS_RouterSetup,
    });
  }

  if (settings[13][settingsKeys[13]]) {
    buttons.push({
      value: "СО Рост АП",
      class: "btn btn-sm btn-info helper",
      action: handleSS_RiseAP,
    });
  }

  if (settings[14][settingsKeys[14]]) {
    buttons.push({
      value: "СО КТВ",
      class: "btn btn-sm btn-info helper",
      action: handleSS_KTV,
    });
  }

  if (settings[15][settingsKeys[15]]) {
    buttons.push({
      value: "СО Актив. ключа",
      class: "btn btn-sm btn-info helper",
      action: handleSS_ActivateKey,
    });
  }

  if (settings[16][settingsKeys[16]]) {
    buttons.push({
      value: "СО Восст. пина",
      class: "btn btn-sm btn-info helper",
      action: handleSS_PIN,
    });
  }

  if (settings[17][settingsKeys[17]]) {
    buttons.push({
      value: "СО МП Звонок",
      class: "btn btn-sm btn-info helper",
      action: handleSS_Zvonok,
    });
  }

  if (settings[18][settingsKeys[18]]) {
    buttons.push({
      value: "СО Камера ВН",
      class: "btn btn-sm btn-info helper",
      action: handleSS_CameraVN,
    });
  }

  if (settings[19][settingsKeys[19]]) {
    buttons.push({
      value: "СО Привяз. пульта",
      class: "btn btn-sm btn-info helper",
      action: handleSS_Pult,
    });
  }

  if (settings[20][settingsKeys[20]]) {
    buttons.push({
      value: "СО Не раб пульт",
      class: "btn btn-sm btn-info helper",
      action: handleSS_BadPult,
    });
  }

  if (settings[21][settingsKeys[21]]) {
    buttons.push({
      value: "Неоткрывашки",
      class: "btn btn-sm btn-info helper",
      action: handleClosed_NoPages,
    });
  }

  if (settings[22][settingsKeys[22]]) {
    buttons.push({
      value: "Нет сессии",
      class: "btn btn-sm btn-info helper",
      action: handleClosed_NoSession,
    });
  }

  if (settings[23][settingsKeys[23]]) {
    buttons.push({
      value: "Низкая",
      class: "btn btn-sm btn-info helper",
      action: handleClosed_LowSpeed,
    });
  }

  if (settings[24][settingsKeys[24]]) {
    buttons.push({
      value: "Разрывы",
      class: "btn btn-sm btn-info helper",
      action: handleClosed_Disconnections,
    });
  }

  if (settings[25][settingsKeys[25]]) {
    buttons.push({
      value: "Нет вещания",
      class: "btn btn-sm btn-info helper",
      action: handleClosed_NoTV,
    });
  }

  if (settings[26][settingsKeys[26]]) {
    buttons.push({
      value: "Тикет",
      class: "btn btn-sm btn-info helper",
      action: handleOpen_Ticket,
    });
  }

  if (settings[27][settingsKeys[27]]) {
    buttons.push({
      value: "Youtube",
      class: "btn btn-sm btn-info helper",
      action: handleClosed_Youtube,
    });
  }

  if (settings[28][settingsKeys[28]]) {
    buttons.push({
      value: "Отмена СЗ",
      class: "btn btn-sm btn-info helper",
      action: handleClosed_CancelSZ,
    });
  }

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

  function handleSS_Balance() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1042";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18252";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18254";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_Priost() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1047";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "6089";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_Activation() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1043";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "4152";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "4154";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_ChangeTP() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1047";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18208";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18209";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_PromisedPayment() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1042";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18262";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18264";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_SpeedBonus() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1047";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18196";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18199";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_WiFiKey() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "70") {
      product.value = "70";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18298";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18299";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_RouterSetup() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "70") {
      product.value = "70";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18298";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18647";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_RiseAP() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1042";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "4119";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "4706";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_KTV() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "101") {
      product.value = "101";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18369";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18372";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_ActivateKey() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "1451") {
      product.value = "1451";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18583";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "19712";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_PIN() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "101") {
      product.value = "101";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18229";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18230";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_Zvonok() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "1451") {
      product.value = "1451";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18600";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "19732";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_CameraVN() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "1762") {
      product.value = "1762";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18470";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "19243";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_Pult() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "101") {
      product.value = "101";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18384";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18386";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleSS_BadPult() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "101") {
      product.value = "101";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18384";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18386";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleClosed_NoPages() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "70") {
      product.value = "70";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "4205";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18303";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleClosed_NoSession() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "70") {
      product.value = "70";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18378";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleClosed_LowSpeed() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "70") {
      product.value = "70";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18360";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18363";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleClosed_Disconnections() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "70") {
      product.value = "70";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18405";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18407";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleClosed_NoTV() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "101") {
      product.value = "101";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18369";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "18372";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleOpen_Ticket() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "2296";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "2197";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleClosed_Youtube() {
    const product = document.querySelector(".uni_reas_prod");
    if (product.value != "70") {
      product.value = "70";
      product.dispatchEvent(changeEvent);
    }

    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1046";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "18360";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_child_reason", (substep) => {
      substep.value = "22187";
      substep.dispatchEvent(changeEvent);
    });
  }

  function handleClosed_CancelSZ() {
    const step = document.querySelector(".uni_reas_step");
    step.value = "-1";
    step.dispatchEvent(changeEvent);

    waitForElement(".uni_load_obj_reason", (substep) => {
      substep.value = "1045";
      substep.dispatchEvent(changeEvent);
    });

    waitForElement(".uni_load_main_reason", (substep) => {
      substep.value = "4665";
      substep.dispatchEvent(changeEvent);
    });
  }
}

function initFilterClientSessions() {
  const addFilter = (uniqueReasons) => {
    const existingFilter = document.getElementById("reason-filter");

    if (existingFilter) {
      // Обновляем опции фильтра
      const options = uniqueReasons
        .map((reason) => `<option value="${reason}">${reason}</option>`)
        .join("");
      existingFilter.innerHTML = `<option value="all">Все</option>${options}`;
      return;
    }

    const filterContainer = document.createElement("div");
    const options = uniqueReasons
      .map((reason) => `<option value="${reason}">${reason}</option>`)
      .join("");

    filterContainer.innerHTML = `
      <label for="reason-filter">Фильтр по причине завершения:</label>
      <select id="reason-filter">
          <option value="all">Все</option>
          ${options}
      </select>
    `;

    // Обработчик события для фильтра
    filterContainer.querySelector("#reason-filter").onchange =
      filterClientSessions;

    document
      .querySelector(".container")
      .insertBefore(filterContainer, document.getElementById("js-log-app"));
  };

  const filterClientSessions = () => {
    const filter = document.getElementById("reason-filter").value;
    const table = document.querySelector("#js-res-app table tbody");
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      const reasonCell = rows[i].getElementsByTagName("td")[6]; // 7-й столбец (индекс 6)
      if (reasonCell) {
        rows[i].style.display =
          filter === "all" || reasonCell.innerText.includes(filter)
            ? ""
            : "none";
      }
    }
  };

  const getUniqueReasons = () => {
    const table = document.querySelector("#js-res-app table tbody");
    const rows = table.getElementsByTagName("tr");
    const reasonsSet = new Set();

    for (let i = 0; i < rows.length; i++) {
      const reasonCell = rows[i].getElementsByTagName("td")[6]; // 7-й столбец (индекс 6)
      if (reasonCell) {
        reasonsSet.add(reasonCell.innerText.trim());
      }
    }

    return Array.from(reasonsSet); // Превращаем Set в массив
  };

  const observerCallback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const tableAvailable =
          document.querySelector("#js-res-app table tbody") !== null;
        if (tableAvailable) {
          const uniqueReasons = getUniqueReasons(); // Получаем уникальные причины завершения
          addFilter(uniqueReasons); // Добавляем/обновляем фильтр
          filterClientSessions(); // Применяем фильтр к текущим данным
          break; // Прерываем цикл
        }
      }
    }
  };

  const targetNode = document.getElementById("js-res-app");
  if (targetNode) {
    const observer = new MutationObserver(observerCallback);
    observer.observe(targetNode, { childList: true, subtree: true });
  } else {
    const uniqueReasons = getUniqueReasons(); // Получаем уникальные причины завершения, если элемент уже доступен
    addFilter(uniqueReasons); // Добавляем фильтр сразу
  }
}

function loadLastDayClientSessions() {
  if (document.querySelector(".helper-button") !== null) {
    return;
  }
  const loadDataButton = document.getElementById("js-get-data");

  if (loadDataButton) {
    const button = document.createElement("input");
    button.type = "button";
    button.value = "Последние сутки";
    button.className = "btn btn-secondary helper-button";
    button.style.marginTop = "10px"; // Отступ сверху

    button.onclick = () => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1); // Уменьшаем на 1 день
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const formattedDate = currentDate.toLocaleDateString("ru-RU", options);
      document.querySelector(".js-active-from").value = formattedDate; // Устанавливаем значение в поле ввода

      // Нажимаем кнопку "Загрузить"
      loadDataButton.click();

      // Устанавливаем наблюдателя для изменения таблицы
      const observer = new MutationObserver(() => {
        updateReasonCounts(); // Обновляем количество найденных результатов
      });

      const targetNode = document.querySelector("#js-res-app table tbody");
      if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true }); // Наблюдаем за изменениями
      }
    };
    loadDataButton.parentNode.insertBefore(button, loadDataButton.nextSibling); // Добавляем кнопку после кнопки "Загрузить"
  }
}
