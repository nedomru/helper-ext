/**
 * Copy and check MAC address
 * @returns {Promise<void>}
 */
async function copyMAC() {
    // Cache style creation check
    if (!document.getElementById("helper-button-styles")) {
        const style = document.createElement("style");
        style.id = "helper-button-styles";
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

    // Cache for MAC lookup results
    const macLookupCache = new Map();

    // Debounce function
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    async function lookupMAC(macAddress) {
        if (macLookupCache.has(macAddress)) {
            return macLookupCache.get(macAddress);
        }

        try {
            const response = await fetch(`https://api.maclookup.app/v2/macs/${macAddress}`);
            if (!response.ok) throw new Error(response.status);
            const result = await response.json();
            macLookupCache.set(macAddress, result);
            return result;
        } catch (error) {
            error("MAC lookup error:", error);
            throw error;
        }
    }

    function createButtonGroup(macAddress) {
        const fragment = document.createDocumentFragment();
        const buttonGroup = document.createElement("div");
        buttonGroup.className = "helper-button-group";

        const buttons = [{
            class: "helper-button-left", text: "📋", title: "Копировать MAC", onClick: async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    await copyText(macAddress);
                    $.notify("MAC-адрес скопирован", "success");
                } catch (error) {
                    $.notify("Ошибка при копировании MAC-адреса", "error");
                }
            }
        }, {
            class: "helper-button-right", text: "🔎", title: "Проверить MAC", onClick: async (e) => {
                e.preventDefault();
                e.stopPropagation();
                try {
                    const result = await lookupMAC(macAddress);
                    if (result.company) {
                        $.notify(result.company, "success");
                    } else {
                        $.notify("Не удалось найти MAC в базе", "error");
                    }
                } catch (error) {
                    if (error.message === "429") {
                        $.notify("Превышен лимит запросов (2 в сек)", "error");
                    } else {
                        $.notify("Ошибка при поиске информации о MAC", "error");
                    }
                }
            }
        }];

        buttons.forEach(({class: className, text, title, onClick}) => {
            const button = document.createElement("button");
            button.className = `helper-button ${className}`;
            button.textContent = text;
            button.title = title;
            button.addEventListener("click", onClick);
            buttonGroup.appendChild(button);
        });

        fragment.appendChild(buttonGroup);
        return fragment;
    }

    function processMACs(container) {
        document.createDocumentFragment();
        const macElements = container.querySelectorAll(".mac, .js-get-vendor-by-mac");

        macElements.forEach(elem => {
            if (!elem.nextElementSibling?.classList.contains("helper-button-group")) {
                const buttonGroup = createButtonGroup(elem.innerText);
                elem.parentElement.appendChild(buttonGroup);
            }
        });
    }

    const debouncedProcess = debounce((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === "childList") {
                processMACs(mutation.target);
            }
        });
    }, 100);

    if (window._macObserver) {
        window._macObserver.disconnect();
        window._macObserver = null;
    }

    const targetNode = document.getElementById("js-res-app");
    if (targetNode && document.URL.includes("db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id")) {
        window._macObserver = new MutationObserver(debouncedProcess);
        window._macObserver.observe(targetNode, {childList: true, subtree: true});
    }

    // Initial processing
    processMACs(document);
}

/**
 * Copy and check IP address
 */
async function copyIP() {
    // Add styles only once
    if (!document.getElementById('helper-ip-styles')) {
        const style = document.createElement('style');
        style.id = 'helper-ip-styles';
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
    }

    // Cache for IP lookups
    const ipCache = new Map();

    // IP status determination
    const getIPStatus = (ip) => {
        switch (true) {
            case ip.startsWith('100.'):
                return 'За NAT';
            case ip.startsWith('10.'):
                return 'Серый';
            case ip.startsWith('172.'):
                return 'Без доступа';
            default:
                return 'Белый';
        }
    };

    // Create buttons with optimized event handling
    const createButtonGroup = (ip, ipStatus) => {
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'helper-button-group';

        const buttons = [{
            text: '📋', className: 'helper-button-left', title: 'Копировать IP', onClick: async (e) => {
                e.preventDefault();
                try {
                    await copyText(ip);
                    $.notify('IP-адрес скопирован', 'success');
                } catch (err) {
                    await copyText(ip);
                    $.notify('IP-адрес скопирован', 'success');
                }
            }
        }, {
            text: '🔎', className: 'helper-button-right', title: 'Проверить IP', onClick: async (e) => {
                e.preventDefault();
                try {
                    let data;
                    if (ipCache.has(ip)) {
                        data = ipCache.get(ip);
                    } else {
                        const response = await fetch(`https://api.ipquery.io/${ip}`);
                        if (!response.ok) throw new Error('Network response was not ok');
                        data = await response.json();
                        ipCache.set(ip, data);
                    }

                    $.notify(`Город: ${data.location?.city || 'Неизвестно'}\nТип IP: ${ipStatus}`, 'success');
                } catch (error) {
                    error('Error checking IP:', error);
                    $.notify('Не удалось проверить IP', 'error');
                }
            }
        }];

        buttons.forEach(({text, className, title, onClick}) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = `helper-button ${className}`;
            button.title = title;
            button.addEventListener('click', onClick);
            buttonGroup.appendChild(button);
        });

        return buttonGroup;
    };

    // Process all IP elements in batches
    const processIPElements = () => {
        document.createDocumentFragment();
        const ipContainers = document.querySelectorAll('.ip');

        ipContainers.forEach(container => {
            const ipElement = container.querySelector('acronym');
            if (!ipElement || ipElement.nextElementSibling?.classList.contains('helper-button-group')) return;

            const ip = ipElement.textContent;
            const ipStatus = getIPStatus(ip);
            const buttonGroup = createButtonGroup(ip, ipStatus);
            ipElement.insertAdjacentElement('afterend', buttonGroup);
        });
    };

    // Debounce function to prevent multiple rapid executions
    const debounce = (fn, delay = 100) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(null, args), delay);
        };
    };

    // Execute the main function with debouncing
    const debouncedProcess = debounce(processIPElements);
    debouncedProcess();
}

/**
 * Copy available time slots of service request to clipboard
 */
