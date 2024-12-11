if (
    document.URL.indexOf("ertelecom.ru/cgi-bin/ppo/excells") !== -1) {
    const config = {
        ARM_allowCopy: allowCopy
    };

    browser.storage.sync.get(Object.keys(config)).then((result) => {
        Object.keys(config).forEach((key) => {
            if (result[key]) {
                config[key]();
            }
        });
    });
}

if (
    document.URL.indexOf(
        "db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id",
    ) !== -1
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
        "db.ertelecom.ru/cgi-bin/ppo/excells/radius_accounting_info.login_detail?id_session",
    ) !== -1) {
    copyIP()
}

if (
    document.URL.indexOf(
        "db.ertelecom.ru/cgi-bin/ppo/excells/radius_accounting_info.login_detail?id_session",
    ) !== -1 ||
    document.URL.indexOf(
        "db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id",
    ) !== -1
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

if (document.URL.indexOf("wcc2_main.frame_left_reasons") !== -1) {
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
    document.URL.indexOf("db.ertelecom.ru/cgi-bin") !== -1 &&
    document.URL.indexOf("wcc_request_appl_support.change_request_appl") === -1
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
        ARM_sendClientCardExample: sendClientCardExample,
        ARM_copyClientAgreement: copyClientAgreement,
        ARM_showHelperSMSButtons: smsButtons,
        ARM_checkForSpecialClient: checkForSpecialClient,
        ARM_hideNonActiveApps: hideNonActiveApps,
        ARM_hideInfoTabRows: hideInformationRows,
        ARM_hideRequests: handleServiceRequests,
        ARM_hideAppeals: initializeAppealsTable,
        ARM_checkPaidHelp: paidHelpTrue
    };

    browser.storage.sync.get(Object.keys(TABS_config)).then((result) => {
        const tabsToDelete = [];

        Object.keys(TABS_config).forEach((key) => {
            if (result[key]) {
                tabsToDelete.push(TABS_config[key]);
            }
        });

        deleteTabs(tabsToDelete).then(() => {
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Удаление вкладок] Вкладки удалены`,
            );
        });
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

    setHelperAnticipation().then(() => {
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Предвосхищение загружено`,
        );
    });
}

if (
    document.URL.includes(
        "db.ertelecom.ru/cgi-bin/ppo/excells/wcc_request_appl_support.change_request_appl",
    )
) {
    const ARM_config = {
        ARM_checkWrongTransfer: wrongTransferFalse,
        ARM_checkSetToMe: removeSetForMe,
        ARM_copyTimeSlots: copyTimeSlots,
        ARM_changeRequestFBCR: fastButtonsChangeRequest,
        ARM_checkPaidHelp: paidHelpTrue,
        ARM_showAgreementOnChange: showClientAgreementOnChangeRequest
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
}

async function checkForSpecialClient() {
    const observerSpecial = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.classList.contains("bl_antic_head_w")
                    ) {
                        checkSpecialClient(node);
                    }
                });
            }
        }
    });

    const checkSpecialClient = (element) => {
        if (element.textContent.trim() === "Особый Клиент") {
            alert("Внимание! Особый клиент!");
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Особый клиент] Найден особый клиент`,
            );
            observerSpecial.disconnect();
        }
    };

    const special = document.querySelectorAll(".bl_antic_head_w");
    if (special.length > 0) {
        special.forEach(checkSpecialClient);
    } else {
        observerSpecial.observe(document.body, {childList: true, subtree: true});
        setTimeout(() => {
            observerSpecial.disconnect();
        }, 3000);
        // Подключение для вызывания для существующих дочерних элементов
        const existingNodes = document.body.querySelectorAll(".bl_antic_head_w");
        existingNodes.forEach(checkSpecialClient);
    }
}

async function setHelperAnticipation() {
    const button = document.querySelector(".top_3_butt");
    if (!button) return;
    if (button.textContent.includes("Хелпер")) return;
    button.textContent = "Хелпер";

    const observerSPAS = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForSPAS);
            }
        }
    });

    const observerAccess = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForAccess);
            }
        }
    });

    const observerAccident = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForAccident);
            }
        }
    });

    const observerPPR = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForPPR);
            }
        }
    });

    const observerSpecial = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForSpecial);
            }
        }
    });

    let problems = 0;

    // СПАС
    let spas = document.querySelector(".spas_body");
    if (spas) {
        button.innerHTML += " | СПАС";
        button.style.backgroundColor = "#cc3300";
        problems++;

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден СПАС`,
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
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден СПАС`,
                );
            }
        }

        observerSPAS.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerSPAS.disconnect();
        }, 3000);
    }

    // Закрытый доступ
    let access = document.querySelectorAll(".bl_antic_head_w");
    if (access) {
        access.forEach((element) => {
            if (element.textContent.trim() === "Доступ отсутствует") {
                button.innerHTML += " | Доступ";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден закрытый доступ`,
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
                        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден закрытый доступ`,
                    );
                }
            }
        }

        observerAccess.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerAccess.disconnect();
        }, 3000);
    }

    // Авария
    let accident = document.querySelectorAll(".bl_antic_head_w");
    if (accident) {
        accident.forEach((element) => {
            if (element.textContent.trim() === "Аварии на адресе") {
                button.innerHTML += " | Авария";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найдена авария`,
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
                        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найдена авария`,
                    );
                }
            }
        }

        observerAccident.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerAccident.disconnect();
        }, 3000);
    }

    // ППР
    let ppr = document.querySelectorAll(".bl_antic_head_w");
    if (ppr) {
        ppr.forEach((element) => {
            if (element.textContent.trim() === "ППР на адресе") {
                button.innerHTML += " | ППР";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден ППР`,
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
                        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден ППР`,
                    );
                }
            }
        }

        observerPPR.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerPPR.disconnect();
        }, 3000);
    }

    // Особый клиент
    let special = document.querySelectorAll(".bl_antic_head_w");
    if (special) {
        special.forEach((element) => {
            if (element.textContent.trim() === "Особый Клиент") {
                button.innerHTML += " | Особый";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден особый клиент`,
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
                        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Найден особый клиент`,
                    );
                }
            }
        }

        observerSpecial.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerSpecial.disconnect();
        }, 3000);
    }

    if (problems === 0) {
        button.style.backgroundColor = "#008000";
    }
    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Предвосхищение] Предвосхищение загружено`,
    );
}

function hideSPAS() {
    // Своваричаем предвосхищение
    let header = document.getElementById("collapse-top-3");
    if (header) header.className = "collapse";
}

function copyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
    } catch (err) {
        console.error("Oops, unable to copy", err);
    }
    document.body.removeChild(textarea);
}

async function copyClientAddress() {
    let address_text;
    const settings = await browser.storage.sync.get(
        "ARM_copyClientAddressWithoutCity",
    );

    if (document.querySelector(".helper-address") != null) {
        return;
    }
    try {
        address_text = document.getElementById("dr").innerText;
    } catch (e) {
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Копирование адреса] Не найдено поле адреса для копирования`,
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
    const lineBreak = document.createElement("br");

    // Обманка АРМа, чтобы не думал, что это кнопка
    const copyButton = document.createElement("button");
    copyButton.textContent = "📋 Адрес";
    copyButton.classList.add("btn", "btn-primary", "btn-xs", "helper-address"); // Добавляем классы для стилизации

    // Отслеживание кликов на кнопку для копирования текста
    copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        copyText(address_text)
        $.notify("Адрес скопирован", "success");
    });

    address.appendChild(lineBreak);
    address.appendChild(copyButton);

    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Копирование адреса] Добавлена кнопка копирования адреса`,
    );
}

