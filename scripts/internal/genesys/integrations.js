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
    userSettings = await getStorage(["GENESYS_showLineStatus_nck1", "GENESYS_showLineMessages"]);
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

        const settings = await getStorage(["GENESYS_showLineStatus_nck1"]);
        if (settings.GENESYS_showLineStatus_nck1) await addLineStatusDiv();

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

        [document.querySelector("#line-status-combined")].forEach(el => {
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
    const lineStats = document.querySelector("#line-status-combined");
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

async function addLineStatusDiv() {
    /**
     * Add single DIV to show combined line status for all levels
     */
    if (document.querySelector("#line-status-combined")) return;

    const observer = new MutationObserver(() => {
        const title = document.querySelector(".title");

        if (title) {
            const containerDiv = document.createElement("div");
            containerDiv.style.cssText = `
                padding: 3px;
                margin: 5px;
                font-size: 14px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                border: 2px solid #949494;
                border-radius: 8px;
                background: linear-gradient(135deg, #4c5961 0%, #3a4248 100%);
                color: white;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                position: relative;
                overflow: hidden;
            `;

            containerDiv.classList.add("helper-line-status");

            // Add subtle animated background effect
            containerDiv.style.setProperty('--shimmer', 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)');

            // Add hover effect
            containerDiv.addEventListener("mouseover", () => {
                containerDiv.style.transform = "translateY(-1px)";
                containerDiv.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.25)";
                containerDiv.style.borderColor = "#6c7b7f";
            });

            containerDiv.addEventListener("mouseout", () => {
                containerDiv.style.transform = "translateY(0)";
                containerDiv.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.15)";
                containerDiv.style.borderColor = "#949494";
            });

            const statusDiv = document.createElement("div");
            statusDiv.id = "line-status-combined";
            statusDiv.style.cssText = `
                pointer-events: none;
                line-height: 1.4;
            `;

            // Add click handler to reconnect
            containerDiv.addEventListener("click", async () => {
                containerDiv.style.opacity = "0.7";
                await manualReconnect();
                setTimeout(() => {
                    containerDiv.style.opacity = "1";
                }, 500);
            });

            // Add loading state initially
            statusDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #868e96;">🔄 Загрузка статуса...</span>
                </div>
            `;

            containerDiv.appendChild(statusDiv);
            title.parentNode.insertBefore(containerDiv, title.nextSibling);
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
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

let lastNotificationMessage = null;
let lastNotificationTime = 0;

async function handleSocketMessages(data) {
    /**
     * Handling socket messages using socket jsonified data
     * @param data jsonified socket message data
     */
    if (!data) return;

    const {GENESYS_showLineStatus_nck1, GENESYS_showLineMessages} = userSettings;

    // Update line status if enabled
    if (GENESYS_showLineStatus_nck1) {
        updateLineStatus(data);
    }

    // Handle line messages - prevent spam by checking if message changed
    if (GENESYS_showLineMessages && data.lastMessage && data.lastMessage.message) {
        const currentMessage = data.lastMessage.message;
        const currentTime = Date.now();

        // Only show notification if message is different or enough time has passed (30 seconds)
        if (currentMessage !== lastNotificationMessage || (currentTime - lastNotificationTime) > 30000) {
            $.notify({
                title: `<strong>👮‍♂️ ${data.lastMessage.author || 'Unknown'}</strong>`,
                message: stripHtml(currentMessage)
            }, {
                style: 'lineMessage',
                globalPosition: 'bottom right',
                autoHideDelay: 15000,
                showAnimation: 'fadeIn',
                hideAnimation: 'fadeOut',
                html: true
            });

            lastNotificationMessage = currentMessage;
            lastNotificationTime = currentTime;
        }
    }
}

function updateLineStatus(data) {
    /**
     * Update the single line status div with all level data
     * @param data socket data
     */
    const lineStatusDiv = document.querySelector("#line-status-combined");
    if (!lineStatusDiv || !data.waitingChats || !data.chatCapacity) return;

    console.debug(data);

    const levels = [1, 2, 3];
    let statusParts = [];
    let hasQueue = false;

    // Build status for each level
    levels.forEach(levelNumber => {
        const levelKey = `lvl${levelNumber}`;
        const waitingCount = data.waitingChats[levelKey] || 0;
        const levelCapacity = data.chatCapacity[levelKey];

        if (levelCapacity) {
            const availableSlots = levelCapacity.available || 0;
            const maxSlots = levelCapacity.max || 0;

            if (waitingCount > 0) {
                hasQueue = true;
            }

            statusParts.push({
                level: levelNumber,
                available: availableSlots,
                max: maxSlots,
                waiting: waitingCount
            });
        }
    });

    // Build the display content
    let contentParts = [];

    // Add level status
    statusParts.forEach(part => {
        const levelColor = part.waiting > 0 ? '#ff6b6b' : '#51cf66';
        const levelIcon = `<span style="display: inline-flex; justify-content: center; align-items: center; width: 22px; height: 22px; background: linear-gradient(135deg, ${levelColor}, ${levelColor}dd); border-radius: 50%; margin-right: 8px; font-size: 11px; font-weight: bold; color: white; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">${part.level}</span>`;
        const slotText = `${part.available}/${part.max}`;
        const queueText = part.waiting > 0 ? ` <span style="color: #ff6b6b; font-weight: bold;">💬 ${part.waiting}</span>` : '';

        contentParts.push(`${levelIcon}${slotText}${queueText}`);
    });

    // Add SL and service scheme
    const slValue = data.daySl || 'N/A';
    const slColor = slValue === 'N/A' ? '#868e96' : (parseFloat(slValue) >= 80 ? '#51cf66' : '#ff6b6b');
    const slText = `<span style="color: ${slColor}; font-weight: bold;">SL: ${slValue}%</span>`;

    const schemeEmoji = data.serviceScheme === 1 ? '⛱️' : '🔥';
    const schemeText = `<span style="font-size: 16px;">${schemeEmoji}</span>`;

    // Combine all parts
    const finalContent = `
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            ${contentParts.join('<span style="color: #868e96; margin: 0 5px;">|</span>')}
            <span style="color: #868e96; margin: 0 5px;">|</span>
            ${slText}
            ${schemeText}
        </div>
    `;

    // Set overall container color based on queue status
    lineStatusDiv.parentElement.style.backgroundColor = hasQueue ? '#6c2e2e' : '#4c5961';
    lineStatusDiv.parentElement.style.borderColor = hasQueue ? '#ff6b6b' : '#949494';

    if (lineStatusDiv.innerHTML !== finalContent) {
        lineStatusDiv.innerHTML = DOMPurify.sanitize(finalContent);
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
