let isActive = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const baseReconnectDelay = 1000; // 1 second
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
  userSettings = await getStorage([
    "GENESYS_showLineStatus_nck1",
    "GENESYS_showLineStatus_nck2",
    "GENESYS_showLineMessages"
  ]);
}
initUserSettings();


async function attemptReconnect() {
  /**
   * Automatic reconnection on connection drop
   */
  if (reconnectAttempts < maxReconnectAttempts) {
    const delay = baseReconnectDelay * Math.pow(2, reconnectAttempts);
    console.warn(`[Хелпер] - [Генезис] - [Линия] Пробуем переподключиться через ${delay / 1000} секунд...`);
    await new Promise(r => setTimeout(r, delay));
    const { phpSessionId } = await getStorage(["phpSessionId"]);
    if (phpSessionId) {
      reconnectAttempts = 0;
      socketConnect(phpSessionId);
    }
    reconnectAttempts++;
  } else {
    $.notify("Не удалось переподключиться, достигнут максимум попыток", "error");
    console.error(`[Хелпер] - [Генезис] - [Линия] Достигнуто максимальное количество попыток подключения к сокету`);
  }
}

async function socketConnect(sessionID) {
  /**
   * Connect to line socket
   * @param {string} sessionID - Users' session ID from okc
   */
  if (isActive) return;
  isActive = true;
  await getOKCSessionId();

  const url =
    "wss://okc2.ertelecom.ru/ts-line-genesys-okcdb-ws/?EIO=4&transport=websocket";
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.info(`[Хелпер] - [Генезис] - [Линия] Соединение установлено`);
    reconnectAttempts = 0;
    getStorage(["GENESYS_showLineStatus_nck1", "GENESYS_showLineStatus_nck2"])
      .then(result => {
        if (result.GENESYS_showLineStatus_nck1) addLineStatusDiv("line-status-nck1");
        if (result.GENESYS_showLineStatus_nck2) addLineStatusDiv("line-status-nck2");
      });
  };

  socket.onmessage = event => {
    const data = event.data;
    if (data === "2") {
      socket.send("3");
      return;
    }
    if (data === '42/ts-line-genesys-okcdb-ws,["connected"]') {
      console.info(`[Хелпер] - [Генезис] - [Линия] Получен PHPSESSID: ${sessionID}`);
      $.notify("Установлено соединение с линией", "success");
      socket.send(`42/ts-line-genesys-okcdb-ws,["id","${sessionID}"]`);
      return;
    }
    if (data.startsWith("0{")) {
      socket.send("40/ts-line-genesys-okcdb-ws,");
      return;
    }
    if (data.startsWith('42/ts-line-genesys-okcdb-ws,["notAuthorized"]')) {
      socket.close();
      const lineStats = document.querySelector("#line-status-nck1") || document.querySelector("#line-status-nck2");
      if (lineStats) lineStats.innerText = "Нет авторизации";
      $.notify("Статус линии не будет загружен. Авторизуйся на странице линии и обнови страницу Генезиса", "error");
      return;
    }

    // Default case: process socket message
    const parts = data.split(/,\s*(.+)/);
    const jsonData = JSON.parse(parts[1]);
    const msgData = jsonData[1];
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60 * 1000;
    const ekbTime = new Date(date.getTime() + offset + 5 * 60 * 60 * 1000);
    const timeString = ekbTime.toLocaleString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    handleSocketMessages(msgData, timeString);
  };

  socket.onclose = event => {
    if (event.wasClean) {
      console.warn(
        `[Хелпер] - [Генезис] - [Линия] Соединение закрыто чисто, код: ${event.code
        }, причина: ${event.reason}`,
      );
    } else {
      console.error(`[Хелпер] - [Генезис] - [Линия] Соединение прервано.`);
    }

    [document.querySelector("#line-status-nck1"), document.querySelector("#line-status-nck2")].forEach(el => {
      if (el) {
        el.innerText = "Починить";
      }
    });

    $.notify(`Переподключение к линии...`, "warning");
    attemptReconnect();
  };

  socket.onerror = error => {
    console.error(`[Хелпер] - [Генезис] - [Линия] Ошибка WebSocket:`, error);
    $.notify("Ошибка WebSocket<br/>Причина: " + error, "error");
    socket.close();
  };
}


