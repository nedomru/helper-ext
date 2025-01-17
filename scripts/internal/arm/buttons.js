// Копирование MAC-адреса из сессии и сессий за период
async function copyMAC() {
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
        if (macAddressElement.nextElementSibling?.classList.contains('helper-button-group')) {
            return;
        }

        const macAddress = macAddressElement.innerText;

        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('helper-button-group');
        buttonGroup.style.position = 'relative';

        // Создание кнопки копирования
        const copyButton = document.createElement('button');
        copyButton.classList.add('helper-button', 'helper-button-left');
        copyButton.innerText = '📋';
        copyButton.title = 'Копировать MAC';
        copyButton.onclick = async (event) => {
            event.preventDefault();
            event.stopPropagation();
            try {
                await copyText(macAddress);
                console.info(`[Хелпер] - [Копирование] - MAC адрес успешно скопирован`);
                $.notify('MAC-адрес скопирован', 'success');
            } catch (error) {
                console.error('Copy error:', error);
                $.notify('Ошибка при копировании MAC-адреса', 'error');
            }
        };

        // Создание кнопки копирования
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

        buttonGroup.appendChild(copyButton);
        buttonGroup.appendChild(searchButton);

        macAddressElement.parentElement.appendChild(buttonGroup);
    };

    // Добавляем кнопку ко всем мак-адресам на странице
    const addCopyButtons = () => {
        const macAddressElements = document.querySelectorAll('.mac, .js-get-vendor-by-mac');
        macAddressElements.forEach(createMACButtons);
    };

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

        window._macObserver = observer;
    };

    if (window._macObserver) {
        window._macObserver.disconnect();
        window._macObserver = null;
    }

    // Проверка паттерна URL-адреса
    if (document.URL.includes('db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id')) {
        setupObserver();
    }

    addCopyButtons();
}

// Копирование IP-адреса из сессии
async function copyIP() {
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
            copyText(ip)
            $.notify('IP-адрес скопирован', 'success')
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

// Копирование слотов СЗ в изменении обращения
async function copyTimeSlots() {
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

// Копирование карточки клиента на вкладке Инфо
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
        console.warn(
            `[Хелпер] - [АРМ] - [Копирование карточки] Не найдена карточка клиента`,
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

    console.info(
        `[Хелпер] - [АРМ] - [Копирование] Добавлена кнопка копирования карточки`,
    );
}

// Отправка карточки клиента на вкладке Инфо как примера дежурному
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
        console.warn(
            `[Хелпер] - [АРМ] - [Отправка примеров] Не найдена карточка клиента`,
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

        try {
            const responseData = await response.json();

            if (responseData.success === true) {
                $.notify("Пример успешно отправлен", "success");
                console.info(`[Хелпер] - [Пример договора] Пример успешно отправлен`);
            } else {
                $.notify("Не удалось отправить пример");
                console.error(`[Хелпер] - [Пример договора] Ошибка отправки: ${JSON.stringify(responseData)}`);
            }
        } catch (error) {
            $.notify("Не удалось отправить пример");
            console.error(`[Хелпер] - [Пример договора] Произошла ошибка: ${error}`);
        }


    });
    clientCard.appendChild(lineBreak);
    clientCard.appendChild(sendExampleButton);

    console.info(
        `[Хелпер] - [АРМ] - [Пример договора] Добавлена кнопка отправки примера`,
    );
}

// Копирование договора клиента на вкладке Инфо
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

    console.info(
        `[Хелпер] - [АРМ] - [Копирование] Добавлена кнопка копирования договора`,
    );
}

// Копирование адреса клиента на вкладке Инфо
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
        console.warn(
            `[Хелпер] - [АРМ] - [Копирование адреса] Не найден адрес клиента`,
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

    console.info(
        `[Хелпер] - [АРМ] - [Копирование адреса] Добавлена кнопка копирования адреса`,
    );
}

// Побочная функция копирования текста
async function copyText(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
    } catch (err) {
        console.error("[Хелпер] - [Копирование текста] Не удалось скопировать текст, ошибка: ", err);
    }
    document.body.removeChild(textarea);
}

// Быстрые кнопки в левом фрейме
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
        "ARM_changeRequestFBLF_Self_recoverLK",
        "ARM_changeRequestFBLF_Self_Subscriptions",
        "ARM_changeRequestFBLF_Self_ChangeWiFi",
        "ARM_changeRequestFBLF_Open_Abon"
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

    if (settings[28][settingsKeys[28]]) {
        buttons.push({
            value: "Управление подпиской/пакетом",
            class: "helper helper-button",
            action: handleSS_Subscriptions,
            category: "Самообслуживание",
        });
    }

    if (settings[29][settingsKeys[29]]) {
        buttons.push({
            value: "Изменение Wi-Fi",
            class: "helper helper-button",
            action: handleSS_ChangeWiFi,
            category: "Самообслуживание",
        });
    }

    if (settings[30][settingsKeys[30]]) {
        buttons.push({
            value: "На Абон",
            class: "helper helper-button",
            action: handle_naAbon,
            category: "Открытое",
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

    function handleSS_Subscriptions() {
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
            substep.value = "БП Самообслуживание. Консультация по управлению подпиской/пакетом каналов";
            substep.dispatchEvent(changeEvent);
        });
    }

    function handleSS_ChangeWiFi() {
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
            substep.value = "БП Самообслуживание. Консультация по смене имени/ключа сети Wi-Fi";
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

// Быстрые кнопки в изменении обращения
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

        console.info(
            `[Хелпер] - [АРМ] - [Обращения] Обращение изменено на Онлайн вход - КС`,
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

        console.info(
            `[Хелпер] - [АРМ] - [Обращения] Обращение изменено на ОЦТП Исход - КС`,
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

        console.info(
            `[Хелпер] - [АРМ] - [Обращения] Обращение изменено на ТС/ААО`,
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

        console.info(
            `[Хелпер] - [АРМ] - [Обращения] Обращение изменено на НРД - Исход`,
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

        console.info(
            `[Хелпер] - [АРМ] - [Обращения] Обращение изменено на НТП - Исход`,
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

        console.info(
            `[Хелпер] - [АРМ] - [Обращения] Обращение изменено на Абон - Исход`,
        );
        $.notify("Обращение изменено на Абон - Исход", "success");
    }
}

// Быстрые СМС
async function smsButtons() {
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

// Загрузка сессий клиента за последний день
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
