let isActive = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const baseReconnectDelay = 1000; // 1 second
let successNotificationShown = false;
let reconnecting = false; // Prevent multiple reconnections at the same time
let socket;

function getStorage(keys) {
    return new Promise(resolve => browser.storage.sync.get(keys, resolve));
}

// Cache user settings at file scope
let userSettings = {};


async function initUserSettings() {
    /**
     * Initialize cached settings once
     */
    userSettings = await getStorage(["GENESYS_showLineStatus_nck1", "GENESYS_showLineStatus_nck2", "GENESYS_showLineMessages"]);
}

initUserSettings();


async function attemptReconnect() {
    if (reconnecting || reconnectAttempts >= maxReconnectAttempts) {
        return; // Prevent unnecessary attempts
    }

    reconnecting = true;
    reconnectAttempts++;

    const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
    warn(`[Генезис] Переподключение через ${delay / 1000} сек...`);

    await new Promise(r => setTimeout(r, delay));

    const {phpSessionId} = await getStorage(["phpSessionId"]);
    if (phpSessionId) {
        reconnectAttempts = 0;
        await socketConnect(phpSessionId);
    }

    reconnecting = false;
}

async function socketConnect(sessionID) {
    if (isActive) return;
    isActive = true;
    reconnecting = false;

    await getOKCSessionId();

    const url = "wss://okc2.ertelecom.ru/ts-line-genesys-okcdb-ws/?EIO=4&transport=websocket";
    socket = new WebSocket(url);

    socket.onopen = async () => {
        info("[Генезис] WebSocket открыт.");
        reconnectAttempts = 0;

        const settings = await getStorage(["GENESYS_showLineStatus_nck1", "GENESYS_showLineStatus_nck2"]);
        if (settings.GENESYS_showLineStatus_nck1) addLineStatusDiv("line-status-nck1");
        if (settings.GENESYS_showLineStatus_nck2) addLineStatusDiv("line-status-nck2");

        socket.send(`42/ts-line-genesys-okcdb-ws,["id","${sessionID}"]`);
    };

    socket.onmessage = event => {
        const data = event.data;

        if (data === "2") {
            socket.send("3"); // Respond to keep-alive ping
            return;
        }

        if (data.startsWith('42/ts-line-genesys-okcdb-ws,["notAuthorized"]')) {
            handleAuthorizationFailure();
            return;
        }

        if (data.startsWith('42/ts-line-genesys-okcdb-ws,["connected"]')) {
            info(`[Генезис] Подключено к WebSocket.`);
            return;
        }

        if (!successNotificationShown && data.startsWith('42/ts-line-genesys-okcdb-ws,')) {
            successNotificationShown = true;
            showNotification("🚀 Успешное подключение", "Соединение с линией установлено");
        }

        if (data.startsWith("0{")) {
            socket.send("40/ts-line-genesys-okcdb-ws,");
            return;
        }

        try {
            const jsonData = JSON.parse(data.split(/,\s*(.+)/)[1]);
            handleSocketMessages(jsonData[1]);
        } catch (err) {
            error(`[Генезис] Ошибка обработки сообщения:`, err);
        }
    };

    socket.onclose = event => {
        isActive = false;
        warn(`[Генезис] WebSocket закрыт. Код: ${event.code}`);

        [document.querySelector("#line-status-nck1"), document.querySelector("#line-status-nck2")].forEach(el => {
            if (el) {
                el.innerText = "Починить";
            }
        });

        if (!event.wasClean) {
            showNotification("⏳ Переподключение", "Соединение потеряно, пытаемся восстановить...");
            attemptReconnect();
        }
    };

    socket.onerror = error => {
        error(`[Генезис] WebSocket ошибка:`, error.message);
        showNotification("⚠️ Ошибка линии", `Соединение потеряно: ${error.message || "Неизвестная ошибка"}`);
        socket.close();
        isActive = false;
    };
}

async function manualReconnect() {
    if (socket) socket.close();
    const {okc_phpSessionId} = await getStorage(["okc_phpSessionId"]);
    if (okc_phpSessionId) {
        reconnectAttempts = 0;
        isActive = false;
        await socketConnect(okc_phpSessionId);
    }
}

function handleAuthorizationFailure() {
    const lineStats = document.querySelector("#line-status-nck1") || document.querySelector("#line-status-nck2");
    if (lineStats) lineStats.innerText = "Нет авторизации";

    showNotification("⚠️ Ошибка", "Требуется авторизация. Обнови страницу");

    socket.close();
    isActive = false;
}

function showNotification(title, message) {
    $.notify({title: `<strong>${title}</strong>`, message}, {
        style: 'lineMessage',
        globalPosition: 'bottom right',
        autoHideDelay: 3000,
        showAnimation: 'fadeIn',
        hideAnimation: 'fadeOut',
        html: true
    });
}

async function addLineStatusDiv(id) {
    /**
     * Add DIV to show line status
     * @param {int} id - Line number of showing status.
     */
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
            containerDiv.addEventListener("mouseover", () => {
                containerDiv.style.backgroundColor = "#5a6971";
            });

            containerDiv.addEventListener("mouseout", () => {
                containerDiv.style.backgroundColor = "#4c5961";
            });

            const newDiv = document.createElement("div");
            newDiv.id = id;
            newDiv.style.display = "flex";
            newDiv.style.alignItems = "center";
            newDiv.style.pointerEvents = "none"; // Ensures clicks pass through to container

            // Add click handler to the entire container
            containerDiv.addEventListener("click", async () => {
                await manualReconnect();
            });

            containerDiv.appendChild(newDiv);

            title.parentNode.insertBefore(containerDiv, title.nextSibling);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true, subtree: true,
    });
}