function copyClientCard() {
    const clientCardShowButton = document.getElementById("write_let");
    const clientCardRow = document.getElementById("namcl");
    if (document.querySelector(".helper-card") != null) {
        return;
    }
    try {
        // Раскрываем карточку
        clientCardShowButton.click();
    } catch (e) {
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Копирование карточки] Не найдена карточка клиента`,
        );
        return;
    }

    const clientCardText = $("#to_copy").val();

    // Скрываем карточки
    clientCardShowButton.click();

    const clientCard = clientCardRow.previousElementSibling;
    const lineBreak = document.createElement("br");

    // Обманка АРМа, чтобы не думал, что это кнопка
    const copyButton = document.createElement("button");
    copyButton.textContent = "📋 Карточка";
    copyButton.classList.add("btn", "btn-primary", "btn-xs", "helper-card"); // Добавляем классы для стилизации

    // Отслеживание кликов на кнопку для копирования текста
    copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        copyText(clientCardText)
        $.notify("Карточка скопирована", "success");
    });
    clientCard.appendChild(lineBreak);
    clientCard.appendChild(copyButton);

    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Копирование] Добавлена кнопка копирования карточки`,
    );
}

async function sendClientCardExample() {
    const clientCardShowButton = document.getElementById("write_let");
    const clientCardRow = document.getElementById("namcl");
    if (document.querySelector(".helper-example-card") != null) {
        return;
    }
    try {
        // Раскрываем карточку
        clientCardShowButton.click();
    } catch (e) {
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Копирование карточки] Не найдена карточка клиента`,
        );
        return;
    }

    const clientCardText = $("#to_copy").val();
    let formattedClientCardText = clientCardText.split("\n").join("<br>");

    // Скрываем карточки
    clientCardShowButton.click();

    const clientCard = clientCardRow.previousElementSibling;
    const lineBreak = document.createElement("br");

    // Обманка АРМа, чтобы не думал, что это кнопка
    const sendExampleButton = document.createElement("button");
    sendExampleButton.textContent = "📨 Отправить пример";
    sendExampleButton.classList.add("btn", "btn-warning", "btn-xs", "helper-example-card");
    sendExampleButton.style.marginTop = "5px"


    sendExampleButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let userMessage = prompt("Введи сообщение к примеру для отправки дежурному")
        if (userMessage.length < 1) {
            $.notify("Сообщение не может быть пустым")
            return
        }
        const response = await fetch("https://okc.ertelecom.ru/stats/api/line-mail-example/send-example-mail", {
            credentials: "include",
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `message=${formattedClientCardText}<br><br>${userMessage}&lineAppId=3`,
            method: "POST",
        });

        if (!response.ok) {
            const errorText = await response.text();
            $.notify("Не удалось отправить пример")
            console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Пример договора] Произошла ошибка: ${errorText}`)
        } else {
            $.notify("Пример успешно отправлен", "success")
            console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Пример договора] Пример успешно отправлен`)
        }


    });
    clientCard.appendChild(lineBreak);
    clientCard.appendChild(sendExampleButton);

    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Пример договора] Добавлена кнопка отправки примера`,
    );
}

