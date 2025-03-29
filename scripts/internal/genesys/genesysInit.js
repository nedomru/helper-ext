const GENESYS_URL = {
  BASE: "genesys-app1",
  MAIN_APP: "http://genesys-app1.cc4.ertelecom.ru:82/ui/ad/v1/index",
};

const GENESYS_FEATURES = {
  core: {
    GENESYS_hideUselessButtons: hideUselessButtons,
    GENESYS_showFastButtons: initGenesysButtons,
    GENESYS_showOCTPLineStatus: otpcLineStatus,
    GENESYS_chatColors: setupGenesysChatColors,
    GENESYS_chatSound: setupGenesysChatSound,
    GENESYS_showFlomaster: showFlomaster,
    GENESYS_hideAnswersTab: hideAnswersTab,
    GENESYS_hideMyRMs: hideMyRMs,
    GENESYS_hideChatHeader: hideChatHeader,
    GENESYS_allowChatResize: messageAreaResize,
    GENESYS_allowImagePaste: allowImagePaste,
    GENESYS_customEmoji: customEmojis,
  },
  lineStatus: {
    GENESYS_showLineStatus_nck1: "nck1",
    GENESYS_showLineStatus_nck2: "nck2",
    GENESYS_showLineMessages: "GENESYS_showLineMessages"
  },
};

// Инициализация логгера
const Logger = {
  info: (message) => console.info(`[Хелпер] - [Генезис] - ${message}`),
  error: (message) =>
    console.error(`[Хелпер] - [Генезис] - Ошибка: ${message}`),
};

// Инициализация основных функций
async function initializeGenesysFeatures() {
  if (!document.URL.includes(GENESYS_URL.BASE)) {
    return;
  }

  try {
    const settings = await browser.storage.sync.get(
      Object.keys(GENESYS_FEATURES.core),
    );

    for (const [feature, handler] of Object.entries(GENESYS_FEATURES.core)) {
      if (settings[feature]) {
        await handler();
      }
    }
    // await handleChatHeaders()
  } catch (error) {
    Logger.error(`Ошибка инициализации основных функций: ${error.message}`);
  }
}

// Инициализация мониторинга линии
async function initializeLineStatus() {
  if (!document.URL.includes(GENESYS_URL.MAIN_APP)) {
    return;
  }

  try {
    const { okc_phpSessionId } =
      await browser.storage.sync.get("okc_phpSessionId");

    if (!okc_phpSessionId) {
      return;
    }

    const lineSettings = await browser.storage.sync.get(
      Object.keys(GENESYS_FEATURES.lineStatus),
    );
    const shouldShowLineStatus = Object.values(lineSettings).some(
      (setting) => setting,
    );

    if (shouldShowLineStatus) {
      await socketConnect(okc_phpSessionId);
      Logger.info("Статус линии - Активирован модуль статуса линии");
    }
    $("<style>")
      .prop("type", "text/css")
      .html(`
        .notifyjs-bootstrap-base {
          font-size: 14px !important;
          padding: 15px 15px 15px 45px !important;
          border-radius: 4px !important;
          max-width: 400px !important;
          width: auto !important;
          min-width: 250px !important;
          box-sizing: border-box !important;
          background-position: 12px center !important;
          background-repeat: no-repeat !important;
          display: block !important;
          margin: 5px !important;
          white-space: normal !important;
          line-height: 1.4 !important;
          position: relative !important;
        }
        [data-notify="title"] {
          display: block !important;
          font-weight: bold !important;
          margin-bottom: 7px !important;
          white-space: normal !important;
        }
        [data-notify="message"] {
          display: block !important;
          word-wrap: break-word !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
          line-height: 1.4 !important;
        }
        .notifyjs-bootstrap-base [data-notify="text"] {
          display: block !important;
          word-wrap: break-word !important;
          white-space: normal !important;
          overflow-wrap: anywhere !important;
        }
      `)
      .appendTo("head");
  } catch (error) {
    Logger.error(`Ошибка инициализации статуса линии: ${error.message}`);
  }
}

// Общая инициализация
async function initializeGenesys() {
  try {
    await Promise.all([initializeGenesysFeatures(), initializeLineStatus()]);
  } catch (error) {
    Logger.error(`Ошибка общей инициализации: ${error.message}`);
  }
}

// Инициализация функционала Генезиса
initializeGenesys();
