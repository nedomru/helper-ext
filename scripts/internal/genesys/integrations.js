let isActive = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const baseReconnectDelay = 1000; // 1 second
let socket;

// Подключение к сокету линии НЦК
async function socketConnect(sessionID) {
    if (isActive) {
        return;
    }

    isActive = true;
    await getOKCSessionId()

    const url =
        "wss://okc.ertelecom.ru/ts-line-genesys-okcdb-ws/?EIO=4&transport=websocket";
    const socket = new WebSocket(url);

    socket.onopen = function () {
        console.info(
            `[Хелпер] - [Генезис] - [Линия] Соединение установлено`
        );
        reconnectAttempts = 0;
        browser.storage.sync.get(
            ["GENESYS_showLineStatus_nck1", "GENESYS_showLineStatus_nck2"],
            function (result) {
                const showLineStatusNck1 = result.GENESYS_showLineStatus_nck1;
                const showLineStatusNck2 = result.GENESYS_showLineStatus_nck2;

                if (showLineStatusNck1) addLineStatusDiv("line-status-nck1");
                if (showLineStatusNck2) addLineStatusDiv("line-status-nck2");
            }
        );
    };

    socket.onmessage = function (event) {
        if (event.data === "2") {
            socket.send("3");
        } else if (event.data === '42/ts-line-genesys-okcdb-ws,["connected"]') {
            console.info(
                `[Хелпер] - [Генезис] - [Линия] Получен PHPSESSID: ${sessionID}`
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
            console.warn(
                `[Хелпер] - [Генезис] - [Линия] Соединение закрыто чисто, код: ${
                    event.code
                }, причина: ${event.reason}`
            );
        } else {
            console.error(
                `[Хелпер] - [Генезис] - [Линия] Соединение прервано.`
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
        if (lineStats) {
            lineStats.innerText = "Починить статус линии";
            lineStats.parentElement.style.backgroundColor = "#635252"; // Error state background
        }

        if (reconnectAttempts < maxReconnectAttempts) {
            const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
            $.notify(`Пытаемся переподключиться к линии... (Попытка ${reconnectAttempts + 1}/${maxReconnectAttempts})`, "warning");
            console.warn(`[Хелпер] - [Генезис] - [Линия] Пробуем переподключиться через ${delay / 1000} секунд...`)

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
            console.error(`[Хелпер] - [Генезис] - [Линия] Достигнуто максимальное количество попыток подключения к сокету`)
        }
    };

    socket.onerror = function (error) {
        console.error(
            `[Хелпер] - [Генезис] - [Линия] Ошибка WebSocket:`,
            error
        );
        $.notify("Ошибка WebSocket<br/>Причина: " + error, "error");
        socket.close();
    };
}

// Ручной реконнект к сокету линии НЦК
async function manualReconnect() {
    if (socket) {
        socket.close();
    }
    await browser.storage.sync.get(["okc_phpSessionId"], async function (result) {
        let phpSessionId = result.okc_phpSessionId;
        if (phpSessionId) {
            reconnectAttempts = 0;
            isActive = false
            $.notify("Переподключаемся к линии", "info")
            await socketConnect(phpSessionId);
        }
    })
}

// Добавление DIV для отображения статуса линий
async function addLineStatusDiv(id) {
    if (document.querySelector(`#${id}`)) return;

    const observer = new MutationObserver(() => {
        const title = document.querySelector(".title");

        if (title) {
            const containerDiv = document.createElement("div");
            containerDiv.style.padding = "10px";
            containerDiv.style.marginLeft = "10px";
            containerDiv.style.fontSize = "15px";
            containerDiv.style.border = "1px solid #949494";
            containerDiv.style.backgroundColor = "#4c5961";
            containerDiv.style.color = "white";
            containerDiv.classList.add("helper-line-status");
            containerDiv.style.cursor = "pointer";
            containerDiv.style.transition = "background-color 0.2s ease";

            // Add hover effect
            containerDiv.addEventListener('mouseover', () => {
                containerDiv.style.backgroundColor = "#5a6971";
            });

            containerDiv.addEventListener('mouseout', () => {
                containerDiv.style.backgroundColor = "#4c5961";
            });

            const newDiv = document.createElement("div");
            newDiv.id = id;
            newDiv.style.display = "flex";
            newDiv.style.alignItems = "center";
            newDiv.style.pointerEvents = "none"; // Ensures clicks pass through to container

            // Add click handler to the entire container
            containerDiv.addEventListener('click', async () => {
                await manualReconnect();
            });

            containerDiv.appendChild(newDiv);

            title.parentNode.insertBefore(containerDiv, title.nextSibling);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Обработка сообщений сокета линии НЦК
async function handleSocketMessages(data, time) {
    if (!data?.availQueues) return;

    // Get all settings in parallel
    const [nck1Setting, nck2Setting, messagesSetting] = await Promise.all([
        browser.storage.sync.get("GENESYS_showLineStatus_nck1"),
        browser.storage.sync.get("GENESYS_showLineStatus_nck2"),
        browser.storage.sync.get("GENESYS_showLineMessages")
    ]);

    const settings = {
        showLineNCK1: nck1Setting.GENESYS_showLineStatus_nck1,
        showLineNCK2: nck2Setting.GENESYS_showLineStatus_nck2,
        showLineMessages: messagesSetting.GENESYS_showLineMessages
    };

    if (settings.showLineNCK1) {
        const lineStats = document.querySelector("#line-status-nck1");
        const lineStatsDiv = document.querySelector(".helper-line-status")
        if (!lineStats) return;

        lineStats.style.color = data.waitingChats.nck1 > 0 ? "red" : "white";

        let contentToShow = `<span style="display: inline-flex; justify-content: center; width: 20px; height: 20px; background-color: #666666; border-radius: 50%; margin-right: 5px; font-size: 12px;">1</span>Слоты: ${data.chatCapacity.nck1.available}/${data.chatCapacity.nck1.max} | SL: ${data.daySl.nck1}`;
        if (data.waitingChats.nck1 > 0) {
            contentToShow += ` | ОЧЕРЕДЬ: ${data.waitingChats.nck1}`;
        }

        const newContent = `<p>${contentToShow}</p>`;
        if (lineStats.innerHTML !== newContent) {
            lineStats.innerHTML = DOMPurify.sanitize(newContent);
            lineStatsDiv.style.transition = "background-color 0.3s";
            lineStatsDiv.style.backgroundColor = "#909ea6";
            setTimeout(() => lineStatsDiv.style.backgroundColor = "#4c5961", 300);
        }
        // Тултип со статус линии
//         const tooltipMessage = `Статистика НЦК1 за день
//
// Чаты:
// Mobile: ${data.availQueues[0][0].currentWaitingCalls} / ${data.availQueues[0][0].totalEnteredCalls}
// Web: ${data.availQueues[0][1].currentWaitingCalls} / ${data.availQueues[0][1].totalEnteredCalls}
// SmartDom: ${data.availQueues[0][2].currentWaitingCalls} / ${data.availQueues[0][2].totalEnteredCalls}
// DHCP: ${data.availQueues[0][3].currentWaitingCalls} / ${data.availQueues[0][3].totalEnteredCalls}
// ---
// Тикеты:
// Email: ${data.availQueues[0][6].currentWaitingCalls} / ${data.availQueues[0][6].totalEnteredCalls}
// ---
// Переливы:
// Mobile: ${data.availQueues[1][0].currentWaitingCalls} / ${data.availQueues[1][0].totalEnteredCalls}
// Web: ${data.availQueues[1][1].currentWaitingCalls} / ${data.availQueues[1][1].totalEnteredCalls}
//
// Состояние на ${time} ПРМ`;
//         lineStats.setAttribute("title", tooltipMessage);
    }

    if (settings.showLineNCK2) {
        const lineStats = document.querySelector("#line-status-nck2");
        const lineStatsDiv = document.querySelector(".helper-line-status")
        if (!lineStats) return;

        lineStats.style.color = data.waitingChats.nck2 > 0 ? "red" : "white";

        let contentToShow = `<span style="display: inline-flex; justify-content: center; width: 20px; height: 20px; background-color: #666666; border-radius: 50%; margin-right: 5px; font-size: 12px;">2</span>Слоты: ${data.chatCapacity.nck2.available}/${data.chatCapacity.nck2.max} | SL: ${data.daySl.nck2}`;
        if (data.waitingChats.nck2 > 0) {
            contentToShow += ` | ОЧЕРЕДЬ: ${data.waitingChats.nck2}`;
        }

        const newContent = `<p>${contentToShow}</p>`;
        if (lineStats.innerHTML !== newContent) {
            lineStats.innerHTML = DOMPurify.sanitize(newContent);
            lineStatsDiv.style.transition = "background-color 0.3s";
            lineStatsDiv.style.backgroundColor = "#909ea6";
            setTimeout(() => lineStatsDiv.style.backgroundColor = "#4c5961", 300);
        }
        // Тултип со статус линии
//         const tooltipMessage = `Статистика НЦК2 за день
//
// Чаты:
// Mobile: ${data.availQueues[2][0].currentWaitingCalls} / ${data.availQueues[2][0].totalEnteredCalls}
// Web: ${data.availQueues[2][1].currentWaitingCalls} / ${data.availQueues[2][1].totalEnteredCalls}
// SmartDom: ${data.availQueues[2][2].currentWaitingCalls} / ${data.availQueues[2][2].totalEnteredCalls}
// ---
// Тикеты:
// Email: ${data.availQueues[2][6].currentWaitingCalls} / ${data.availQueues[2][6].totalEnteredCalls}
// ---
// Переливы:
// Mobile: ${data.availQueues[3][0].currentWaitingCalls} / ${data.availQueues[3][0].totalEnteredCalls}
// Web: ${data.availQueues[3][1].currentWaitingCalls} / ${data.availQueues[3][1].totalEnteredCalls}
//
// Состояние на ${time} ПРМ`;
//         lineStats.setAttribute("title", tooltipMessage);
    }

    // if (settings.showLineMessages) {
//   console.info(
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

// Отображение статуса линии НЦК2
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
                    console.warn(
                        `[Хелпер] - [Генезис] - [Аварийность] Изменений аварийности не найдено`
                    );
                }
                return;
            }

            const currentStatus = data.message;

            // Always update tooltip time even if status hasn't changed
            const isActive = currentStatus.includes("вкл") || currentStatus.includes("он");
            const titleForStatus = `${isActive ? "2+2 / 3+1\n" : "4+6 / 5+5\n"}` +
                `Время изменения: ${data.messageTimestamp} ПРМ\n` +
                `Время проверки: ${data.lastFetchTime} ПРМ`;

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
                `[Хелпер] - [Генезис] - [Аварийность] Ошибка:`,
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

    console.info(
        `[Хелпер] - [Генезис] - [Аварийность] Загружена аварийность НЦК2`
    );
}