function copyClientAgreement() {
    if (document.querySelector(".helper-agreement") != null) {
        return;
    }
    const agreementTab = document.getElementById("agr_with_type");
    if (!agreementTab) return;
    const agreementBeforeTab = agreementTab.previousElementSibling;
    const agreement_number = agreementTab.getElementsByTagName("b")[0];

    const lineBreak = document.createElement("br");
    const copyButton = document.createElement("button");
    copyButton.textContent = "📋 Договор";
    copyButton.classList.add("btn", "btn-primary", "btn-xs", "helper-agreement"); // Добавляем классы для стилизации

    // Отслеживание кликов на кнопку для копирования текста
    copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        copyText(agreement_number.textContent)
        $.notify("Номер договора скопирован", "success");
    });

    agreementBeforeTab.appendChild(lineBreak);
    agreementBeforeTab.appendChild(copyButton);

    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Копирование] Добавлена кнопка копирования договора`,
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
                    const [hours] = timeValue.split(":");
                    const endHour = (parseInt(hours) + 1).toString().padStart(2, "0");
                    return `${hours}-${endHour}`;
                }
                return null;
            })
            .filter(Boolean)
            .join(", ");
    }

    const observer = new MutationObserver(() => {
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
                            (option) => option.value && option.classList.contains("time_one"),
                        ),
                    );
                    copyText(formattedOptions)
                    $.notify("Слоты скопированы", "success");
                });

                // Вставляем кнопку справа от целевого элемента
                targetNode.insertAdjacentElement("afterend", button);
                targetNode.parentNode.style.display = "flex";
            }
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
}

function copyMAC() {
    // Add styles for the button group if not already present
    if (!document.getElementById('helper-button-styles')) {
        const style = document.createElement('style');
        style.id = 'helper-button-styles';
        style.textContent = `
            .helper-button-group {
                display: inline-flex;
                border-radius: 4px;
                overflow: hidden;
                box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0;
                margin-left: 5px;
            }
            
            .helper-button {
                appearance: none;
                background-color: #FAFBFC !important;
                border: 1px solid rgba(27, 31, 35, 0.15);
                box-sizing: border-box;
                color: #24292E !important;
                cursor: pointer;
                display: inline-block;
                font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
                font-size: 12px !important;
                font-weight: 500;
                line-height: 16px;
                list-style: none;
                padding: 3px 6px;
                position: relative;
                transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                vertical-align: middle;
                white-space: nowrap;
                margin: 0;
            }
            
            .helper-button-left {
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                border-right: none;
            }
            
            .helper-button-right {
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
            }
            
            .helper-button:hover {
                background-color: #d6d6d6 !important;
                text-decoration: none;
                transition-duration: 0.1s;
            }
            
            .helper-button:active {
                background-color: #EDEFF2;
                box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
                transition: none 0s;
            }
            
            .helper-button:focus {
                outline: none;
            }
        `;
        document.head.appendChild(style);
    }

    const createMACButtons = (macAddressElement) => {
        // Skip if buttons already exist
        if (macAddressElement.nextElementSibling?.classList.contains('helper-button-group')) {
            return;
        }

        const macAddress = macAddressElement.innerText;

        // Create button group container
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('helper-button-group');
        buttonGroup.style.position = 'relative';

        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.classList.add('helper-button', 'helper-button-left');
        copyButton.innerText = '📋';
        copyButton.title = 'Копировать MAC';
        copyButton.onclick = async (event) => {
            event.preventDefault();
            event.stopPropagation();
            try {
                await navigator.clipboard.writeText(macAddress);
                console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Копирование] - MAC адрес успешно скопирован`);
                $.notify('MAC-адрес скопирован', 'success');
            } catch (error) {
                console.error('Copy error:', error);
                $.notify('Ошибка при копировании MAC-адреса', 'error');
            }
        };

        // Create search button
        const searchButton = document.createElement('button');
        searchButton.classList.add('helper-button', 'helper-button-right');
        searchButton.innerText = '🔎';
        searchButton.title = 'Проверить MAC';
        searchButton.onclick = async (event) => {
            event.preventDefault();
            event.stopPropagation();
            try {
                const response = await fetch(`https://api.maclookup.app/v2/macs/${macAddress}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 429) {
                    $.notify('Превышен лимит запросов (2 в сек)', 'error');
                    return;
                }

                if (!response.ok) {
                    $.notify('Не удалось найти', 'error');
                    return;
                }

                const result = await response.json();

                if (!result.found) {
                    $.notify('Не удалось найти MAC в базе', 'error');
                    return;
                }

                if (result.company) {
                    $.notify(result.company, 'success');
                }
            } catch (error) {
                console.error('MAC lookup error:', error);
                $.notify('Ошибка при поиске информации о MAC', 'error');
            }
        };

        // Add buttons to group
        buttonGroup.appendChild(copyButton);
        buttonGroup.appendChild(searchButton);

        // Add group after MAC address element
        macAddressElement.parentElement.appendChild(buttonGroup);
    };

    // Function to add buttons to all MAC addresses on the page
    const addCopyButtons = () => {
        const macAddressElements = document.querySelectorAll('.mac, .js-get-vendor-by-mac');
        macAddressElements.forEach(createMACButtons);
    };

    // Set up the mutation observer
    const setupObserver = () => {
        const targetNode = document.getElementById('js-res-app');
        if (!targetNode) return;

        const config = {
            childList: true,
            subtree: true
        };

        const callback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const macElements = mutation.target.querySelectorAll('.mac, .js-get-vendor-by-mac');
                    macElements.forEach(createMACButtons);
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        // Store observer reference for cleanup
        window._macObserver = observer;
    };

    // Cleanup previous observer if it exists
    if (window._macObserver) {
        window._macObserver.disconnect();
        window._macObserver = null;
    }

    // Initialize based on current URL
    if (document.URL.includes('db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id')) {
        setupObserver();
    }

    // Add buttons to existing elements
    addCopyButtons();
}

function copyIP() {
    /*document.querySelectorAll('a[title="Проверка ping"]').forEach(element => {
        element.remove();
    })*/

    document.querySelectorAll('.ip').forEach(ipContainer => {
        const ipElement = ipContainer.querySelector('acronym');
        if (!ipElement) return;

        let ip_status;
        const ip = ipElement.textContent;
        if (ip.startsWith("100.")) {
            ip_status = "За NAT";
        } else if (ip.startsWith("10.")) {
            ip_status = "Серый";
        } else if (ip.startsWith("172.")) {
            ip_status = "Без доступа";
        } else {
            ip_status = "Белый";
        }

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'helper-button-group';
        buttonGroup.style.position = 'relative';
        buttonGroup.style.marginLeft = '5px';
        buttonGroup.style.display = 'inline-flex';

        const copyButton = document.createElement('button');
        copyButton.textContent = '📋';
        copyButton.classList.add("helper-button", "helper-button-left");
        copyButton.title = 'Копировать IP';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(ip)
                .then(() => $.notify('IP скопирован', 'success'))
                .catch(err => {
                    console.error('Ошибка копирования IP:', err);
                    $.notify('Не удалось скопировать IP', 'error');
                });
        };

        const checkButton = document.createElement('button');
        checkButton.textContent = '🔎';
        checkButton.classList.add("helper-button", "helper-button-right");
        checkButton.title = 'Проверить IP';
        checkButton.onclick = async () => {
            try {
                const response = await fetch(
                    `https://api.ipquery.io/${ip}?format=yaml`
                );
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                $.notify(
                    `Город: ${data["location"]["city"] ? data["location"]["city"] : "Неизвестно"}\nТип IP: ${ip_status}`,
                    'success'
                );
            } catch (error) {
                console.error('Error checking IP:', error);
                $.notify('Failed to check IP location', 'error');
            }
        };

        const style = document.createElement("style");
        style.textContent = `
        .helper-button-group {
            display: inline-flex;
            border-radius: 4px;
            overflow: hidden;
            box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0;
        }
        
        .helper-button {
            appearance: none;
            background-color: #FAFBFC !important;
            border: 1px solid rgba(27, 31, 35, 0.15);
            box-sizing: border-box;
            color: #24292E !important;
            cursor: pointer;
            display: inline-block;
            font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif;
            font-size: 12px !important;
            font-weight: 500;
            line-height: 16px;
            list-style: none;
            padding: 3px 6px;
            position: relative;
            transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            vertical-align: middle;
            white-space: nowrap;
            margin: 0;
        }
        
        .helper-button-left {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            border-right: none;
        }
        
        .helper-button-right {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
        }
        
        .helper-button:hover {
            background-color: #d6d6d6 !important;
            text-decoration: none;
            transition-duration: 0.1s;
        }
        
        .helper-button:active {
            background-color: #EDEFF2;
            box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
            transition: none 0s;
        }
        
        .helper-button:focus {
            outline: none;
        }
        
        .helper-button:before {
            display: none;
        }
        
        .helper-button:-webkit-details-marker {
            display: none;
        }
        `;
        document.head.appendChild(style);

        buttonGroup.appendChild(copyButton);
        buttonGroup.appendChild(checkButton);
        ipElement.insertAdjacentElement('afterend', buttonGroup);
    });
}

function showClientAgreementOnChangeRequest() {
    let headerText = document.querySelector(".text-primary");
    headerText.innerText = `Обращение по договору №${
        document.querySelector('input[name="agr_num"]').value
    }`;
}

function smsButtons() {
    const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
    });

    const buttonContainer = $('<div class="button-container" style="display: flex; flex-wrap: wrap; margin-top: 6px; gap: 6px;"></div>');

    const buttonData = [
        {value: "🔑 Static", smsValue: 27},
        {value: "🔑 PPPoE", smsValue: 25},
        {value: "🔐 ЛК", smsValue: 26},
        {value: "💸 Оплата", smsValue: 24},
    ];

    function createButton(buttonValue, smsValue) {
        const button = $(`<input type="button" value="${buttonValue}" class="btn btn-primary btn-sm helper"/>`);
        button.on("click", function () {
            let smsSelector = $(".type_sms_a")
            smsSelector.val(smsValue);
            smsSelector[0].dispatchEvent(changeEvent);
        });
        return button;
    }

    buttonData.forEach(data => {
        const button = createButton(data.value, data.smsValue);
        addButtonIfExists(button, data.smsValue);
    });

    function addButtonIfExists(button, value) {
        if ($(".type_sms_a option[value='" + value + "']").length && $(".helper[value='" + button.val() + "']").length === 0) {
            buttonContainer.append(button);
        }
    }

    $(".type_sms_a").after(buttonContainer);
}

function wrongTransferFalse() {
    const radioButton = document.querySelector(
        'input[type="radio"][name="wrongTransfer"][value="0"]',
    );
    if (radioButton) {
        radioButton.removeAttribute("disabled");
        radioButton.click();

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Отмечено как не ошибочное`,
        );
    }
}

async function paidHelpTrue() {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                const checkbox = document.getElementById("check_pay_service");
                if (checkbox) {
                    const payServiceSpan = checkbox.closest('.pay_service');

                    if (payServiceSpan) {
                        let element = payServiceSpan;
                        let isVisible = true;

                        while (element && element !== document.body) {
                            const style = window.getComputedStyle(element);
                            if (style.display === 'none' || style.visibility === 'hidden') {
                                isVisible = false;
                                break;
                            }
                            element = element.parentElement;
                        }

                        if (isVisible) {
                            checkbox.click()
                            checkbox.checked = true

                            observer.disconnect();
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}

function removeSetForMe() {
    const checkbox = document.getElementById("chb_set_to_me");
    checkbox.removeAttribute("disabled");
    checkbox.checked = false;

    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Убрано назначение обращения на себя`,
    );
}