function stripHtml(html) {
    /**
     * Convert HTML to formatted text while preserving basic formatting
     */
        // Convert <br> and <p> to newlines
    let formattedHtml = html
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n')
            .replace(/<p>/gi, '');

    // Remove extra whitespace and &nbsp;
    formattedHtml = formattedHtml
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return formattedHtml;
}


async function handleSocketMessages(data) {
    /**
     * Handling socket messages using socket jsonified data
     * @param data jsonified socket message data
     */
    if (!data) return;
    const lineStatsNCK1 = document.querySelector("#line-status-nck1");
    const lineStatsNCK2 = document.querySelector("#line-status-nck2");

    const {GENESYS_showLineStatus_nck1, GENESYS_showLineStatus_nck2, GENESYS_showLineMessages} = userSettings;

    const updateLineStats = (el, lineNumber, addEmoji = false) => {
        if (!el || !data.waitingChats) return;
        el.style.color = data.waitingChats[`nck${lineNumber}`] > 0 ? "red" : "white";

        let contentToShow = `<span style="display: inline-flex; justify-content: center; width: 20px; height: 20px; background-color: #666666; border-radius: 50%; margin-right: 5px; font-size: 12px;">${lineNumber}</span>Слоты: ${data.chatCapacity[`nck${lineNumber}`].available}/${data.chatCapacity[`nck${lineNumber}`].max} | SL: ${data.daySl[`nck${lineNumber}`]}`;
        if (data.waitingChats[`nck${lineNumber}`] > 0) {
            contentToShow += ` | ОЧЕРЕДЬ: ${data.waitingChats[`nck${lineNumber}`]}`;
        }
        if (addEmoji) {
            contentToShow += data.serviceScheme === 1 ? ' ⛱️' : ' 🔥';
        }
        const newContent = `<p>${contentToShow}</p>`;
        if (el.innerHTML !== newContent) {
            el.innerHTML = DOMPurify.sanitize(newContent);
        }
    };

    GENESYS_showLineStatus_nck1 && updateLineStats(lineStatsNCK1, 1, true); // Emojis for NCK1 only
    GENESYS_showLineStatus_nck2 && updateLineStats(lineStatsNCK2, 2, false); // No emojis for NCK2

    if (GENESYS_showLineMessages && data.messageText) {
        $.notify({
            title: `<strong>👮‍♂️ ${data.authorName}</strong>`, message: stripHtml(data.messageText)
        }, {
            style: 'lineMessage',
            globalPosition: 'bottom right',
            autoHideDelay: 15000,
            showAnimation: 'fadeIn',
            hideAnimation: 'fadeOut',
            html: true
        });
    }
}


$.notify.addStyle('lineMessage', {
    html: "<div class='clearfix'>" + "<div class='notify-title' data-notify-html='title'></div>" + "<div class='notify-message' data-notify-html='message'></div>" + "</div>",
    classes: {
        base: {
            "font-weight": "normal",
            "font-size": "16px",
            "padding": "8px 8px 8px 8px",
            "text-shadow": "0 1px 0 rgba(255, 255, 255, 0.5)",
            "background-color": "#D9EDF7",
            "border": "1px solid #BCE8F1",
            "border-radius": "4px",
            "white-space": "pre-wrap",
            "padding-left": "25px",
            "background-repeat": "no-repeat",
            "color": "#3A87AD",
            "max-width": "400px",
            "& .notify-title": {
                "font-weight": "bold", "margin-bottom": "6px"
            },
            ".notify-message": {
                "font-weight": "bold", "margin-top": "6px"
            }
        }
    }
});


async function otpcLineStatus() {
    /**
     * Showing line status for OCTP
     */
    let lastStatus = ""; // Cache last status to prevent unnecessary DOM updates

    async function getLineUpdate() {
        const genesysTitle = document.querySelector(".title");
        if (!genesysTitle) return;

        try {
            const response = await fetch("https://helper.chrsnv.ru/api/octp.json");

            const data = await response.json();
            if (!data.message) {
                if (lastStatus !== "нет апдейтов") {
                    genesysTitle.textContent = "НЦК2: нет апдейтов";
                    lastStatus = "нет апдейтов";
                    warn(`[Хелпер] - [Генезис] - [Аварийность] Изменений аварийности не найдено`,);
                }
                return;
            }

            const currentStatus = data.message;

            // Always update tooltip time even if status hasn't changed
            const isActive = currentStatus.includes("вкл") || currentStatus.includes("он");
            const titleForStatus = `${isActive ? "2+2 / 3+1\n" : "4+6 / 5+5\n"}` + `Время изменения: ${data.messageTimestamp} ПРМ\n` + `Время проверки: ${data.lastFetchTime} ПРМ`;

            genesysTitle.setAttribute("title", titleForStatus);

            // Update other elements only if status changed
            if (currentStatus !== lastStatus) {
                lastStatus = currentStatus;

                genesysTitle.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
                genesysTitle.textContent = `НЦК2: ${currentStatus}`;
                genesysTitle.style.color = isActive ? "#FF0000" : "#00FF00";
            }
        } catch (error) {
            error(`[Хелпер] - [Генезис] - [Аварийность] Ошибка:`, error);
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

    info(`[Хелпер] - [Генезис] - [Аварийность] Загружена аварийность НЦК2`,);
}