async function manualReconnect() {
  /**
   * Manual reconnect to socket
   */
  if (socket) socket.close();
  const { okc_phpSessionId } = await getStorage(["okc_phpSessionId"]);
  if (okc_phpSessionId) {
    reconnectAttempts = 0;
    isActive = false;
    await socketConnect(okc_phpSessionId);
  }
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
    childList: true,
    subtree: true,
  });
}


function stripHtml(html) {
  /**
   * Strip HTML for better formatting in notifications
   */
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}


async function handleSocketMessages(data) {
  /**
   * Handling socket messages using socket jsonified data
   * @param data jsonified socket message data
   */
  const lineStatsNCK1 = document.querySelector("#line-status-nck1");
  const lineStatsNCK2 = document.querySelector("#line-status-nck2");

  const { GENESYS_showLineStatus_nck1, GENESYS_showLineStatus_nck2, GENESYS_showLineMessages } = userSettings;

  const updateLineStats = (el, lineNumber) => {
    if (!el || !data.waitingChats) return;
    el.style.color = data.waitingChats[`nck${lineNumber}`] > 0 ? "red" : "white";

    let contentToShow = `<span style="display: inline-flex; justify-content: center; width: 20px; height: 20px; background-color: #666666; border-radius: 50%; margin-right: 5px; font-size: 12px;">${lineNumber}</span>Слоты: ${data.chatCapacity[`nck${lineNumber}`].available}/${data.chatCapacity[`nck${lineNumber}`].max} | SL: ${data.daySl[`nck${lineNumber}`]}`;
    if (data.waitingChats[`nck${lineNumber}`] > 0) {
      contentToShow += ` | ОЧЕРЕДЬ: ${data.waitingChats[`nck${lineNumber}`]}`;
    }
    const newContent = `<p>${contentToShow}</p>`;
    if (el.innerHTML !== newContent) {
      el.innerHTML = DOMPurify.sanitize(newContent);
    }
  };

  GENESYS_showLineStatus_nck1 && updateLineStats(lineStatsNCK1, 1);
  GENESYS_showLineStatus_nck2 && updateLineStats(lineStatsNCK2, 2);

  if (GENESYS_showLineMessages && data.messageText) {
    const cleanMessage = stripHtml(data.messageText);
    console.log(cleanMessage);
    
    // Configure notification styling
    $.notify.defaults({
      style: 'bootstrap',
      elementPosition: 'right',
      globalPosition: 'top right',
      className: 'info',
      autoHideDelay: 15000
    });

    // Add custom CSS for notifications to page head
    $("<style>")
      .prop("type", "text/css")
      .html(`
        .notifyjs-bootstrap-base {
          max-width: 400px !important;
          white-space: normal !important;
          word-wrap: break-word !important;
        }
        .notifyjs-bootstrap-base .notify-title {
          font-weight: bold;
          margin-bottom: 5px;
          display: block;
        }
      `)
      .appendTo("head");

    $.notify({
      title: data.authorName,
      message: cleanMessage
    }, {
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
        '<span class="notify-title">{1}</span>' +
        '<span data-notify="message">{2}</span>' +
        '</div>'
    });
  }
}

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
      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      if (!data.message) {
        if (lastStatus !== "нет апдейтов") {
          genesysTitle.textContent = "НЦК2: нет апдейтов";
          lastStatus = "нет апдейтов";
          console.warn(
            `[Хелпер] - [Генезис] - [Аварийность] Изменений аварийности не найдено`,
          );
        }
        return;
      }

      const currentStatus = data.message;

      // Always update tooltip time even if status hasn't changed
      const isActive =
        currentStatus.includes("вкл") || currentStatus.includes("он");
      const titleForStatus =
        `${isActive ? "2+2 / 3+1\n" : "4+6 / 5+5\n"}` +
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
      console.error(`[Хелпер] - [Генезис] - [Аварийность] Ошибка:`, error);
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

  observer.observe(document.body, { childList: true, subtree: true });

  // Regular updates every second
  setInterval(getLineUpdate, 1000);

  console.info(
    `[Хелпер] - [Генезис] - [Аварийность] Загружена аварийность НЦК2`,
  );
}