async function copyTimeSlots() {
    const formatOptions = (options) => {
        return options
            .filter((option) => option.value && !option.text.includes("Выберите время") && !option.text.includes("«Абонент не может быть дома!»"))
            .map((option) => {
                const [startTime, endTime] = option.text.split(" - ");
                const startHour = startTime.trim().split(":")[0].padStart(2, "0");
                const endHour = endTime.trim().split(" ")[0].split(":")[0].padStart(2, "0");
                return `${startHour}-${endHour}`;
            })
            .join(", ");
    };

    const observer = new MutationObserver(() => {
        const targetNode = document.getElementById("uni_tech_time_req");
        if (targetNode && !targetNode.nextElementSibling?.classList.contains("btn")) {
            const button = document.createElement("button");
            button.classList.add("btn", "btn-sm", "btn-primary", "helper");
            button.textContent = "📋 Слоты";
            button.style.marginLeft = "10px";
            button.style.display = "inline-block";

            button.addEventListener("click", () => {
                const formattedOptions = formatOptions(Array.from(targetNode.options).filter((option) => option.value && option.classList.contains("time_one")));
                copyText(formattedOptions);
                $.notify("Слоты скопированы", "success");
            });

            targetNode.insertAdjacentElement("afterend", button);
            targetNode.parentNode.style.display = "flex";
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
}

/**
 * Copy client card from info tab to clipboard
 */
function copyClientCard() {
    const clientCardShowButton = document.getElementById("write_let");
    const clientCardRow = document.getElementById("namcl");
    if (document.querySelector(".helper-card") != null) {
        return;
    }
    try {
        // Opening card to trigger generation of card text
        clientCardShowButton.click();
    } catch (e) {
        warn(`[Хелпер] - [АРМ] - [Копирование карточки] Не найдена карточка клиента`,);
        return;
    }

    const clientCardText = $("#to_copy").val();

    // Close card
    clientCardShowButton.click();

    const clientCard = clientCardRow.previousElementSibling;
    const lineBreak = document.createElement("br");

    const copyButton = document.createElement("button");
    copyButton.textContent = "📋 Карточка";
    copyButton.classList.add("btn", "btn-primary", "btn-xs", "helper-card"); // Добавляем классы для стилизации

    copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        copyText(clientCardText);
        $.notify("Карточка скопирована", "success");
    });
    clientCard.appendChild(lineBreak);
    clientCard.appendChild(copyButton);

    info(`[Хелпер] - [АРМ] - [Копирование] Добавлена кнопка копирования карточки`,);
}

/**
 * Send client card example to duty
 */
async function sendClientCardExample() {
    const clientCardShowButton = document.getElementById("write_let");
    const clientCardRow = document.getElementById("namcl");
    if (document.querySelector(".helper-example-card") != null) {
        return;
    }
    try {
        // Opening card to trigger generation of card text
        clientCardShowButton.click();
    } catch (e) {
        warn(`[Хелпер] - [АРМ] - [Отправка примеров] Не найдена карточка клиента`,);
        return;
    }

    const clientCardText = $("#to_copy").val();

    let formattedClientCardText = clientCardText
        .replace(/&nbsp;/g, ' ')
        .split("\n")
        .join("<br>");

    // Close card
    clientCardShowButton.click();

    const clientCard = clientCardRow.previousElementSibling;
    const lineBreak = document.createElement("br");

    const sendExampleButton = document.createElement("button");
    sendExampleButton.textContent = "📨 Отправить пример";
    sendExampleButton.classList.add("btn", "btn-warning", "btn-xs", "helper-example-card",);
    sendExampleButton.style.marginTop = "5px";

    sendExampleButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        let userMessage = prompt("Введи сообщение к примеру для отправки дежурному",);
        if (userMessage.length < 1) {
            $.notify("Сообщение не может быть пустым");
            return;
        }
        const response = await fetch("https://okc2.ertelecom.ru/yii/api/line-mail-example/send-example-mail", {
            credentials: "include", headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            }, body: `message=${formattedClientCardText}<br><br>${userMessage}&lineAppId=3`, method: "POST",
        },);

        try {
            const responseData = await response.json();

            if (responseData.success === true) {
                $.notify("Пример успешно отправлен", "success");
                info(`[Хелпер] - [Пример договора] Пример успешно отправлен`);
            } else {
                $.notify("Не удалось отправить пример");
                error(`[Хелпер] - [Пример договора] Ошибка отправки: ${JSON.stringify(responseData)}`,);
            }
        } catch (error) {
            $.notify("Не удалось отправить пример");
            error(`[Хелпер] - [Пример договора] Произошла ошибка: ${error}`);
        }
    });
    clientCard.appendChild(lineBreak);
    clientCard.appendChild(sendExampleButton);

    info(`[Хелпер] - [АРМ] - [Пример договора] Добавлена кнопка отправки примера`,);
}

/**
 * Copy client agreement number to clipboard
 */
async function copyClientAgreement() {
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
    copyButton.classList.add("btn", "btn-primary", "btn-xs", "helper-agreement");

    copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        copyText(agreement_number.textContent);
        $.notify("Номер договора скопирован", "success");
    });

    agreementBeforeTab.appendChild(lineBreak);
    agreementBeforeTab.appendChild(copyButton);

    info(`[Хелпер] - [АРМ] - [Копирование] Добавлена кнопка копирования договора`,);
}

/**
 * Copy client address to clipboard
 */
async function copyClientAddress() {
    let address_text;
    const settings = await browser.storage.sync.get("ARM_copyClientAddressWithoutCity",);

    if (document.querySelector(".helper-address") != null) {
        return;
    }
    try {
        address_text = document.getElementById("dr").innerText;
    } catch (e) {
        return;
    }
    if (!address_text) {
        address_text = document.getElementById("#dr").innerText;
    }

    // Checking for index existing in address string
    const postcode_regex = /\d{6}|\d{3}/;
    const substring_to_check = address_text.substring(0, 6); // Getting 6 first symbols from address
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


    const address = document.querySelector("#dr").previousElementSibling;
    const lineBreak = document.createElement("br");

    const copyButton = document.createElement("button");
    copyButton.textContent = "📋 Адрес";
    copyButton.classList.add("btn", "btn-primary", "btn-xs", "helper-address"); // Добавляем классы для стилизации

    copyButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        copyText(address_text);
        $.notify("Адрес скопирован", "success");
    });

    address.appendChild(lineBreak);
    address.appendChild(copyButton);

    info(`[Хелпер] - [АРМ] - [Копирование адреса] Добавлена кнопка копирования адреса`,);
}

/**
 * Helper function to copy text to clipboard
 * @param text {string} Text to copy to clipboard
 */
async function copyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
    } catch (err) {
        error("[Хелпер] - [Копирование текста] Не удалось скопировать текст, ошибка: ", err,);
    }
    document.body.removeChild(textarea);
}

/**
 * Left frame buttons to register requests
 */