async function fastButtonsChangeRequest() {
    if (document.querySelector(".helper") != null) {
        return;
    }

    const changeEvent = new Event("change", {
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
        settingsKeys.map((key) => browser.storage.sync.get(key)),
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
    buttons.reduce((prev, curr, idx) => {
        prev.before(curr, spaces[idx]);
        return curr;
    }, existingButton);

    function handleOnlineCSClick() {
        let step = document.querySelector("#change_step_id");
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

        step.value = "2296";
        step.dispatchEvent(changeEvent);

        const observer = new MutationObserver(() => {
            const objReason = document.querySelector(".uni_load_obj_reason");
            if (objReason) {
                observer.disconnect();
                setTimeout(function () {
                    objReason.value = "2123";
                    objReason.dispatchEvent(changeEvent);
                }, 400);
            }
        });
        observer.observe(document.body, {childList: true, subtree: true});

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Обращение изменено на Онлайн вход - КС`,
        );

        $.notify("Обращение изменено: Онлайн вход - КС", "success");
    }

    function handleOCTPCSClick() {
        let step = document.querySelector("#change_step_id");
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

        step.value = "1520";
        step.dispatchEvent(changeEvent);

        const observer = new MutationObserver(() => {
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

        observer.observe(document.body, {childList: true, subtree: true});

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Обращение изменено на ОЦТП Исход - КС`,
        );
        $.notify("Обращение изменено на ОЦТП Исход - КС", "success");
    }

    function handleTSAAOClick() {
        let step = document.querySelector("#change_step_id");
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

        step.value = "1056";
        step.dispatchEvent(changeEvent);

        const observer = new MutationObserver(() => {
            const objReason = document.querySelector(".uni_load_obj_reason");
            if (objReason) {
                observer.disconnect();
                setTimeout(function () {
                    objReason.value = "1046";
                    objReason.dispatchEvent(changeEvent);
                }, 400);
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Обращение изменено на ТС/ААО`,
        );
        $.notify("Обращение изменено на ТС/ААО", "success");
    }

    function handleNRDClick() {
        let step = document.querySelector("#change_step_id");
        let exists = false;

        for (let option of step.options) {
            if (option.text === "Направление сохранения Клиентов - Исходящая связь") {
                exists = true;

                break;
            }
        }
        if (!exists) {
            $.notify(
                "Смена классификатора на Передано Направление сохранения Клиентов - Исходящая связь недоступна",
            );
            return;
        }
        $("tr.classifier_line").removeAttr("hidden").removeAttr("style");

        if (document.getElementById("change_class").checked === false) {
            document.getElementById("change_class").click();
        }

        step.value = "1521";
        step.dispatchEvent(changeEvent);

        const observer = new MutationObserver(() => {
            const objReason = document.querySelector(".uni_load_obj_reason");
            if (objReason) {
                observer.disconnect();
                setTimeout(function () {
                    objReason.value = "2286";
                    objReason.dispatchEvent(changeEvent);
                }, 400);
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Обращение изменено на НРД - Исход`,
        );
        $.notify("Обращение изменено на НРД - Исход", "success");
    }

    function handleNTPIshodClick() {
        let step = document.querySelector("#change_step_id");
        document.querySelector(".uni_load_obj_reason");
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

        step.value = "2277";
        step.dispatchEvent(changeEvent);

        const observer = new MutationObserver(() => {
            const objReason = document.querySelector(".uni_load_obj_reason");
            if (objReason) {
                observer.disconnect();
                setTimeout(function () {
                    objReason.value = "1046";
                    objReason.dispatchEvent(changeEvent);
                }, 400);
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Обращение изменено на НТП - Исход`,
        );
        $.notify("Обращение изменено на НТП - Исход", "success");
    }

    function handleAbonIshodClick() {
        let step = document.querySelector("#change_step_id");
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

        step.value = "616";
        step.dispatchEvent(changeEvent);

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Обращение изменено на Абон - Исход`,
        );
        $.notify("Обращение изменено на Абон - Исход", "success");
    }
}

async function fastButtonsLeftFrame() {
    if (document.querySelector(".helper") != null) {
        return;
    }

    const container = document.querySelector(".create_request_block");
    if (!container) return;

    const categories = {
        Открытое: [],
        Закрытое: [],
        Самообслуживание: [],
        "Быстрый чат": [],
    };

    const settingsKeys = [
        "ARM_changeRequestFBLF_FastChat_Accident",
        "ARM_changeRequestFBLF_Open_VhodNRD",
        "ARM_changeRequestFBLF_Open_KCNCK2",
        "ARM_changeRequestFBLF_Open_KCNCK1",
        "ARM_changeRequestFBLF_Self_Priost",
        "ARM_changeRequestFBLF_Self_Activation",
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
        "ARM_changeRequestFBLF_FastChat_NoDiagnostic",
        "ARM_changeRequestFBLF_FastChat_DZ",
        "ARM_changeRequestFBLF_Self_recoverLK"
    ];

    // Получение значений всех настроек
    const settings = await Promise.all(
        settingsKeys.map((key) => browser.storage.sync.get(key)),
    );

    const buttons = [];

    // Проверка настроек и добавление кнопок
    if (settings[0][settingsKeys[0]]) {
        buttons.push({
            value: "Авария",
            class: "helper helper-button",
            action: fastChat_Accident,
            category: "Быстрый чат",
        });
    }

    if (settings[1][settingsKeys[1]]) {
        buttons.push({
            value: "ВХОД НРД",
            class: "helper helper-button",
            action: handleNRD,
            category: "Открытое",
        });
    }

    if (settings[2][settingsKeys[2]]) {
        buttons.push({
            value: "КС НЦК2",
            class: "helper helper-button",
            action: handleKCNCK2Click,
            category: "Открытое",
        });
    }

    if (settings[3][settingsKeys[3]]) {
        buttons.push({
            value: "КС НЦК1",
            class: "helper helper-button",
            action: handleKCNCK1Click,
            category: "Открытое",
        });
    }

    if (settings[4][settingsKeys[4]]) {
        buttons.push({
            value: "Приостановление",
            class: "helper helper-button",
            action: handleSS_Priost,
            category: "Самообслуживание",
        });
    }

    if (settings[5][settingsKeys[5]]) {
        buttons.push({
            value: "Активация ТП",
            class: "helper helper-button",
            action: handleSS_Activation,
            category: "Самообслуживание",
        });
    }

    if (settings[6][settingsKeys[6]]) {
        buttons.push({
            value: "Скорост. бонус",
            class: "helper helper-button",
            action: handleSS_SpeedBonus,
            category: "Самообслуживание",
        });
    }

    if (settings[7][settingsKeys[7]]) {
        buttons.push({
            value: "Ключ сети",
            class: "helper helper-button",
            action: handleSS_WiFiKey,
            category: "Самообслуживание",
        });
    }

    if (settings[8][settingsKeys[8]]) {
        buttons.push({
            value: "Настройка роутера",
            class: "helper helper-button",
            action: handleSS_RouterSetup,
            category: "Самообслуживание",
        });
    }

    if (settings[9][settingsKeys[9]]) {
        buttons.push({
            value: "Рост АП",
            class: "helper helper-button",
            action: handleSS_RiseAP,
            category: "Самообслуживание",
        });
    }

    if (settings[10][settingsKeys[10]]) {
        buttons.push({
            value: "КТВ",
            class: "helper helper-button",
            action: handleSS_KTV,
            category: "Самообслуживание",
        });
    }

    if (settings[11][settingsKeys[11]]) {
        buttons.push({
            value: "Актив. ключа",
            class: "helper helper-button",
            action: handleSS_ActivateKey,
            category: "Самообслуживание",
        });
    }

    if (settings[12][settingsKeys[12]]) {
        buttons.push({
            value: "Восст. пина",
            class: "helper helper-button",
            action: handleSS_PIN,
            category: "Самообслуживание",
        });
    }

    if (settings[13][settingsKeys[13]]) {
        buttons.push({
            value: "МП Звонок",
            class: "helper helper-button",
            action: handleSS_Zvonok,
            category: "Самообслуживание",
        });
    }

    if (settings[14][settingsKeys[14]]) {
        buttons.push({
            value: "Камера ВН",
            class: "helper helper-button",
            action: handleSS_CameraVN,
            category: "Самообслуживание",
        });
    }

    if (settings[15][settingsKeys[15]]) {
        buttons.push({
            value: "Привяз. пульта",
            class: "helper helper-button",
            action: handleSS_Pult,
            category: "Самообслуживание",
        });
    }

    if (settings[16][settingsKeys[16]]) {
        buttons.push({
            value: "Не раб пульт",
            class: "helper helper-button",
            action: handleSS_BadPult,
            category: "Самообслуживание",
        });
    }

    if (settings[17][settingsKeys[17]]) {
        buttons.push({
            value: "Неоткрывашки",
            class: "helper helper-button",
            action: handleClosed_NoPages,
            category: "Закрытое",
        });
    }

    if (settings[18][settingsKeys[18]]) {
        buttons.push({
            value: "Нет сессии",
            class: "helper helper-button",
            action: handleClosed_NoSession,
            category: "Закрытое",
        });
    }

    if (settings[19][settingsKeys[19]]) {
        buttons.push({
            value: "Низкая",
            class: "helper helper-button",
            action: handleClosed_LowSpeed,
            category: "Закрытое",
        });
    }

    if (settings[20][settingsKeys[20]]) {
        buttons.push({
            value: "Разрывы",
            class: "helper helper-button",
            action: handleClosed_Disconnections,
            category: "Закрытое",
        });
    }

    if (settings[21][settingsKeys[21]]) {
        buttons.push({
            value: "Нет вещания",
            class: "helper helper-button",
            action: handleClosed_NoTV,
            category: "Закрытое",
        });
    }

    if (settings[22][settingsKeys[22]]) {
        buttons.push({
            value: "Тикет",
            class: "helper helper-button",
            action: handleOpen_Ticket,
            category: "Открытое",
        });
    }

    if (settings[23][settingsKeys[23]]) {
        buttons.push({
            value: "Youtube",
            class: "helper helper-button",
            action: handleClosed_Youtube,
            category: "Закрытое",
        });
    }

    if (settings[24][settingsKeys[24]]) {
        buttons.push({
            value: "Отмена СЗ",
            class: "helper helper-button",
            action: handleClosed_CancelSZ,
            category: "Закрытое",
        });
    }

    if (settings[25][settingsKeys[25]]) {
        buttons.push({
            value: "Без диагностики",
            class: "helper helper-button",
            action: fastChat_NoDiagnostic,
            category: "Быстрый чат",
        });
    }

    if (settings[26][settingsKeys[26]]) {
        buttons.push({
            value: "Отключ ДЗ",
            class: "helper helper-button",
            action: fastChat_DZ,
            category: "Быстрый чат",
        });
    }

    if (settings[27][settingsKeys[27]]) {
        buttons.push({
            value: "Восстановление ЛК",
            class: "helper helper-button",
            action: handleSS_recoverLK,
            category: "Самообслуживание",
        });
    }

    buttons.forEach((button) => {
        if (categories[button.category]) {
            categories[button.category].push(button);
        }
    });

    const fragment = document.createDocumentFragment();
    const categoryButtonsDiv = document.createElement("div");
    categoryButtonsDiv.className = "category-buttons";
    fragment.appendChild(categoryButtonsDiv);

    Object.entries(categories).forEach(([categoryName, categoryButtons]) => {
        if (categoryButtons.length > 0) {
            const categoryButton = document.createElement("button");
            categoryButton.textContent = categoryName;
            categoryButton.className = "category-toggle";
            categoryButtonsDiv.appendChild(categoryButton);

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "button-container";
            buttonContainer.style.display = "none";

            categoryButtons.forEach((button) => {
                const btnElement = document.createElement("input");
                btnElement.setAttribute("type", "button");
                btnElement.setAttribute("class", button.class);
                btnElement.setAttribute("value", button.value);
                btnElement.addEventListener("click", button.action);
                btnElement.style.backgroundColor = "#337ab7";
                btnElement.style.color = "white";
                btnElement.style.marginBottom = "3px"
                buttonContainer.appendChild(btnElement);
                buttonContainer.appendChild(document.createTextNode(" "));
            });

            fragment.appendChild(buttonContainer);

            categoryButton.addEventListener("click", () => {
                if (buttonContainer.style.display === "none") {
                    buttonContainer.style.display = "block";
                    categoryButton.classList.add("active");
                } else {
                    buttonContainer.style.display = "none";
                    categoryButton.classList.remove("active");
                }
            });
        }
    });

    container.insertBefore(fragment, container.firstChild);

    const style = document.createElement("style");
    style.textContent = `
          .category-buttons {
              display: flex;
              flex-wrap: wrap;
              gap: 2px;
              margin-bottom: 4px;
          }
          .category-toggle {
              padding: 2px 5px;
              background-color: #f0f0f0;
              border: 1px solid #ccc;
              border-radius: 2px;
              cursor: pointer;
          }
          .category-toggle:hover {
              background-color: #e0e0e0;
          }
          .button-container {
              margin-bottom: 6px;
          }
          .category-toggle.active {
              background-color: #d0d0d0;
              font-weight: bold;
              box-shadow: 0 0 5px rgba(0,0,0,0.2);
          }
        .helper-button {
          appearance: none;
          background-color: #FAFBFC !important;
          border: 1px solid rgba(27, 31, 35, 0.15);
          border-radius: 6px;
          box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
          box-sizing: border-box;
          color: #24292E !important;
          cursor: pointer;
          display: inline-block;
          font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
          font-weight: 500;
          line-height: 20px;
          list-style: none;
          padding: 5px 5px;
          position: relative;
          transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          vertical-align: middle;
          white-space: nowrap;
          word-wrap: break-word;
        }
        
        .helper-button:hover {
          background-color: #d6d6d6 !important;
          text-decoration: none;
          transition-duration: 0.1s;
        }
        
        .helper-button:disabled {
          background-color: #FAFBFC;
          border-color: rgba(27, 31, 35, 0.15);
          color: #959DA5;
          cursor: default;
        }
        
        .helper-button:active {
          background-color: #EDEFF2;
          box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
          transition: none 0s;
        }
        
        .helper-button:focus {
          outline: 1px transparent;
        }
        
        .helper-button:before {
          display: none;
        }
        
        .helper-button:-webkit-details-marker {
          display: none;
        }
      `;
    document.head.appendChild(style);

    const changeEvent = new Event("change", {
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
        observer.observe(document, {childList: true, subtree: true});
    }

    async function handleNRD() {
        const step = document.querySelector(".uni_reas_step");
        step.value = "1195";
        step.dispatchEvent(changeEvent);

        waitForElement(".uni_load_obj_reason", (substep) => {
            substep.value = "2286";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleKCNCK1Click() {
        const step = document.querySelector(".uni_reas_step");
        step.value = "2296";
        step.dispatchEvent(changeEvent);

        waitForElement(".uni_load_obj_reason", (substep) => {
            substep.value = "2123";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleKCNCK2Click() {
        const step = document.querySelector(".uni_reas_step");
        step.value = "1520";
        step.dispatchEvent(changeEvent);

        waitForElement(".uni_load_obj_reason", (substep) => {
            substep.value = "2123";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_Priost() {
        const step = document.querySelector(".uni_reas_step");
        step.value = "2296";
        step.dispatchEvent(changeEvent);

        waitForElement(".uni_load_obj_reason", (substep) => {
            substep.value = "1047";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement(".uni_load_main_reason", (substep) => {
            substep.value = "6089";
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Консультация по условиям приостановления";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_Activation() {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Активация ТП";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_SpeedBonus() {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Консультация по скоростному бонусу";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_WiFiKey() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "70") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Ключ сети (пароль от Wi-Fi)";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_recoverLK() {
        const step = document.querySelector(".uni_reas_step");
        step.value = "2296";
        step.dispatchEvent(changeEvent);

        waitForElement(".uni_load_obj_reason", (substep) => {
            substep.value = "1043";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement(".uni_load_main_reason", (substep) => {
            substep.value = "4144";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement(".uni_load_child_reason", (substep) => {
            substep.value = "19185";
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Восстановление данных (вход в ЛК)";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_RouterSetup() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "70") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Настройка роутера";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_RiseAP() {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Повышение АП";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function handleSS_KTV() {
        const product = document.querySelector(".uni_reas_prod");
        const values = Array.from(product.options).map(option => option.value);

        if (values.includes("71")) {
            product.value = "71";
            product.dispatchEvent(changeEvent);
        } else {
            product.value = "101";
            product.dispatchEvent(changeEvent);
        }


        const step = await document.querySelector(".uni_reas_step");
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. КТВ, нет вещания на всех каналах";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleSS_ActivateKey() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "1451") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Активация ключа в МП";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleSS_PIN() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "101") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Восстановление пин-кода РК Movix";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleSS_Zvonok() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "1451") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Не проходит звонок в МП «Умный Дом.ru»";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleSS_CameraVN() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "1762") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. ВН. Камера в статусе «недоступна»";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleSS_Pult() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "101") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Привязка пульта к ТВ";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleSS_BadPult() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "101") {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "БП Самообслуживание. Приставка не реагирует на пульт";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleClosed_NoPages() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "70") {
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
        if (product.value !== "70") {
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
        if (product.value !== "70") {
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
        if (product.value !== "70") {
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
        if (product.value !== "101") {
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
        if (product.value !== "70") {
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

    function fastChat_Accident() {
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

    function fastChat_NoDiagnostic() {
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
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "Вопрос клиента был решен до диагностики. Проинформирован о необходимости повторного обращения в случае возникновения сложностей #НЦКБЫСТРЫЙЧАТ";
            substep.dispatchEvent(changeEvent);
        });
    }

    function fastChat_DZ() {
        const step = document.querySelector(".uni_reas_step");
        step.value = "-1";
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
            substep.value = "18253";
        });

        waitForElement(".comment_text", (substep) => {
            substep.value = "Отключение услуг по ДЗ. Клиент проинформирован о сумме платежа и способах оплаты #НЦКБЫСТРЫЙЧАТ";
            substep.dispatchEvent(changeEvent);
        });
    }
}

function initFilterClientSessions() {
    const container = document.querySelector(".container");
    const targetNode = document.getElementById("js-res-app");
    let filterContainer, countDisplay;

    const createFilterAndCountElements = () => {
        filterContainer = document.createElement("div");
        filterContainer.innerHTML = `
            <label for="reason-filter">Фильтр по причине завершения:</label>
            <select id="reason-filter"></select>
            <div id="reason-count-display" style="max-width: 200px; margin-top: 10px;"></div>
        `;
        container.insertBefore(filterContainer, targetNode);

        const reasonFilter = filterContainer.querySelector("#reason-filter");
        reasonFilter.addEventListener("change", filterClientSessions);

        countDisplay = filterContainer.querySelector("#reason-count-display");
    };

    const updateFilterAndCount = () => {
        const {uniqueReasons, reasonCounts} = getUniqueReasonsAndCounts();
        updateFilter(uniqueReasons);
        updateCountDisplay(reasonCounts);
    };

    const updateFilter = (uniqueReasons) => {
        const reasonFilter = document.getElementById("reason-filter");
        reasonFilter.innerHTML = `<option value="all">Все</option>${uniqueReasons
            .map((reason) => `<option value="${reason}">${reason}</option>`)
            .join("")}`;
    };

    const updateCountDisplay = (reasonCounts) => {
        if (!countDisplay) return;

        const sortedReasons = Object.entries(reasonCounts).sort(
            (a, b) => b[1] - a[1],
        );

        countDisplay.innerHTML = `
        <table style="width:100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid black; padding: 5px; text-align: center;">Разрыв</th>
                    <th style="border: 1px solid black; padding: 5px; text-align: center;">Кол-во</th>
                </tr>
            </thead>
            <tbody>
                ${sortedReasons
            .map(
                ([reason, count]) => `
                    <tr>
                        <td style="border: 1px solid black; padding: 5px;">${reason}</td>
                        <td style="border: 1px solid black; padding: 5px;">${count}</td>
                    </tr>
                `,
            )
            .join("")}
            </tbody>
        </table>
    `;
    };

    const filterClientSessions = () => {
        const filter = document.getElementById("reason-filter").value;
        const rows = document.querySelectorAll("#js-res-app table tbody tr");
        rows.forEach((row) => {
            const reasonCell = row.cells[6]; // 7th column (index 6)
            if (reasonCell) {
                row.style.display =
                    filter === "all" || reasonCell.textContent.includes(filter)
                        ? ""
                        : "none";
            }
        });
    };

    const getUniqueReasonsAndCounts = () => {
        const rows = document.querySelectorAll("#js-res-app table tbody tr");
        const reasonCounts = {};
        rows.forEach((row) => {
            const reason = row.cells[6]?.textContent.trim();
            if (reason) {
                reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
            }
        });
        return {
            uniqueReasons: Object.keys(reasonCounts),
            reasonCounts,
        };
    };

    const observerCallback = () => {
        if (document.querySelector("#js-res-app table tbody")) {
            if (!filterContainer) createFilterAndCountElements();
            updateFilterAndCount();
            filterClientSessions();
        }
    };

    if (targetNode) {
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, {childList: true, subtree: true});
    } else {
        observerCallback();
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
            const options = {year: "numeric", month: "2-digit", day: "2-digit"};
            document.querySelector(".js-active-from").value =
                currentDate.toLocaleDateString("ru-RU", options); // Устанавливаем значение в поле ввода

            // Нажимаем кнопку "Загрузить"
            loadDataButton.click();

            // Устанавливаем наблюдателя для изменения таблицы
            const observer = new MutationObserver(() => {
                updateReasonCounts(); // Обновляем количество найденных результатов
            });

            const targetNode = document.querySelector("#js-res-app table tbody");
            if (targetNode) {
                observer.observe(targetNode, {childList: true, subtree: true}); // Наблюдаем за изменениями
            }
        };
        loadDataButton.parentNode.insertBefore(button, loadDataButton.nextSibling); // Добавляем кнопку после кнопки "Загрузить"
    }
}

function hideNonActiveApps() {
    // Create observer to watch for table changes
    const observer = new MutationObserver((mutations) => {
        const appsTab = document.getElementById('tabs-2120');
        if (!appsTab || !appsTab.textContent) return;

        processAppsTable(appsTab);
    });

    // Start observing document changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function processAppsTable(appsTab) {
    const table = appsTab.querySelector('.table-condensed');
    if (!table || table.getAttribute('processed-by-helper') === "true") return;

    try {
        // Hide inactive/closed rows
        let hiddenRowsCount = hideInactiveRows(table);

        // Only add button if we have rows to hide
        if (hiddenRowsCount > 0) {
            addToggleAppsButton(appsTab);
        }

        // Mark table as processed
        table.setAttribute('processed-by-helper', "true");

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Скрытие элементов] Скрыто неактивных строк: ${hiddenRowsCount}`
        );
    } catch (error) {
        console.error(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Скрытие элементов] Ошибка:`,
            error
        );
    }
}

function hideInactiveRows(table) {
    let hiddenCount = 0;

    // Process each row starting from index 1 (skip header)
    for (let i = 1; i < table.rows.length; i++) {
        const row = table.rows[i];
        try {
            const status = row.cells[4]?.textContent;
            if (status === "Закрыт" || status === "Не активен") {
                row.style.display = "none";
                row.setAttribute("helper-hidden-row", "true");
                hiddenCount++;
            }
        } catch (error) {
            console.error(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Скрытие элементов] Ошибка обработки строки:`,
                error
            );
        }
    }

    return hiddenCount;
}

function addToggleAppsButton(container) {
    if (container.querySelector('#helper-toggle-rows')) return;

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.alignItems = "center";

    const toggleButton = document.createElement("button");
    toggleButton.id = "helper-toggle-rows";
    toggleButton.className = "btn btn-xs btn-primary helper";
    toggleButton.textContent = "👀 Развернуть скрытое";
    toggleButton.style.marginRight = "10px";
    toggleButton.setAttribute("data-state", "hidden");
    toggleButton.setAttribute("type", "button");

    // Create status text element
    const statusText = document.createElement("span");
    statusText.textContent = "Неактивные и закрытые приложения скрыты";
    statusText.style.color = "#dc3545"; // Start with red
    statusText.style.display = "inline";

    toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentState = toggleButton.getAttribute('data-state');
        const newState = currentState === 'hidden' ? 'visible' : 'hidden';
        const display = newState === 'hidden' ? 'none' : 'table-row';

        document.querySelectorAll('[helper-hidden-row="true"]')
            .forEach(row => row.style.display = display);

        toggleButton.textContent = newState === 'hidden' ? '👀 Развернуть скрытое' : '🙈 Свернуть';
        toggleButton.setAttribute('data-state', newState);

        // Update status text based on state
        if (newState === 'hidden') {
            statusText.textContent = "Неактивные и закрытые приложения скрыты";
            statusText.style.color = "#dc3545"; // Red
        } else {
            statusText.textContent = "Отображены все приложения";
            statusText.style.color = "#198754"; // Bootstrap's success green color
        }
        statusText.style.display = 'inline';
    });

    toggleButton.onclick = null;

    // Add button and status text to container div
    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(statusText);

    // Add a line break after container
    const lineBreak = document.createElement("br");
    container.insertBefore(lineBreak, container.firstChild);

    // Add container to main container
    container.insertBefore(buttonContainer, lineBreak);
}

function hideInformationRows() {
    // Get main container and verify content existence
    const informationTab = document.getElementById('tabs-2444');
    if (!informationTab?.textContent) return;

    // Find table container and table
    const tableContainer = informationTab.querySelector('.col-sm-8');
    const table = tableContainer?.querySelector('.table-condensed');
    if (!table || table.getAttribute('script-processed') === "true") return;

    const rowsToHide = [
        "Статус:",
        "Схема оплаты:",
        "",
        "Категория:",
        "Контактные e-mail:",
        "Место рождения",
        "Активные приложения",
        "Промо-пакет",
        "Идентификационные данные",
        "Автоплатеж"
    ];

    try {
        // Process table rows starting from index 2
        Array.from(table.rows).slice(2).forEach(row => {
            const firstCell = row.cells[0]?.textContent;
            if (rowsToHide.includes(firstCell)) {
                row.style.display = "none";
                row.setAttribute("helper-hidden-row", "true");
            }
        });

        if (informationTab.getAttribute('buttons-added') !== "true") {
            addToggleInfoButton(tableContainer);
            informationTab.setAttribute('buttons-added', "true");
        }

        table.setAttribute('script-processed', "true");
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Клиентская информация] Ошибка обработки таблицы:`, error);
    }
}

function addToggleInfoButton(container) {
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.marginBottom = "10px";
    buttonContainer.style.alignItems = "center";

    const toggleButton = document.createElement("button");
    toggleButton.id = "helper-toggle-rows";
    toggleButton.className = "btn btn-xs btn-primary helper";
    toggleButton.textContent = "👀 Показать поля";
    toggleButton.setAttribute("data-state", "hidden");
    toggleButton.setAttribute("type", "button");
    toggleButton.style.marginRight = "10px";

    toggleButton.setAttribute("title", "Скрыты следующие поля в таблице: Статус, Схема оплаты, Категория, Контактные e-mail, Место рождения, Активные приложения, Промо-пакет, Идентификационные данные, Автоплатеж");

    toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentState = toggleButton.getAttribute('data-state');
        const newState = currentState === 'hidden' ? 'visible' : 'hidden';
        const display = newState === 'hidden' ? 'none' : 'table-row';

        document.querySelectorAll('[helper-hidden-row="true"]')
            .forEach(row => row.style.display = display);

        toggleButton.textContent = newState === 'hidden' ? '👀 Показать поля' : '🙈 Скрыть поля';
        toggleButton.setAttribute('data-state', newState);
    });

    const link = document.querySelector('a.not_mobil_tech#lk'); // Get the existing link
    if (link) {
        link.textContent = "🚪 ЛК клиента";
        link.classList.add('btn', 'btn-primary', 'btn-xs'); // Add classes
        link.style.marginRight = '10px';
        link.style.textDecoration = 'none'; // Add margin to separate from toggle button
        buttonContainer.appendChild(link); // Append the link first
        buttonContainer.appendChild(toggleButton); // Append the toggle button next
    }

    container.insertBefore(buttonContainer, container.firstChild);
}

function handleServiceRequests() {
    const observer = new MutationObserver((mutations) => {
        const serviceContainer = document.getElementById('lazy_content_2445');
        if (!serviceContainer?.textContent) return;

        const requestsContainer = serviceContainer.querySelector('#tc_ppd_tp_cz');
        if (!requestsContainer || requestsContainer.getAttribute('processed-by-helper') === "true") return;

        processServiceRequests(requestsContainer);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false,
        attributes: false
    });
}

const COMPLETION_STATUSES = [
    'Выполнено (Отправить в Call-центр)',
    'Заявка выполнена',
    'Выполнено',
    'Помощь оказана',
];

function processServiceRequests(container) {
    try {
        const tables = container.querySelectorAll('table.border');
        tables.forEach(table => {
            const rows = Array.from(table.querySelectorAll('tr')).slice(1); // Skip header row
            if (rows.length < 2) return;

            // Check last non-detail row for completion status
            const lastContentRow = rows[rows.length - 2]; // -2 to skip the details row
            const lastRowStatus = lastContentRow?.cells[2]?.textContent.trim();

            if (COMPLETION_STATUSES.includes(lastRowStatus)) {
                const requestId = Math.random().toString(36).substr(2, 9);
                const firstRow = rows[0];
                const detailRow = rows[rows.length - 1];
                const middleRows = rows.slice(1, -2);

                // Show only first and last content rows
                firstRow.style.display = 'table-row';
                lastContentRow.style.display = 'table-row';
                detailRow.style.display = 'table-row';

                // Hide all middle rows
                middleRows.forEach(row => {
                    row.style.display = 'none';
                    row.setAttribute('data-request-id', requestId);
                });

                // Add toggle button if there are middle rows
                if (middleRows.length > 0) {
                    addToggleButton(table, requestId, middleRows.length, firstRow, lastContentRow);
                }
            }
        });

        container.setAttribute('processed-by-helper', "true");
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Сервисные заявки] Обработка завершена`
        );
    } catch (error) {
        console.error(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Сервисные заявки] Ошибка:`,
            error
        );
    }
}

function addToggleButton(table, requestId, hiddenCount, firstRow, lastRow) {
    const button = document.createElement('a');
    button.style.cssText = 'cursor:pointer; color:#0d6efd; text-decoration:none; padding:5px; display:block; text-align:center;';
    updateButtonState(button, false);

    button.addEventListener('click', function (e) {
        e.preventDefault();
        const isVisible = this.getAttribute('data-state') === 'visible';
        const newState = isVisible ? 'hidden' : 'visible';

        const rows = document.querySelectorAll(`[data-request-id="${requestId}"]`);
        rows.forEach(row => {
            row.style.display = newState === 'visible' ? 'table-row' : 'none';
        });

        updateButtonState(this, !isVisible);
    });

    // Create a new row for the button
    const buttonRow = document.createElement('tr');
    buttonRow.style.backgroundColor = "#dcdcdc"
    const buttonCell = document.createElement('td');
    buttonCell.colSpan = firstRow.cells.length; // Span all columns
    buttonCell.appendChild(button);
    buttonRow.appendChild(buttonCell);

    // Insert after the first row
    firstRow.parentNode.insertBefore(buttonRow, firstRow.nextSibling);

    return button;
}

function updateButtonState(button, isVisible) {
    button.setAttribute('data-state', isVisible ? 'visible' : 'hidden');
    button.textContent = isVisible ? '🔽 Скрыть промежуточные шаги' : '▶️ Показать промежуточные шаги';
    button.style.fontSize = "12px"
}

// Helper function for pluralization
function pluralize(number, one, two, five) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
}

function initializeAppealsTable() {
    // Create observer to watch for table changes
    const observer = new MutationObserver((mutations) => {
        const container = document.getElementById('lazy_content_2448');
        if (!container || !container.textContent) return;

        processAppealsTable(container);
    });

    // Start observing document changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function processAppealsTable(container) {
    const table = container.querySelector('table.border');
    if (!table || table.getAttribute('processed-by-helper') === 'true') return;

    try {
        const appealCounter = processTableRows(table);

        // Only add button if we have appeals to process
        if (appealCounter > 0) {
            addToggleAppealsButton(container);
        }

        // Mark table as processed
        table.setAttribute('processed-by-helper', 'true');

        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Обработано обращений: ${appealCounter}`
        );
    } catch (error) {
        console.error(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Ошибка:`,
            error
        );
    }
}

function processTableRows(table) {
    let appealCounter = 0;
    let currentHiddenCount = 0;
    let lastFirstRow = null;
    const rows = Array.from(table.rows).slice(2); // Skip header rows

    rows.forEach((row, index) => {
        const currentRowIndex = index + 2;
        const firstCell = row.cells[0];

        if (firstCell.textContent === '1') {
            // If we have previous hidden rows, insert summary row
            if (currentHiddenCount > 0 && lastFirstRow) {
                insertSummaryRow(table, lastFirstRow.rowIndex + 1, currentHiddenCount);
                currentHiddenCount = 0;
            }

            appealCounter++;
            lastFirstRow = row;
            setupRowClick(row, appealCounter, 'hide');
        }

        row.setAttribute('appeal-number', appealCounter);
        const isHidden = processAppealStep(table, row, currentRowIndex, appealCounter);
        if (isHidden) currentHiddenCount++;
    });

    // Handle last group of hidden rows
    if (currentHiddenCount > 0 && lastFirstRow) {
        insertSummaryRow(table, lastFirstRow.rowIndex + 1, currentHiddenCount);
    }

    return appealCounter;
}

function processAppealStep(table, row, currentRowIndex, appealCounter) {
    try {
        const firstCell = row.cells[0];
        const nextRow = table.rows[currentRowIndex + 1];
        if (!nextRow) return false;

        const nextCell = nextRow.cells[0];
        const isNextAppealStart = nextCell.textContent === '1';
        const isNextRowSpanned = Number(nextCell.getAttribute('colspan')) >= 13;

        if (firstCell.textContent !== '1' && !isNextAppealStart && !isNextRowSpanned) {
            row.setAttribute('appeal-step', 'intermediate');
            row.style.display = 'none';
            return true; // Row is hidden
        } else if (isNextAppealStart || isNextRowSpanned) {
            row.setAttribute('appeal-step', 'last');
            setupRowClick(row, appealCounter, 'show');
        }
        return false; // Row is visible
    } catch (error) {
        console.error(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Обращения] Ошибка обработки шага:`,
            error
        );
        return false;
    }
}

function insertSummaryRow(table, position, hiddenCount) {
    const row = table.insertRow(position);
    const cell = row.insertCell(0);

    row.classList.add('helper-summary-row');
    row.setAttribute('appeal-step', 'summary');

    cell.colSpan = table.rows[0].cells.length;
    cell.style.cssText = 'text-align: center; background-color: #f8f9fa; color: #6c757d; padding: 4px; font-style: italic; border-bottom: 1px dashed #dee2e6;';
    cell.textContent = `Скрыто ${hiddenCount} ${pluralize(hiddenCount, 'шаг', 'шага', 'шагов')}`;
}

function setupRowClick(row, appealCounter, action) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
        const selector = `[appeal-number="${appealCounter}"][appeal-step="intermediate"]`;
        const display = action === 'show' ? 'table-row' : 'none';

        document.querySelectorAll(selector).forEach(elem => {
            elem.style.display = display;
        });
    });
}

function addToggleAppealsButton(container) {
    if (container.querySelector('#helper-toggle-appeals')) return;

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; align-items: center; margin: 10px 0;';

    const toggleButton = document.createElement('button');
    toggleButton.id = 'helper-toggle-appeals';
    toggleButton.className = 'btn btn-xs btn-primary helper';

    const totalHidden = document.querySelectorAll('[appeal-step="intermediate"]').length;
    toggleButton.textContent = `👀 Показать промежуточные шаги (${totalHidden})`;
    toggleButton.style.marginRight = '10px';
    toggleButton.setAttribute('data-state', 'hidden');
    toggleButton.setAttribute('type', 'button');

    const statusText = document.createElement('span');
    statusText.textContent = 'Промежуточные шаги скрыты';
    statusText.style.color = '#dc3545';

    toggleButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const currentState = toggleButton.getAttribute('data-state');
        const newState = currentState === 'hidden' ? 'visible' : 'hidden';
        const display = newState === 'hidden' ? 'none' : 'table-row';

        const intermediateSteps = document.querySelectorAll('[appeal-step="intermediate"]');
        const summaryRows = document.querySelectorAll('[appeal-step="summary"]');

        intermediateSteps.forEach(row => row.style.display = display);
        summaryRows.forEach(row => row.style.display = newState === 'hidden' ? 'table-row' : 'none');

        const totalHidden = intermediateSteps.length;
        toggleButton.textContent = newState === 'hidden' ?
            `👀 Показать промежуточные шаги (${totalHidden})` :
            '🙈 Скрыть промежуточные шаги';
        toggleButton.setAttribute('data-state', newState);

        statusText.textContent = newState === 'hidden' ?
            'Промежуточные шаги скрыты' :
            'Отображены все шаги обращений';
        statusText.style.color = newState === 'hidden' ? '#dc3545' : '#198754';
    });

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(statusText);
    container.insertBefore(buttonContainer, container.firstChild);
}

async function allowCopy() {
    setTimeout(async () => {
        const waiter = document.getElementById("waiter");
        if (!waiter) return;

        const {parentNode: parent} = waiter;
        parent.style = "";
        parent.onselectstart = "";

        const formform = document.getElementById("formform");
        if (!formform) return;

        [waiter, formform].forEach((el) => {
            el.onmousedown = el.onselectstart = (event) => event.stopPropagation();
        });
    }, 2000);
}