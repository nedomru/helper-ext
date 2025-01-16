const GENESYS_URL = {
    BASE: 'genesys-app1',
    MAIN_APP: 'http://genesys-app1.cc4.ertelecom.ru:82/ui/ad/v1/index'
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
        GENESYS_allowImagePaste: allowImagePaste
    },
    lineStatus: {
        GENESYS_showLineStatus_nck1: 'nck1',
        GENESYS_showLineStatus_nck2: 'nck2'
    }
};

// Инициализация логгера
const Logger = {
    info: (message) => console.info(`[Хелпер] - [Генезис] - ${message}`),
    error: (message) => console.error(`[Хелпер] - [Генезис] - Ошибка: ${message}`)
};

// Инициализация основных функций
async function initializeGenesysFeatures() {
    if (!document.URL.includes(GENESYS_URL.BASE)) {
        return;
    }

    try {
        const settings = await browser.storage.sync.get(Object.keys(GENESYS_FEATURES.core));

        for (const [feature, handler] of Object.entries(GENESYS_FEATURES.core)) {
            if (settings[feature]) {
                await handler();
            }
        }
        await customEmojis()
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
        const { okc_phpSessionId } = await browser.storage.sync.get('okc_phpSessionId');

        if (!okc_phpSessionId) {
            $.notify("Не установлен PHPSESSID. Авторизуйся на линии", "error");
            return;
        }

        const lineSettings = await browser.storage.sync.get(Object.keys(GENESYS_FEATURES.lineStatus));
        const shouldShowLineStatus = Object.values(lineSettings).some(setting => setting);

        if (shouldShowLineStatus) {
            await socketConnect(okc_phpSessionId);
            Logger.info('Статус линии - Активирован модуль статуса линии');
        }

    } catch (error) {
        Logger.error(`Ошибка инициализации статуса линии: ${error.message}`);
    }
}

// Общая инициализация
async function initializeGenesys() {
    try {
        await Promise.all([
            initializeGenesysFeatures(),
            initializeLineStatus()
        ]);
    } catch (error) {
        Logger.error(`Ошибка общей инициализации: ${error.message}`);
    }
}

// Инициализация функционала Генезиса
initializeGenesys();