async function leftFrame_fastAppeals() {
    if (document.querySelector(".helper-appeal-button") != null) {
        return;
    }

    const container = document.querySelector(".create_request_block");
    if (!container) return;

    const categories = {
        "Открытое": [], "Закрытое": [], "Быстрый чат": [],
    };

    const settingsKeys = ["ARM_changeRequestFBLF_FastChat_Accident", "ARM_changeRequestFBLF_Open_VhodNRD", "ARM_changeRequestFBLF_Open_KCNCK2", "ARM_changeRequestFBLF_Open_KCNCK1", "ARM_changeRequestFBLF_Closed_NoPages", "ARM_changeRequestFBLF_Closed_NoSession", "ARM_changeRequestFBLF_Closed_LowSpeed", "ARM_changeRequestFBLF_Closed_Disconnections", "ARM_changeRequestFBLF_Closed_NoTV", "ARM_changeRequestFBLF_Open_Ticket", "ARM_changeRequestFBLF_Open_Youtube", "ARM_changeRequestFBLF_Closed_CancelSZ", "ARM_changeRequestFBLF_FastChat_NoDiagnostic", "ARM_changeRequestFBLF_FastChat_DZ", "ARM_changeRequestFBLF_Open_Abon", "ARM_changeRequestFBLF_Open_AbonPriost", "ARM_changeRequestFBLF_Closed_ServiceEng",];

    // Getting user settings
    const settings = await Promise.all(settingsKeys.map((key) => browser.storage.sync.get(key)),);

    const buttons = [];

    // Check settings and add buttons to a button array
    if (settings[0][settingsKeys[0]]) {
        buttons.push({
            value: "Авария",
            class: "helper helper-appeal-button",
            action: fastChat_Accident,
            category: "Быстрый чат",
            tooltip: "Продукт - не изменяется. Авария/ППР > Авария"
        });
    }

    if (settings[1][settingsKeys[1]]) {
        buttons.push({
            value: "ВХОД НРД",
            class: "helper helper-appeal-button",
            action: handleNRD,
            category: "Открытое",
            tooltip: "Продукт не изменяется. НСК Вход > Намерение расторгнуть договор > ..."
        });
    }

    if (settings[2][settingsKeys[2]]) {
        buttons.push({
            value: "КС НЦК2",
            class: "helper helper-appeal-button",
            action: handleKCNCK2Click,
            category: "Открытое",
            tooltip: "Продукт не изменяется. ОЦТП Исход > Контакт сорвался > ..."
        });
    }

    if (settings[3][settingsKeys[3]]) {
        buttons.push({
            value: "КС НЦК1",
            class: "helper helper-appeal-button",
            action: handleKCNCK1Click,
            category: "Открытое",
            tooltip: "Продукт не изменяется. Онлайн Вход > Контакт сорвался > ..."
        });
    }

    if (settings[4][settingsKeys[4]]) {
        buttons.push({
            value: "Неоткрывашки",
            class: "helper helper-appeal-button",
            action: handleClosed_NoPages,
            category: "Закрытое",
            tooltip: "Интернет. Настройка и диагностика > Не открываются страницы > Не открываются все страницы"
        });
    }

    if (settings[5][settingsKeys[5]]) {
        buttons.push({
            value: "Нет сессии",
            class: "helper helper-appeal-button",
            action: handleClosed_NoSession,
            category: "Закрытое",
            tooltip: "Интернет. Настройка и диагностика > Отсутствует подключение к интернету > ..."
        });
    }

    if (settings[6][settingsKeys[6]]) {
        buttons.push({
            value: "Низкая",
            class: "helper helper-appeal-button",
            action: handleClosed_LowSpeed,
            category: "Закрытое",
            tooltip: "Продукт не изменяется. Настройка и диагностика > Низкая скорость > Низкая скорость открытия страниц"
        });
    }

    if (settings[7][settingsKeys[7]]) {
        buttons.push({
            value: "Разрывы",
            class: "helper helper-appeal-button",
            action: handleClosed_Disconnections,
            category: "Закрытое",
            tooltip: "Интернет. Настройка и диагностика > Разрывы связи > Пропадает соединение с интернет"
        });
    }

    if (settings[8][settingsKeys[8]]) {
        buttons.push({
            value: "Нет вещания",
            class: "helper helper-appeal-button",
            action: handleClosed_NoTV,
            category: "Закрытое",
            tooltip: "Телевидение. Настройка и диагностика > Отсутствие вещания на каналах > Нет вещания на всех каналах"
        });
    }

    if (settings[9][settingsKeys[9]]) {
        buttons.push({
            value: "Тикет",
            class: "helper helper-appeal-button",
            action: handleOpen_Ticket,
            category: "Открытое",
            tooltip: "Продукт не изменяется. Онлайн - Входящая связь > Обращение из Email > ..."
        });
    }

    if (settings[10][settingsKeys[10]]) {
        buttons.push({
            value: "Youtube",
            class: "helper helper-appeal-button",
            action: handleOpen_Youtube,
            category: "Открытое",
            tooltip: "Интернет. Настройка и диагностика > Низкая скорость > Низкая скорость YouTube"
        });
    }

    if (settings[11][settingsKeys[11]]) {
        buttons.push({
            value: "Отмена СЗ",
            class: "helper helper-appeal-button",
            action: handleClosed_CancelSZ,
            category: "Закрытое",
            tooltip: "Продукт не изменяется. Технический сервис > Отмена СЗ"
        });
    }

    if (settings[12][settingsKeys[12]]) {
        buttons.push({
            value: "Без диагностики",
            class: "helper helper-appeal-button",
            action: fastChat_NoDiagnostic,
            category: "Быстрый чат",
            tooltip: "Продукт не изменяется. Настройка и диагностика > Не открываются страницы > Не открываются все страницы"
        });
    }

    if (settings[13][settingsKeys[13]]) {
        buttons.push({
            value: "Отключ ДЗ",
            class: "helper helper-appeal-button",
            action: fastChat_DZ,
            category: "Быстрый чат",
            tooltip: "Продукт не изменяется. Начисления и платежи > Начисления или баланс > Закрыт доступ по причине ДЗ"
        });
    }

    if (settings[14][settingsKeys[14]]) {
        buttons.push({
            value: "Абон Деньги",
            class: "helper helper-appeal-button",
            action: handle_naAbon,
            category: "Открытое",
            tooltip: "Продукт не изменяется. Онлайн - Входящая связь > Начисления и платежи > Начисления или баланс > Запрос баланса"
        });
    }

    if (settings[15][settingsKeys[15]]) {
        buttons.push({
            value: "Абон Приост",
            class: "helper helper-appeal-button",
            action: handle_naAbonPriost,
            category: "Открытое",
            tooltip: "Продукт не изменяется. Онлайн - Входящая связь > Консультация по сервисам и услугам > Консультация по условиям приостановления"
        });
    }

    if (settings[16][settingsKeys[16]]) {
        buttons.push({
            value: "СИ",
            class: "helper helper-appeal-button",
            action: handleClosed_ServiceEng,
            category: "Закрытое",
            tooltip: "Продукт не изменяется. Технологический класс > Обращение сервисного инженера > ..."
        });
    }

    buttons.forEach((button) => {
        if (categories[button.category]) {
            categories[button.category].push(button);
        }
    });

    const fragment = document.createDocumentFragment();
    const categoryButtonsDiv = document.createElement("div");
    categoryButtonsDiv.className = "category-appeal-buttons";
    fragment.appendChild(categoryButtonsDiv);

    Object.entries(categories).forEach(([categoryName, categoryButtons]) => {
        if (categoryButtons.length > 0) {
            const categoryButton = document.createElement("button");
            categoryButton.textContent = categoryName;
            categoryButton.className = "category-appeal-toggle";
            categoryButtonsDiv.appendChild(categoryButton);

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "button-appeal-container";
            buttonContainer.style.display = "none";

            categoryButtons.forEach((button) => {
                const btnElement = document.createElement("input");
                btnElement.setAttribute("type", "button");
                btnElement.setAttribute("class", button.class);
                btnElement.setAttribute("value", button.value);

                // Add tooltip as title attribute
                if (button.tooltip) {
                    btnElement.setAttribute("title", button.tooltip);
                    btnElement.setAttribute("data-tooltip", button.tooltip);
                }

                btnElement.addEventListener("click", button.action);
                btnElement.style.backgroundColor = "#337ab7";
                btnElement.style.color = "white";
                btnElement.style.marginBottom = "3px";
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
          .category-appeal-buttons, .category-sr-buttons {
              display: flex;
              flex-wrap: wrap;
              gap: 2px;
              margin-bottom: 4px;
          }
          .category-appeal-toggle, .category-sr-toggle {
              padding: 2px 5px;
              background-color: #f0f0f0;
              border: 1px solid #ccc;
              border-radius: 2px;
              cursor: pointer;
          }
          .category-appeal-toggle:hover, .category-sr-toggle:hover {
              background-color: #e0e0e0;
          }
          .button-appeal-container, .button-sr-container {
              margin-bottom: 6px;
          }
          .category-appeal-toggle.active, .category-sr-toggle.active {
              background-color: #d0d0d0;
              font-weight: bold;
              box-shadow: 0 0 5px rgba(0,0,0,0.2);
          }
        .helper-appeal-button, .helper-sr-button {
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
          position: relative;
          transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          vertical-align: middle;
          white-space: nowrap;
          word-wrap: break-word;
        }

        .helper-appeal-button:hover, .helper-sr-button:hover {
          background-color: #d6d6d6 !important;
          text-decoration: none;
          transition-duration: 0.1s;
        }

        /* Tooltip styles - Option 1: Using native title attribute */
        [title] {
          position: relative;
          cursor: help;
        }

        /* Custom tooltip styles - Option 2: Enhanced custom tooltips */
        [data-tooltip] {
          position: relative;
        }

        [data-tooltip]:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          z-index: 1000;
          background-color: #333;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          bottom: 120%;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          pointer-events: none;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }

        [data-tooltip]:hover::before {
          content: '';
          position: absolute;
          border: 5px solid transparent;
          border-top-color: #333;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }

        .helper-appeal-button:disabled, .helper-sr-button:disabled {
          background-color: #FAFBFC;
          border-color: rgba(27, 31, 35, 0.15);
          color: #959DA5;
          cursor: default;
        }

        .helper-appeal-button:active, .helper-sr-button:active {
          background-color: #EDEFF2;
          box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
          transition: none 0s;
        }

        .helper-appeal-button:focus, .helper-sr-button:focus {
          outline: 1px transparent;
        }

        .helper-appeal-button:before, .helper-sr-button:before {
          display: none;
        }

        .helper-appeal-button:-webkit-details-marker, .helper-sr-button:-webkit-details-marker {
          display: none;
        }
      `;
    document.head.appendChild(style);

    const changeEvent = new Event("change", {
        bubbles: true, cancelable: true,
    });

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

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

    async function handle_naAbon() {
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
        });
    }

    async function handle_naAbonPriost() {
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

        waitForElement(".comment_text", (substep) => {
            substep.value = "Требуется консультация по условиям приостановления, просьба помочь";
        });
    }

    function handleClosed_NoPages() {
        const product = document.querySelector(".uni_reas_prod");

        if (product.value !== "70") {
            product.value = "70";
            product.dispatchEvent(changeEvent);

            waitForElement("td.uni_reas_obj_prob_class", () => {
                waitForElement(".uni_reas_step", (element) => {
                    element.value = "-1";
                    element.dispatchEvent(changeEvent);

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
                }, true);
            });
        } else {
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
            })
        }
    }

    function handleClosed_NoSession() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "70") {
            product.value = "70";
            product.dispatchEvent(changeEvent);

            waitForElement("td.uni_reas_obj_prob_class", () => {
                waitForElement(".uni_reas_step", (element) => {
                    element.value = "-1";
                    element.dispatchEvent(changeEvent);

                    waitForElement(".uni_load_obj_reason", (substep) => {
                        substep.value = "1046";
                        substep.dispatchEvent(changeEvent);
                    });

                    waitForElement(".uni_load_main_reason", (substep) => {
                        substep.value = "18378";
                        substep.dispatchEvent(changeEvent);
                    });
                }, true);
            });
        } else {
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
    }

    function handleClosed_LowSpeed() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "70") {
            product.value = "70";
            product.dispatchEvent(changeEvent);

            waitForElement("td.uni_reas_obj_prob_class", () => {
                waitForElement(".uni_reas_step", (element) => {
                    element.value = "-1";
                    element.dispatchEvent(changeEvent);

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
                    });
                }, true);
            });
        } else {
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
            });
        }
    }

    function handleClosed_Disconnections() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "70") {
            product.value = "70";
            product.dispatchEvent(changeEvent);

            waitForElement("td.uni_reas_obj_prob_class", () => {
                waitForElement(".uni_reas_step", (element) => {
                    element.value = "-1";
                    element.dispatchEvent(changeEvent);

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
                    });
                }, true);
            });
        } else {
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
            });
        }
    }

    function handleClosed_NoTV() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "101") {
            product.value = "101";
            product.dispatchEvent(changeEvent);

            waitForElement("td.uni_reas_obj_prob_class", () => {
                waitForElement(".uni_reas_step", (element) => {
                    element.value = "-1";
                    element.dispatchEvent(changeEvent);

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
                }, true);
            });
        } else {
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
            });
        }
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

    function handleOpen_Youtube() {
        const product = document.querySelector(".uni_reas_prod");

        if (product.value !== "70") {
            product.value = "70";
            product.dispatchEvent(changeEvent);

            waitForElement("td.uni_reas_obj_prob_class", () => {
                waitForElement(".uni_reas_step", (element) => {
                    element.value = "2296";
                    element.dispatchEvent(changeEvent);

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
                    });

                    waitForElement(".comment_text", (substep) => {
                        substep.value = "Сложность с доступностью YouTube. Клиент проинформирован по ограничениям";
                    });
                }, true);
            });
        } else {
            const step = document.querySelector(".uni_reas_step");
            step.value = "2296";
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
            });

            waitForElement(".comment_text", (substep) => {
                substep.value = "Сложность с доступностью YouTube. Клиент проинформирован по ограничениям";
            });
        }
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

    function handleClosed_ServiceEng() {
        const step = document.querySelector(".uni_reas_step");
        step.value = "-1";
        step.dispatchEvent(changeEvent);

        waitForElement(".uni_load_obj_reason", (substep) => {
            substep.value = "1435";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement(".uni_load_main_reason", (substep) => {
            substep.value = "22233";
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
            substep.value = "22219";
            substep.dispatchEvent(changeEvent);
        });
    }

    function fastChat_NoDiagnostic() {
        const product = document.querySelector(".uni_reas_prod");
        if (product.value !== "70") {
            product.value = "70";
            product.dispatchEvent(changeEvent);

            waitForElement("td.uni_reas_obj_prob_class", () => {
                waitForElement(".uni_reas_step", (element) => {
                    element.value = "-1";
                    element.dispatchEvent(changeEvent);

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
                }, true);
            });
        } else {
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

/**
 *  Left frame fast service requests
 */
async function leftFrame_fastSR() {
    if (document.querySelector(".helper-sr-button") != null) {
        return;
    }

    const container = document.querySelector("#wizard-service-create");
    if (!container) return;

    const categories = {
        "Интернет": [], "Телевидение": [], "Домофония": [],
    };

    const settingsKeys = ["ARM_leftFrame_fastSR_internet_noLink", "ARM_leftFrame_fastSR_internet_uncatalogedBreaks", "ARM_leftFrame_fastSR_internet_lowSpeed", "ARM_leftFrame_fastSR_tv_noSignal"];

    // Getting user settings
    const settings = await Promise.all(settingsKeys.map((key) => browser.storage.sync.get(key)),);

    const buttons = [];

    if (settings[0][settingsKeys[0]]) {
        buttons.push({
            value: "Нет линка", class: "helper helper-sr-button", action: internet_noLink, category: "Интернет",
        });
    }

    if (settings[1][settingsKeys[1]]) {
        buttons.push({
            value: "Незалог разрывы",
            class: "helper helper-sr-button",
            action: internet_uncatalogedBreaks,
            category: "Интернет",
        });
    }

    if (settings[2][settingsKeys[2]]) {
        buttons.push({
            value: "Низкая скорость", class: "helper helper-sr-button", action: internet_lowSpeed, category: "Интернет",
        });
    }

    if (settings[3][settingsKeys[3]]) {
        buttons.push({
            value: "Нет вещания", class: "helper helper-sr-button", action: tv_noSignal, category: "Телевидение",
        });
    }

    buttons.forEach((button) => {
        if (categories[button.category]) {
            categories[button.category].push(button);
        }
    });

    const fragment = document.createDocumentFragment();
    const categoryButtonsDiv = document.createElement("div");
    categoryButtonsDiv.className = "category-sr-buttons";
    fragment.appendChild(categoryButtonsDiv);

    Object.entries(categories).forEach(([categoryName, categoryButtons]) => {
        if (categoryButtons.length > 0) {
            const categoryButton = document.createElement("button");
            categoryButton.textContent = categoryName;
            categoryButton.className = "category-sr-toggle";
            categoryButton.type = "button";
            categoryButtonsDiv.appendChild(categoryButton);

            const buttonContainer = document.createElement("div");
            buttonContainer.className = "button-sr-container";
            buttonContainer.style.display = "none";

            categoryButtons.forEach((button) => {
                const btnElement = document.createElement("input");
                btnElement.setAttribute("type", "button");
                btnElement.setAttribute("class", button.class);
                btnElement.setAttribute("value", button.value);
                btnElement.addEventListener("click", button.action);
                btnElement.style.backgroundColor = "#337ab7";
                btnElement.style.color = "white";
                btnElement.style.marginBottom = "3px";
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

    const changeEvent = new Event("change", {
        bubbles: true, cancelable: true,
    });

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutationsList, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });

        observer.observe(document, {childList: true, subtree: true});
    }

    async function internet_noLink() {
        const product = document.querySelector("#proc_id")
        product.value = "5";
        product.dispatchEvent(changeEvent);

        waitForElement("#service-appeal-class-1", (substep) => {
            substep.value = "1046";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#service-appeal-class-2", (substep) => {
            substep.value = "18378";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#problem_class_id\\$i", (substep) => {
            substep.value = "18383";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#req_step", (substep) => {
            substep.value = "1053";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#com_ser", (substep) => {
            substep.value = "Нет линка на устройстве клиента, кабель цел. Предупрежден о потенциально платных работах.";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function internet_uncatalogedBreaks() {
        const product = document.querySelector("#proc_id")
        product.value = "5";
        product.dispatchEvent(changeEvent);

        waitForElement("#service-appeal-class-1", (substep) => {
            substep.value = "1046";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#service-appeal-class-2", (substep) => {
            substep.value = "18405";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#problem_class_id\\$i", (substep) => {
            substep.value = "18407";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#req_step", (substep) => {
            substep.value = "1053";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#com_ser", (substep) => {
            substep.value = "Клиент жалуется на разрывы. Схема подключения проверена, повреждений в пределах помещения со слов клиента не имеется.\n" + "Перенастройка роутера не помогла.\n" + "Предупрежден о потенциально платных работах.";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function internet_lowSpeed() {
        const product = document.querySelector("#proc_id")
        product.value = "5";
        product.dispatchEvent(changeEvent);

        waitForElement("#service-appeal-class-1", (substep) => {
            substep.value = "1046";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#service-appeal-class-2", (substep) => {
            substep.value = "18360";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#req_step", (substep) => {
            substep.value = "1053";
            substep.dispatchEvent(changeEvent);
        });
    }

    async function tv_noSignal() {
        const product = document.querySelector("#proc_id");

        const option7Exists = Array.from(product.options).some(option => option.value === "7");

        const option40Exists = Array.from(product.options).some(option => option.value === "40");

        if (option7Exists) {
            product.value = "7";
            const changeEvent = new Event('change', {bubbles: true, cancelable: true});
            product.dispatchEvent(changeEvent);
        } else if (option40Exists) {
            product.value = "40";
            const changeEvent = new Event('change', {bubbles: true, cancelable: true});
            product.dispatchEvent(changeEvent);
        }

        waitForElement("#service-appeal-class-2", (substep) => {
            substep.value = "18369";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#problem_class_id\\$i", (substep) => {
            substep.value = "18372";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#req_step", (substep) => {
            substep.value = "327";
            substep.dispatchEvent(changeEvent);
        });

        waitForElement("#com_ser", (substep) => {
            substep.value = "Нет вещания на всех каналах. Схема подключения проверена, повреждений в пределах помещения со слов клиента не имеется. Предупрежден о потенциально платных работах.";
            substep.dispatchEvent(changeEvent);
        });
    }
}

/**
 * Service request edit buttons
 */
async function fastButtonsChangeRequest() {
    if (document.querySelector(".helper") != null) {
        return;
    }

    const changeEvent = new Event("change", {
        bubbles: true, cancelable: true,
    });

    const existingButton = document.getElementById("update_request_appl");

    const settingsKeys = ["ARM_changeRequestFBCR_Open_KCNCK1", "ARM_changeRequestFBCR_Open_KCNCK2", "ARM_changeRequestFBCR_Open_TS", "ARM_changeRequestFBCR_Open_NRD", "ARM_changeRequestFBCR_Open_NTPISH", "ARM_changeRequestFBCR_Open_ABONISH",];

    const settings = await Promise.all(settingsKeys.map((key) => browser.storage.sync.get(key)),);

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

    const spaces = Array(6)
        .fill()
        .map(() => document.createTextNode(" "));

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

        info(`[Хелпер] - [АРМ] - [Обращения] Обращение изменено на Онлайн вход - КС`,);

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

        info(`[Хелпер] - [АРМ] - [Обращения] Обращение изменено на ОЦТП Исход - КС`,);
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

        info(`[Хелпер] - [АРМ] - [Обращения] Обращение изменено на ТС/ААО`);
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
            $.notify("Смена классификатора на Передано Направление сохранения Клиентов - Исходящая связь недоступна",);
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

        info(`[Хелпер] - [АРМ] - [Обращения] Обращение изменено на НРД - Исход`,);
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

        info(`[Хелпер] - [АРМ] - [Обращения] Обращение изменено на НТП - Исход`,);
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

        info(`[Хелпер] - [АРМ] - [Обращения] Обращение изменено на Абон - Исход`,);
        $.notify("Обращение изменено на Абон - Исход", "success");
    }
}

/**
 * Fast SMS buttons
 * Allows choosing from predefined types of SMS
 */
async function smsButtons() {
    const changeEvent = new Event("change", {
        bubbles: true, cancelable: true,
    });

    const buttonContainer = $('<div class="button-container" style="display: flex; flex-wrap: wrap; margin-top: 6px; gap: 6px;"></div>',);

    const buttonData = [{value: "🔑 Static", smsValue: 27}, {value: "🔑 PPPoE", smsValue: 25}, {
        value: "🔐 ЛК", smsValue: 26
    }, {value: "💸 Оплата", smsValue: 24},];

    function createButton(buttonValue, smsValue) {
        const button = $(`<input type="button" value="${buttonValue}" class="btn btn-primary btn-sm helper"/>`,);
        button.on("click", function () {
            let smsSelector = $(".type_sms_a");
            smsSelector.val(smsValue);
            smsSelector[0].dispatchEvent(changeEvent);
        });
        return button;
    }

    buttonData.forEach((data) => {
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

/**
 * Button to quick choose last day to filter client sessions
 */
async function loadLastDayClientSessions() {
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
            document.querySelector(".js-active-from").value = currentDate.toLocaleDateString("ru-RU", options); // Устанавливаем значение в поле ввода

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
        loadDataButton.parentNode.insertBefore(button, loadDataButton.nextSibling);
    }
}

/**
 * Button to quick compensate for few days at once for agreement actions tab
 */
async function agrTransCompensationButton() {
    // Regex validation: DD.MM
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])$/;
    const currentYear = new Date().getFullYear();

    function getParametersFromUrl() {
        const url = new URL(window.location.href);
        return {
            sessionId: url.searchParams.get("session_id$c"),
            userId: url.searchParams.get("client$c"),
            agreementId: url.searchParams.get("agreement_id$i"),
        };
    }

    function getPageParameters() {
        // Getting count of products
        const productsCount = document.querySelector('input[name="products_cnt$i"]',)?.value;

        // Search string "Компенсация за аварию"
        const compensationRow = Array.from(document.querySelectorAll("th"))
            .find((th) => th.textContent.includes("Компенсация за аварию"))
            ?.closest("tr");

        const compensationLink = compensationRow?.querySelector("a.compensation");

        // Getting month_id, flag_id and flag_id_and_i from page
        const monthId = compensationLink?.getAttribute("month_id");
        const flagId = compensationLink?.getAttribute("flag_id");
        const flagIdAndIndex = compensationLink?.getAttribute("flag_id_and_i");

        return {
            productsCount, monthId, flagId, flagIdAndIndex,
        };
    }

    // Date validation
    function isValidDate(dateString) {
        if (!dateRegex.test(dateString)) return false;

        const [day, month] = dateString.split(".").map(Number);
        const date = new Date(currentYear, month - 1, day);

        return date.getDate() === day && date.getMonth() === month - 1;
    }

    // Format date with current year
    function formatDateWithYear(dateString) {
        return `${dateString}.${currentYear}`;
    }

    // Getting period between two dates
    function getDatesArray(startDate, endDate) {
        const dates = [];
        const currentDate = new Date(startDate.split(".").reverse().join("-"));
        const lastDate = new Date(endDate.split(".").reverse().join("-"));

        while (currentDate <= lastDate) {
            dates.push(currentDate.toLocaleDateString("ru-RU", {
                day: "2-digit", month: "2-digit", year: "numeric",
            }),);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    // Sending POST request to make compensation
    async function makeCompensationRequest(urlParameters, pageParameters, compensationDate,) {
        // Получаем текущий hostname для сохранения города
        const currentURL = window.location.href;
        const baseURL = currentURL.match(/(https:\/\/[^\/]+)/)[1];

        const fetchURL = `${baseURL}/cgi-bin/ppo/excells/adv_act_retention.add_flag`;

        const requestBody = new URLSearchParams({
            session_id$c: urlParameters.sessionId,
            client$c: urlParameters.userId,
            agreement_id$i: urlParameters.agreementId,
            products_cnt$i: pageParameters.productsCount,
            month_id$i: pageParameters.monthId,
            flag_id$i: pageParameters.flagId,
            flag_id_and_i$i: pageParameters.flagIdAndIndex,
            date_from$c: compensationDate,
        });

        const response = await fetch(fetchURL, {
            method: "POST", credentials: "include", headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded",
                "Sec-GPC": "1",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "iframe",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                Priority: "u=4",
                Pragma: "no-cache",
                "Cache-Control": "no-cache",
            }, body: requestBody.toString(),
        });

        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder("windows-1251");
        const responseText = decoder.decode(buffer);

        if (responseText.includes("УСПЕШНОЕ") || responseText.includes("Флаг успешно добавлен")) {
            $.notify(`${compensationDate} - Успешно компенсировано`, "success");
        } else if (responseText.includes("Данный признак уже есть на приложении")) {
            $.notify(`${compensationDate} - Компенсация уже есть`, "error");
        } else {
            $.notify(`${compensationDate} - АРМ не дает компенсировать. Попробуй вручную`, "error",);
        }

        if (!response.ok) {
            throw new Error(`Failed for date ${compensationDate}: HTTP ${response.status}`,);
        }

        return true;
    }

    // Find and process table cells
    const tableCells = document.querySelectorAll("th");
    tableCells.forEach((cell) => {
        if (cell.innerText === "Компенсация за аварию") {
            const lineBreak = document.createElement("br");
            const button = document.createElement("button");
            button.innerText = "Несколько дней";
            button.className = "button";

            button.onclick = async () => {
                // Get parameters from URL and page
                const urlParameters = getParametersFromUrl();
                const pageParameters = getPageParameters();

                // Validate we have all required parameters
                if (!urlParameters.sessionId || !urlParameters.userId || !urlParameters.agreementId) {
                    $.notify("Не удалось получить необходимые параметры из URL", "error");
                    return;
                }

                if (!pageParameters.productsCount || !pageParameters.monthId || !pageParameters.flagId || !pageParameters.flagIdAndIndex) {
                    $.notify("Не удалось получить необходимые параметры со страницы", "error",);
                    return;
                }

                // Get start date (now only requiring DD.MM)
                const currentDate = new Date();

                const day = String(currentDate.getDate()).padStart(2, "0");
                const month = String(currentDate.getMonth() + 1).padStart(2, "0");
                const currentDay = `${day}.${month}`;

                let startDate = prompt("Введите начальную дату (ДД.ММ)", currentDay);
                if (!startDate) return;
                if (!isValidDate(startDate)) {
                    $.notify("Неверный формат начальной даты. Используйте формат ДД.ММ", "error",);
                    return;
                }
                startDate = formatDateWithYear(startDate);

                // Get end date (now only requiring DD.MM)
                let endDate = prompt("Введите конечную дату (ДД.ММ)");
                if (!endDate) return;
                if (!isValidDate(endDate)) {
                    $.notify("Неверный формат конечной даты. Используйте формат ДД.ММ", "error",);
                    return;
                }
                endDate = formatDateWithYear(endDate);

                // Validate date range
                const startDateObject = new Date(startDate.split(".").reverse().join("-"),);
                const endDateObject = new Date(endDate.split(".").reverse().join("-"));
                if (startDateObject > endDateObject) {
                    $.notify("Начальная дата не может быть позже конечной даты", "error");
                    return;
                }

                try {
                    const dates = getDatesArray(startDate, endDate);
                    let successCount = 0;
                    let errorCount = 0;

                    // Process each date
                    for (const date of dates) {
                        try {
                            await makeCompensationRequest(urlParameters, pageParameters, date,);
                            successCount++;
                            // Add small delay between requests
                            await new Promise((resolve) => setTimeout(resolve, 100));
                        } catch (error) {
                            error("Error processing compensation:", error);
                            errorCount++;
                        }
                    }

                    // Show final results
                    if (successCount > 0) {
                        $.notify(`Успешно добавлено компенсаций: ${successCount}`, "success",);
                    }
                    if (errorCount > 0) {
                        $.notify(`Ошибок при добавлении: ${errorCount}`, "error");
                    }
                } catch (error) {
                    error("Failed to process compensations:", error);
                    $.notify("Произошла ошибка при обработке компенсаций", "error");
                }
            };
            cell.appendChild(lineBreak);
            cell.appendChild(button);
        }
    });
}

/**
 * Button to quickly compensate for few days at once for agreement anticipation
 */
async function infoCompensationButton() {
    // Exit early if buttons already exist
    if (document.querySelector(".helper-compensation")) return;

    const refreshBtn = document.querySelector(".refresh-frame");
    const top3Btn = document.querySelector(".top_3_butt");
    const container = document.getElementById("top-3-block");

    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])$/;
    const currentYear = new Date().getFullYear();

    if (!refreshBtn || !top3Btn || !container) return;

    const compensateBtn = document.createElement("button");
    compensateBtn.className = "btn btn-success helper-compensation float-right btn-xs";
    compensateBtn.type = "button";
    compensateBtn.textContent = "Компенсировать";
    compensateBtn.style.marginRight = "5px";

    container.insertBefore(compensateBtn, top3Btn);

    function isValidDate(dateString) {
        if (!dateRegex.test(dateString)) return false;

        const [day, month] = dateString.split(".").map(Number);
        const date = new Date(currentYear, month - 1, day);

        return date.getDate() === day && date.getMonth() === month - 1;
    }

    // Format using current year
    function formatDateWithYear(dateString) {
        return `${dateString}.${currentYear}`;
    }

    // Get period between two dates
    function getDatesArray(startDate, endDate) {
        const dates = [];
        const currentDate = new Date(startDate.split(".").reverse().join("-"));
        const lastDate = new Date(endDate.split(".").reverse().join("-"));

        while (currentDate <= lastDate) {
            dates.push(currentDate.toLocaleDateString("ru-RU", {
                day: "2-digit", month: "2-digit", year: "numeric",
            }),);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    compensateBtn.addEventListener("click", async () => {
        let ssn = document.querySelector('input[class="js-ssn-prn"]')?.value;
        let user_id = document.querySelector('input[class="js-user-id-prn"]',)?.value;
        let agr_id = document.querySelector('input[class="js-agr-id-prn"]')?.value;

        let is_one_day = confirm("Компенсация за один день - ОК\nКомпенсация за несколько дней - Отмена",);

        const currentDate = new Date();

        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const currentDay = `${day}.${month}`;

        if (is_one_day) {
            let compensDay = prompt("Введи дату (ДД.ММ)", currentDay);
            if (!compensDay) return;
            if (!isValidDate(compensDay)) {
                $.notify("Неверный формат начальной даты. Используйте формат ДД.ММ", "error",);
                return;
            }

            await compensate(formatDateWithYear(compensDay), ssn, user_id, agr_id);
        } else {
            // Asking first date
            let startDate = prompt("Введи начальную дату (ДД.ММ)", currentDay);
            if (!startDate) return;
            if (!isValidDate(startDate)) {
                $.notify("Неверный формат начальной даты. Используйте формат ДД.ММ", "error",);
                return;
            }
            startDate = formatDateWithYear(startDate);

            // Asking second date
            let endDate = prompt("Введи конечную дату (ДД.ММ)");
            if (!endDate) return;
            if (!isValidDate(endDate)) {
                $.notify("Неверный формат конечной даты. Используйте формат ДД.ММ", "error",);
                return;
            }
            endDate = formatDateWithYear(endDate);

            // Checking format of entered dates
            const startDateObject = new Date(startDate.split(".").reverse().join("-"),);
            const endDateObject = new Date(endDate.split(".").reverse().join("-"));
            if (startDateObject > endDateObject) {
                $.notify("Начальная дата не может быть позже конечной даты", "error");
                return;
            }

            try {
                const dates = getDatesArray(startDate, endDate);

                // Process each date
                for (const date of dates) {
                    await compensate(date, ssn, user_id, agr_id);

                    // Delay between requests
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            } catch (error) {
                $.notify("Произошла ошибка при обработке компенсаций", "error");
            }
        }
    });

    async function compensate(date, ssn, user_id, agr_id) {
        const currentURL = window.location.href;
        const baseURL = currentURL.match(/(https:\/\/[^\/]+)/)[1];

        const endpoint = "/cgi-bin/ppo/excells/adv_act_retention.add_compensate_from_antic";

        const formData = new URLSearchParams({
            ssn$c: ssn, user_id$c: user_id, agr_id$c: agr_id, compens_date$c: date,
        });

        try {
            let response = await fetch(`${baseURL}${endpoint}`, {
                method: "POST", credentials: "include", headers: {
                    Accept: "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-GPC": "1",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    Priority: "u=0",
                }, body: formData.toString(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder("windows-1251");
            const responseText = decoder.decode(buffer);

            if (responseText.includes("УСПЕШНОЕ") || responseText.includes("Флаг успешно добавлен")) {
                $.notify(`${date} - Успешно компенсировано`, "success");
            } else if (responseText.includes("Данный признак уже есть на приложении")) {
                $.notify(`${date} - Компенсация уже есть`, "error");
            } else {
                $.notify(`${date} - АРМ не дает компенсировать. Попробуй вручную`, "error",);
            }
        } catch (error) {
            error("Ошибка компенсации:", error);
            throw error;
        }
    }
}

/**
 * Add iframe appeal button
 */
function addAppealIframeButtons() {
    // Find all anchor elements with the specific pattern
    const appealLinks = document.querySelectorAll('a[onclick*="changeAppealInNewTab"]');

    appealLinks.forEach((link) => {
        // Skip if button already added
        if (link.parentElement.querySelector('.appeal-iframe-btn')) {
            return;
        }

        // Extract parameters from onclick attribute
        const onclickAttr = link.getAttribute('onclick');
        const match = onclickAttr.match(/changeAppealInNewTab\('([^']+)',\s*(\d+),\s*(\d+)\)/);

        if (!match) return;

        const params = { param1: match[1], param2: match[2], param3: match[3] };

        // Create new iframe button styled as a link
        const newButton = document.createElement('a');
        newButton.textContent = 'Изменить в окне';
        newButton.className = 'appeal-iframe-btn';
        newButton.href = '#';
        newButton.style.cssText = `
            display: block;
            cursor: pointer;
        `;

        // Add click handler
        newButton.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Check if iframe already exists for this button
            const existingIframe = document.querySelector('.appeal-iframe-container');
            if (existingIframe) {
                existingIframe.remove();
            }

            // Construct URL with correct path and parameter format
            let url = window.location.origin + '/cgi-bin/ppo/excells/wcc_request_appl_support.change_request_appl?'
                + 'ssn$c=' + params.param1
                + '&usr$i=' + params.param2
                + '&request_id$i=' + params.param3;

            // Add global parameters if they exist
            if (typeof globalParams !== 'undefined') {
                if (globalParams.rck) url += '&rck$c=' + globalParams.rck;
                if (globalParams.rcd) url += '&rcd$c=' + globalParams.rcd;
                if (globalParams.interaction_id) url += '&interaction_id$i=' + globalParams.interaction_id;
            }

            // Create iframe container with window functionality
            const iframeContainer = document.createElement('div');
            iframeContainer.className = 'appeal-iframe-container';
            iframeContainer.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 800px;
                height: 600px;
                min-width: 100px;
                min-height: 100px;
                background: white;
                border: 2px solid #ccc;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                resize: both;
                overflow: hidden;
            `;

            // Window state management
            let isMinimized = false;
            let isMaximized = false;
            let originalStyles = {};
            let isDragging = false;
            let dragOffset = { x: 0, y: 0 };

            // Create header with window controls
            const header = document.createElement('div');
            header.className = 'window-header';
            header.style.cssText = `
                padding: 8px 15px;
                background: linear-gradient(to bottom, #f8f8f8, #e8e8e8);
                border-bottom: 1px solid #ddd;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 6px 6px 0 0;
                cursor: move;
                user-select: none;
                height: 30px;
                box-sizing: border-box;
            `;

            const title = document.createElement('span');
            title.textContent = 'Изменить обращение';
            title.style.cssText = `
                font-weight: bold;
                font-size: 13px;
                color: #333;
                flex: 1;
            `;

            // Window control buttons container
            const controls = document.createElement('div');
            controls.style.cssText = `
                display: flex;
                gap: 2px;
            `;

            // Minimize button
            const minimizeButton = document.createElement('button');
            minimizeButton.innerHTML = '─';
            minimizeButton.title = 'Minimize';
            minimizeButton.style.cssText = `
                width: 20px;
                height: 20px;
                border: 1px solid #bbb;
                background: linear-gradient(to bottom, #fff, #e0e0e0);
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Maximize/Restore button
            const maximizeButton = document.createElement('button');
            maximizeButton.innerHTML = '□';
            maximizeButton.title = 'Maximize';
            maximizeButton.style.cssText = `
                width: 20px;
                height: 20px;
                border: 1px solid #bbb;
                background: linear-gradient(to bottom, #fff, #e0e0e0);
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '✕';
            closeButton.title = 'Close';
            closeButton.style.cssText = `
                width: 20px;
                height: 20px;
                border: 1px solid #bbb;
                background: linear-gradient(to bottom, #fff, #e0e0e0);
                cursor: pointer;
                font-size: 12px;
                line-height: 1;
                border-radius: 2px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666;
            `;

            // Button hover effects
            [minimizeButton, maximizeButton, closeButton].forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = 'linear-gradient(to bottom, #fff, #d0d0d0)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.background = 'linear-gradient(to bottom, #fff, #e0e0e0)';
                });
            });

            // Close button special hover
            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.background = 'linear-gradient(to bottom, #ff6b6b, #e63946)';
                closeButton.style.color = 'white';
            });
            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.background = 'linear-gradient(to bottom, #fff, #e0e0e0)';
                closeButton.style.color = '#666';
            });

            // Create minimized state container
            const minimizedContent = document.createElement('div');
            minimizedContent.style.cssText = `
                display: none;
                flex: 1;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #666;
                font-style: italic;
            `;
            minimizedContent.textContent = 'Обращение свернуто';

            // Window control functions
            minimizeButton.onclick = (e) => {
                e.stopPropagation();
                if (isMinimized) {
                    // Restore from minimize
                    iframeContainer.style.height = originalStyles.height || '600px';
                    iframeContainer.style.width = originalStyles.width || '800px';
                    contentArea.style.display = 'flex';
                    minimizedContent.style.display = 'none';
                    minimizeButton.innerHTML = '─';
                    minimizeButton.title = 'Minimize';
                    isMinimized = false;
                } else {
                    // Minimize
                    originalStyles.height = iframeContainer.style.height;
                    originalStyles.width = iframeContainer.style.width;
                    iframeContainer.style.height = '38px';
                    iframeContainer.style.width = '300px';
                    contentArea.style.display = 'none';
                    minimizedContent.style.display = 'flex';
                    minimizeButton.innerHTML = '□';
                    minimizeButton.title = 'Restore';
                    isMinimized = true;
                }
            };

            maximizeButton.onclick = (e) => {
                e.stopPropagation();
                if (isMaximized) {
                    // Restore from maximize
                    iframeContainer.style.top = originalStyles.top || '50%';
                    iframeContainer.style.left = originalStyles.left || '50%';
                    iframeContainer.style.width = originalStyles.width || '800px';
                    iframeContainer.style.height = originalStyles.height || '600px';
                    iframeContainer.style.transform = originalStyles.transform || 'translate(-50%, -50%)';
                    maximizeButton.innerHTML = '□';
                    maximizeButton.title = 'Maximize';
                    isMaximized = false;
                } else {
                    // Maximize
                    originalStyles = {
                        top: iframeContainer.style.top,
                        left: iframeContainer.style.left,
                        width: iframeContainer.style.width,
                        height: iframeContainer.style.height,
                        transform: iframeContainer.style.transform
                    };
                    iframeContainer.style.top = '0';
                    iframeContainer.style.left = '0';
                    iframeContainer.style.width = '100vw';
                    iframeContainer.style.height = '100vh';
                    iframeContainer.style.transform = 'none';
                    maximizeButton.innerHTML = '❐';
                    maximizeButton.title = 'Restore';
                    isMaximized = true;
                    isMinimized = false;
                }
            };

            closeButton.onclick = (e) => {
                e.stopPropagation();
                iframeContainer.remove();
            };

            // Dragging functionality
            header.addEventListener('mousedown', (e) => {
                if (e.target === minimizeButton || e.target === maximizeButton || e.target === closeButton) {
                    return;
                }
                if (isMaximized) return;

                isDragging = true;
                const rect = iframeContainer.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;

                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', stopDrag);
                e.preventDefault();
            });

            function handleDrag(e) {
                if (!isDragging || isMaximized) return;

                const newLeft = e.clientX - dragOffset.x;
                const newTop = e.clientY - dragOffset.y;

                iframeContainer.style.left = newLeft + 'px';
                iframeContainer.style.top = newTop + 'px';
                iframeContainer.style.transform = 'none';
            }

            function stopDrag() {
                isDragging = false;
                document.removeEventListener('mousemove', handleDrag);
                document.removeEventListener('mouseup', stopDrag);
            }

            // Double-click header to maximize/restore
            header.addEventListener('dblclick', (e) => {
                if (e.target === minimizeButton || e.target === maximizeButton || e.target === closeButton) {
                    return;
                }
                maximizeButton.click();
            });

            // Assemble controls
            controls.appendChild(minimizeButton);
            controls.appendChild(maximizeButton);
            controls.appendChild(closeButton);

            header.appendChild(title);
            header.appendChild(controls);

            // Create content area
            const contentArea = document.createElement('div');
            contentArea.style.cssText = `
                flex: 1;
                position: relative;
                overflow: hidden;
            `;

            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.style.cssText = `
                width: 100%;
                height: 100%;
                border: none;
            `;

            // Create loading indicator
            const loading = document.createElement('div');
            loading.textContent = 'Загрузка...';
            loading.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 16px;
                color: #666;
                z-index: 1;
            `;

            // Hide loading when iframe loads
            let isIframeLoaded = false;
            iframe.onload = () => {
                loading.style.display = 'none';
                isIframeLoaded = true;
            };

            // Assemble iframe container
            contentArea.appendChild(loading);
            contentArea.appendChild(iframe);
            iframeContainer.appendChild(header);
            iframeContainer.appendChild(contentArea);
            iframeContainer.appendChild(minimizedContent);

            // Add to page
            document.body.appendChild(iframeContainer);

            // Prevent default resize behavior conflicts
            iframeContainer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });
        };

        // Insert the new button after the original link (positioned under it)
        link.parentNode.insertBefore(newButton, link.nextSibling);
    });

    // Set up observer for dynamic content and tab loading
    if (!window.appealObserverAdded) {
        const observer = new MutationObserver((mutations) => {
            // Check for tab content loading (like lazy_content_2448)
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if it's a lazy content container that just loaded
                            if (node.id && node.id.startsWith('lazy_content_') && node.textContent) {
                                console.log(`Tab content loaded: ${node.id}`);
                                setTimeout(addAppealIframeButtons, 200);
                                return;
                            }

                            // Check for any lazy content containers that got populated
                            const lazyContainers = node.querySelectorAll ? node.querySelectorAll('[id^="lazy_content_"]') : [];
                            lazyContainers.forEach(container => {
                                if (container.textContent && !container.dataset.appealButtonsAdded) {
                                    console.log(`Tab content found: ${container.id}`);
                                    container.dataset.appealButtonsAdded = 'true';
                                    setTimeout(addAppealIframeButtons, 200);
                                }
                            });

                            // Check for new appeal links in any added content
                            if (node.querySelectorAll) {
                                const newAppealLinks = node.querySelectorAll('a[onclick*="changeAppealInNewTab"]');
                                if (newAppealLinks.length > 0) {
                                    console.log(`Found ${newAppealLinks.length} new appeal links`);
                                    setTimeout(addAppealIframeButtons, 100);
                                }
                            }
                        }
                    });
                }

                // Also check for attribute changes (like when content is dynamically loaded)
                if (mutation.type === 'attributes' && mutation.target.id && mutation.target.id.startsWith('lazy_content_')) {
                    if (mutation.target.textContent && !mutation.target.dataset.appealButtonsAdded) {
                        console.log(`Tab content attribute changed: ${mutation.target.id}`);
                        mutation.target.dataset.appealButtonsAdded = 'true';
                        setTimeout(addAppealIframeButtons, 200);
                    }
                }
            });

            // Additional check for specific lazy content containers
            const lazyContainers = document.querySelectorAll('[id^="lazy_content_"]');
            lazyContainers.forEach(container => {
                if (container.textContent && !container.dataset.appealButtonsAdded) {
                    console.log(`Processing existing lazy content: ${container.id}`);
                    container.dataset.appealButtonsAdded = 'true';
                    setTimeout(addAppealIframeButtons, 100);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'data-loaded']
        });
        window.appealObserverAdded = true;
    }

    console.log(`Added iframe buttons to ${appealLinks.length} appeal links`);
}