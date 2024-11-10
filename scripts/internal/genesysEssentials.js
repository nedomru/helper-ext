if (document.URL.indexOf("genesys-app1") !== -1) {
    const GENESYS_config = {
        GENESYS_hideUselessButtons: hideUselessButtons,
        GENESYS_showFastButtons: genesysButtons,
        GENESYS_showOCTPLineStatus: otpcLineStatus,
        GENESYS_chatColors: setupGenesysChatColors,
        GENESYS_chatSound: setupGenesysChatSound,
        // GENESYS_hideChatHeader: hideHeader,
    };

    browser.storage.sync
        .get(Object.keys(GENESYS_config))
        .then((result) => {
            Object.keys(GENESYS_config).forEach((key) => {
                if (result[key]) {
                    GENESYS_config[key]();
                }
            });
        })
        .catch((error) => {
            console.error("Ошибка при получении настроек:", error);
        });
}

if (
    document.URL.indexOf(
        "http://genesys-app1.cc4.ertelecom.ru:82/ui/ad/v1/index"
    ) !== -1
) {
    browser.storage.sync.get(["phpSessionId"], function (result) {
        let phpSessionId = result.phpSessionId;
        if (!phpSessionId) {
            $.notify("Не установлен PHPSESSID. Авторизуйся на линии", "error")
        } else {
            browser.storage.sync.get(
                [
                    "GENESYS_showLineStatus_nck1",
                    "GENESYS_showLineStatus_nck2",
                ],
                function (result) {
                    const showLineStatusNck1 = result.GENESYS_showLineStatus_nck1;
                    const showLineStatusNck2 = result.GENESYS_showLineStatus_nck2;

                    if (showLineStatusNck1 || showLineStatusNck2) {
                        socketConnect(phpSessionId).then(() => console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Статус линии] - Активирован модуль статуса линии`));
                    }
                }
            );
        }
    })
}

let isActive = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const baseReconnectDelay = 1000; // 1 second
let socket;

async function socketConnect(sessionID) {
    if (isActive) {
        return;
    }

    isActive = true;

    const url =
        "wss://okc.ertelecom.ru/ts-line-genesys-okcdb-ws/?EIO=4&transport=websocket";
    const socket = new WebSocket(url);

    socket.onopen = function () {
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] Соединение установлено`
        );
        reconnectAttempts = 0;
        browser.storage.sync.get(
            ["GENESYS_showLineStatus_nck1", "GENESYS_showLineStatus_nck2"],
            function (result) {
                const showLineStatusNck1 = result.GENESYS_showLineStatus_nck1;
                const showLineStatusNck2 = result.GENESYS_showLineStatus_nck2;

                if (showLineStatusNck1) addMessageDiv("line-status-nck1");
                if (showLineStatusNck2) addMessageDiv("line-status-nck2");
            }
        );
    };

    socket.onmessage = function (event) {
        if (event.data === "2") {
            socket.send("3");
        } else if (event.data === '42/ts-line-genesys-okcdb-ws,["connected"]') {
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] Получен PHPSESSID: ${sessionID}`
            );
            $.notify("Установлено соединение с линией", "success");
            socket.send(`42/ts-line-genesys-okcdb-ws,["id","${sessionID}"]`);
        } else if (event.data.startsWith("0{")) {
            socket.send("40/ts-line-genesys-okcdb-ws,"); // Ответ на сообщение
        } else if (
            event.data.startsWith('42/ts-line-genesys-okcdb-ws,["notAuthorized"]')
        ) {
            socket.close();

            let lineStats
            lineStats = document.querySelector("#line-status-nck1");
            if (!lineStats) {
                lineStats = document.querySelector("#line-status-nck2");
            }
            if (lineStats) lineStats.innerText = "Нет авторизации";
            $.notify(
                "Статус линии не будет загружен. Авторизуйся на странице линии и обнови страницу Генезиса",
                "error"
            );
        } else {
            const parts = event.data.split(/,\s*(.+)/);
            const data = JSON.parse(parts[1])[1];
            const date = new Date();
            const offset = date.getTimezoneOffset() * 60 * 1000;
            const ekbTime = new Date(date.getTime() + offset + 5 * 60 * 60 * 1000);
            const timeString = ekbTime.toLocaleString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            handleSocketMessages(data, timeString);
        }
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] Соединение закрыто чисто, код: ${
                    event.code
                }, причина: ${event.reason}`
            );
        } else {
            console.error(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] Соединение прервано.`
            );
        }

        $.notify(
            "Соединение с линией разорвано",
            "error"
        );

        let lineStats;
        lineStats =
            document.querySelector("#line-status-nck1") ||
            document.querySelector("#line-status-nck2");
        if (lineStats) lineStats.innerText = "Закрыто";

        if (reconnectAttempts < maxReconnectAttempts) {
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
            $.notify(`Пытаемся переподключиться к линии... (Попытка ${reconnectAttempts + 1}/${maxReconnectAttempts})`, "warning");
            console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] Пробуем переподключиться через ${delay / 1000} секунд...`)

            setTimeout(() => {
                browser.storage.sync.get(["phpSessionId"], function (result) {
                    let phpSessionId = result.phpSessionId;
                    if (phpSessionId) {
                        reconnectAttempts = 0;
                        socketConnect(phpSessionId);
                    }
                })
            }, delay);
            reconnectAttempts++;
        } else {
            $.notify("Не удалось переподключиться, достигнут максимум попыток", "error");
            console.error(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] Достигнуто максимальное количество попыток подключения к сокету`)
        }
    };

    socket.onerror = function (error) {
        console.error(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] Ошибка WebSocket:`,
            error
        );
        $.notify("Ошибка WebSocket<br/>Причина: " + error, "error");
        socket.close();
    };
}

async function manualReconnect() {
    if (socket) {
        socket.close();
    }
    await browser.storage.sync.get(["phpSessionId"], async function (result) {
        let phpSessionId = result.phpSessionId;
        if (phpSessionId) {
            reconnectAttempts = 0;
            isActive = false
            $.notify("Переподключаемся к линии", "info")
            await socketConnect(phpSessionId);
        }
    })
}

async function addMessageDiv(id) {
    if (document.querySelector(`#${id}`)) return;
    const observer = new MutationObserver(() => {
        const title = document.querySelector(".title");

        if (title) {
            const containerDiv = document.createElement("div");
            containerDiv.style.alignItems = "center";
            containerDiv.style.justifyContent = "space-between";
            containerDiv.style.padding = "10px";
            containerDiv.style.marginLeft = "10px";
            containerDiv.style.fontSize = "15px";
            containerDiv.style.border = "1px solid #949494";
            containerDiv.style.backgroundColor = "#4c5961";
            containerDiv.style.color = "white";

            const newDiv = document.createElement("div");
            newDiv.id = id;
            newDiv.style.display = "flex";
            newDiv.style.alignItems = "center";

            const refreshIcon = document.createElement("span");
            refreshIcon.innerHTML = "&#x21BB;"; // Unicode for a circular arrow
            refreshIcon.style.cursor = "pointer";
            refreshIcon.style.marginLeft = "5px"
            refreshIcon.style.fontSize = "20px";
            refreshIcon.style.marginLeft = "10px";
            refreshIcon.setAttribute("title", "Переподключиться к линии");
            refreshIcon.addEventListener('click', manualReconnect);

            containerDiv.appendChild(newDiv);
            containerDiv.appendChild(refreshIcon);

            title.parentNode.insertBefore(containerDiv, title.nextSibling);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

async function handleSocketMessages(data, time) {
    if (!data || !data.availQueues) return;
    let settings = {
        showLineNCK1: (
            await browser.storage.sync.get("GENESYS_showLineStatus_nck1")
        ).GENESYS_showLineStatus_nck1,
        showLineNCK2: (
            await browser.storage.sync.get("GENESYS_showLineStatus_nck2")
        ).GENESYS_showLineStatus_nck2,
        showLineMessages: (
            await browser.storage.sync.get("GENESYS_showLineMessages")
        ).GENESYS_showLineMessages,
    };

    let lineStats;
    let contentToShow;
    let tooltipMessage;
    if (settings.showLineNCK1) {
        lineStats = document.querySelector("#line-status-nck1");
        if (lineStats == null) return;
        data.waitingChats.nck1 > 0
            ? (lineStats.style.color = "red")
            : (lineStats.style.color = "white");
        contentToShow = `Слоты: ${data.chatCapacity.nck1.available}/${data.chatCapacity.nck1.max} | SL: ${data.daySl.nck1}`;
        data.waitingChats.nck1 > 0
            ? (contentToShow += ` | ОЧЕРЕДЬ: ${data.waitingChats.nck1}`)
            : "";

        if (lineStats.innerHTML !== `<p>${contentToShow}</p>`) {
            lineStats.innerHTML = `<p>${contentToShow}</p>`;

            lineStats.style.transition = "background-color 0.3s";
            lineStats.style.backgroundColor = "#909ea6";

            setTimeout(() => {
                lineStats.style.backgroundColor = "#4c5961";
            }, 300);
        }

        tooltipMessage = `Статистика НЦК1 за день

Чаты:
Mobile: ${data.availQueues[0][0].currentWaitingCalls} / ${data.availQueues[0][0].totalEnteredCalls}
Web: ${data.availQueues[0][1].currentWaitingCalls} / ${data.availQueues[0][1].totalEnteredCalls}
SmartDom: ${data.availQueues[0][2].currentWaitingCalls} / ${data.availQueues[0][2].totalEnteredCalls}
DHCP: ${data.availQueues[0][3].currentWaitingCalls} / ${data.availQueues[0][3].totalEnteredCalls}
---
Тикеты:
Email: ${data.availQueues[0][6].currentWaitingCalls} / ${data.availQueues[0][6].totalEnteredCalls}
LK: ${data.availQueues[0][7].currentWaitingCalls} / ${data.availQueues[0][7].totalEnteredCalls}
---
Переливы:
Mobile: ${data.availQueues[1][0].currentWaitingCalls} / ${data.availQueues[1][0].totalEnteredCalls}
Web: ${data.availQueues[1][1].currentWaitingCalls} / ${data.availQueues[1][1].totalEnteredCalls}

Состояние на ${time}`;
        lineStats.setAttribute("title", tooltipMessage);
    }

    if (settings.showLineNCK2) {
        lineStats = document.querySelector("#line-status-nck2");

        if (lineStats == null) return;

        data.waitingChats.nck2 > 0
            ? (lineStats.style.color = "red")
            : (lineStats.style.color = "white");
        contentToShow = `Слоты: ${data.chatCapacity.nck2.available}/${data.chatCapacity.nck2.max} | SL: ${data.daySl.nck2}`;
        data.waitingChats.nck2 > 0
            ? (contentToShow += ` | ОЧЕРЕДЬ: ${data.waitingChats.nck2}`)
            : "";
        if (lineStats.innerHTML !== `<p>${contentToShow}</p>`) {
            lineStats.innerHTML = `<p>${contentToShow}</p>`;

            lineStats.style.transition = "background-color 0.3s";
            lineStats.style.backgroundColor = "#909ea6";

            setTimeout(() => {
                lineStats.style.backgroundColor = "#4c5961";
            }, 300);
        }

        tooltipMessage = `Статистика НЦК2 за день

Чаты:
Mobile: ${data.availQueues[2][0].currentWaitingCalls} / ${data.availQueues[2][0].totalEnteredCalls}
Web: ${data.availQueues[2][1].currentWaitingCalls} / ${data.availQueues[2][1].totalEnteredCalls}
SmartDom: ${data.availQueues[2][2].currentWaitingCalls} / ${data.availQueues[2][2].totalEnteredCalls}
---
Тикеты:
Email: ${data.availQueues[2][6].currentWaitingCalls} / ${data.availQueues[2][6].totalEnteredCalls}
LK: ${data.availQueues[2][7].currentWaitingCalls} / ${data.availQueues[2][7].totalEnteredCalls}
---
Переливы:
Mobile: ${data.availQueues[3][0].currentWaitingCalls} / ${data.availQueues[3][0].totalEnteredCalls}
Web: ${data.availQueues[3][1].currentWaitingCalls} / ${data.availQueues[3][1].totalEnteredCalls}

Состояние на ${time}ПРМ`;
        lineStats.setAttribute("title", tooltipMessage);
    }

// if (settings.showLineMessages) {
//   console.log(
//     `Сохраненное сообщение: ${await stripHtml(
//       lastDutyMessage
//     )}. Сообщение от сокета: ${await stripHtml(data.lastMessage.message)}`
//   );
//   if (lastDutyMessage == data.lastMessage.message) return;
//   lastDutyMessage = data.lastMessage.message;
//   lastDutyAuthor = data.lastMessage.author;
//   $(".container-fluid").notify(
//     `${lastDutyAuthor}: ${stripHtml(lastDutyMessage)}`,
//     "info",
//     {
//       position: "bottom center",
//     }
//   );
// }
}

function hideUselessButtons() {
    const buttonsToRemove = [
        "Facebook In Progress",
        "Facebook Draft",
        "Twitter In Progress",
        "Twitter Draft",
    ];

    const observerOther = new MutationObserver(() => {
        const facebookButton = document.querySelector(
            `a[aria-label="Facebook In Progress"]`
        );

        if (facebookButton) {
            buttonsToRemove.forEach((button) => {
                const btn = document.querySelector(`a[aria-label="${button}"]`);
                if (btn) {
                    btn.remove();
                }
            });
            document.querySelector(".dropdown.account-help").remove();
            document.querySelector(".genesys-logo").remove();

            observerOther.disconnect();
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Бесполезные кнопки] Все бесполезные кнопки удалены`
            );
        }
    });

    observerOther.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

async function genesysButtons() {
    if (document.querySelector(".helper")) return;

    // Удаляем !important у border-radius для кнопок
    Array.from(document.styleSheets).forEach((styleSheet) => {
        const rules = styleSheet.cssRules || styleSheet.cssRules;
        if (!rules) return;

        Array.from(rules).forEach((rule) => {
            if (
                rule.selectorText ===
                ".wwe input, .wwe select, .wwe button, .wwe textarea"
            ) {
                rule.style.setProperty("border-radius", "0px", "");
            }
        });
    });

    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("helper-buttons");
    buttonsDiv.style.cssText =
        "display: flex; justify-content: center; align-items: center; height: 100%; margin-left: 15px;";

    const linksData = [
        {
            url: "https://flomaster.chrsnv.ru",
            text: "Фломастер",
            key: "GENESYS_showFB_flomaster",
        },
        {
            url: "http://cm.roool.ru",
            text: "ЧМ",
            key: "GENESYS_showFB_chatMaster",
        },
        {
            url: "https://dom.ru/service/knowledgebase/internet/kak-nastroit-router",
            text: "Роутеры",
            key: "GENESYS_showFB_setupRouter",
        },
        {
            url: "https://dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore",
            text: "ТВ",
            key: "GENESYS_showFB_setupTV",
        },
        {
            url: "https://clever.ertelecom.ru/content/space/4/article/12409",
            text: "ЧТП КТВ",
            key: "GENESYS_showFB_channelsktv",
        },
        {
            url: "https://clever.ertelecom.ru/content/space/4/article/8887",
            text: "ЧТП ЦКТВ",
            key: "GENESYS_showFB_channelscktv",
        },
        {
            url: "https://dom.ru/service/knowledgebase/domru-tv/nastrojka-tv-pristavok",
            text: "Декодеры",
            key: "GENESYS_showFB_setupDecoder",
        },
        {
            url: "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/?C=M;O=D",
            text: "FTP ПК",
            key: "GENESYS_showFB_ftpPC",
        },
        {
            url: "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/?C=M;O=D",
            text: "FTP Моб",
            key: "GENESYS_showFB_ftpAndroid",
        },
        {
            url: "https://mh-dashboard-erth.proptech.ru/web/",
            text: "Dashboard",
            key: "GENESYS_showFB_dashboard",
        },
        {
            url: "https://provisioning.ertelecom.ru/devices",
            text: "Провиж",
            key: "GENESYS_showFB_provisioning",
        },
    ];

    // Получение значений всех настроек
    const settingsKeys = linksData.map((link) => link.key);
    const settings = await Promise.all(
        settingsKeys.map((key) => browser.storage.sync.get(key))
    );

    linksData.forEach((linkData, index) => {
        if (settings[index][linkData.key]) {
            buttonsDiv.appendChild(createGenesysLink(linkData.url, linkData.text));
        }
    });

    const observer = new MutationObserver(() => {
        const lineHeader = document.getElementById("break_window");
        if (lineHeader) {
            lineHeader.parentNode.insertBefore(buttonsDiv, lineHeader.nextSibling);
            observer.disconnect(); // Отключаем наблюдателя после добавления кнопок

            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Быстрые кнопки] Добавлены быстрые кнопки`
            );
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
}

function createGenesysLink(href, textContent, additionalStyles = {}) {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.textContent = textContent;
    link.setAttribute("class", "helper");

    // Применение общих стилей
    Object.assign(link.style, {
        fontSize: "1rem",
        fontFamily: "Roboto, Tahoma, Verdana",
        textAlign: "center",
        color: "white",
        marginRight: "8px",
        cursor: "pointer",
        height: "28px",
        width: "100px",
        display: "flex", // Используем Flexbox для центрирования
        justifyContent: "center",
        alignItems: "center",
        lineHeight: "auto",
        backgroundColor: "#4c5961",
        border: "none", // Убираем границы, так как это ссылка
        borderRadius: "18px",
        textDecoration: "none", // Убираем подчеркивание
    });

    // Применение дополнительных стилей
    Object.assign(link.style, additionalStyles);

    link.addEventListener("mouseenter", () => {
        link.style.backgroundColor = "#63737d";
    });
    link.addEventListener("mouseleave", () => {
        link.style.backgroundColor = "#4c5961";
    });

    return link;
}

async function otpcLineStatus() {
    let lastStatus = '';  // Cache last status to prevent unnecessary DOM updates

    async function getLineUpdate() {
        const genesysTitle = document.querySelector(".title");
        if (!genesysTitle) return;

        try {
            const response = await fetch('https://helper.chrsnv.ru/api/octp.json');
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (!data.message) {
                if (lastStatus !== 'нет апдейтов') {
                    genesysTitle.textContent = "НЦК2: нет апдейтов";
                    lastStatus = 'нет апдейтов';
                    console.log(
                        `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Аварийность] Изменений аварийности не найдено`
                    );
                }
                return;
            }

            const currentStatus = data.message;

            // Always update tooltip time even if status hasn't changed
            const isActive = currentStatus.includes("вкл") || currentStatus.includes("он");
            const titleForStatus = `${isActive ? "2+2 / 3+1\n" : "4+6 / 5+5\n"}` +
                `Время изменения: ${data.messageTimestamp}\n` +
                `Время проверки: ${data.lastFetchTime}`;

            genesysTitle.setAttribute("title", titleForStatus);

            // Update other elements only if status changed
            if (currentStatus !== lastStatus) {
                lastStatus = currentStatus;

                genesysTitle.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
                genesysTitle.textContent = `НЦК2: ${currentStatus}`;
                genesysTitle.style.color = isActive ? "#FF0000" : "#00FF00";
            }
        } catch (error) {
            console.error(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Аварийность] Ошибка:`,
                error
            );
        }
    }

    // Initial setup
    const observer = new MutationObserver((mutations, obs) => {
        const genesysTitle = document.querySelector(".title");
        if (genesysTitle) {
            getLineUpdate();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});

    // Regular updates every second
    setInterval(getLineUpdate, 1000);

    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Аварийность] Загружена аварийность НЦК2`
    );
}

function setupGenesysChatColors() {
    function applyColors() {
        browser.storage.sync.get([
            "GENESYS_chatColors_agentPromptColor",
            "GENESYS_chatColors_agentTextColor",
            "GENESYS_chatColors_clientPromptColor",
            "GENESYS_chatColors_clientTextColor",
        ], function (result) {
            const agentNameColor = result.GENESYS_chatColors_agentPromptColor;
            const agentTextColor = result.GENESYS_chatColors_agentTextColor;
            const clientNameColor = result.GENESYS_chatColors_clientPromptColor;
            const clientTextColor = result.GENESYS_chatColors_clientTextColor;

            const colorScript = document.createElement('script');
            colorScript.type = 'text/javascript';
            let code = `
window.genesys.wwe.configuration.set("chat.agent.prompt-color", "${agentNameColor}");
window.genesys.wwe.configuration.set("chat.agent.text-color", "${agentTextColor}");
window.genesys.wwe.configuration.set("chat.client.prompt-color", "${clientNameColor}");
window.genesys.wwe.configuration.set("chat.client.text-color", "${clientTextColor}");
      `
            colorScript.appendChild(document.createTextNode(code));

            document.body.appendChild(colorScript)

            $.notify("Загружены кастомные цвета чата", "success")
            console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные цвета чата`)
        });
    }

    function checkForGenesys() {
        if (document.querySelector(".wwe-account-state")) {
            observer.disconnect();
            applyColors();
        }
    }

    const observer = new MutationObserver(() => {
        checkForGenesys();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    checkForGenesys();
}

function setupGenesysChatSound() {
    const baseURL = 'http://genesys-srv.cc3.ertelecom.ru/sounds/';
    function convertPath(path) {
        const fileName = path.split('/').pop(); // Получаем имя файла
        return `${baseURL}${fileName}|-1|0`; // Формируем новый URL с добавлением |-1|0
    }

    function applySound() {
        browser.storage.sync.get([
            "GENESYS_chatSound_newChatSound",
            "GENESYS_chatSound_newMessageSound",
        ], function (result) {
            const newChatSound = convertPath(result.GENESYS_chatSound_newChatSound);
            const newMessageSound = convertPath(result.GENESYS_chatSound_newMessageSound);

            const soundScript = document.createElement('script');
            soundScript.type = 'text/javascript';
            let code = `
window.genesys.wwe.configuration.set("chat.ringing-bell", "${newChatSound}")
window.genesys.wwe.configuration.set("chat.new-message-bell", "${newMessageSound}")
      `
            soundScript.appendChild(document.createTextNode(code));

            document.body.appendChild(soundScript)

            $.notify("Загружены кастомные звуки чата", "success")
            console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные звуки чата`)
        });
    }

    function checkForGenesys() {
        if (document.querySelector(".wwe-account-state")) {
            observer.disconnect();
            applySound();
        }
    }

    const observer = new MutationObserver(() => {
        checkForGenesys();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    checkForGenesys();
}