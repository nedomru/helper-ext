async function checkForUpdates() {
    function compareVersions(v1, v2) {
        const v1Parts = v1.split(".").map(Number);
        const v2Parts = v2.split(".").map(Number);
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;
            if (v1Part < v2Part) return -1; // v1 меньше v2
            if (v1Part > v2Part) return 1; // v1 больше v2
        }
        return 0; // версии равны
    }

    const response = await fetch(
        "https://api.github.com/repos/AuthFailed/domru-helper/releases/latest"
    );

    const data = await response.json();

    const latestVersion = data.tag_name;
    const currentVersion = browser.runtime.getManifest().version;

    if (compareVersions(latestVersion, currentVersion) > 0) {
        await browser.tabs.create({
            url: browser.runtime.getURL("pages/update.html"),
        });
    }
}

async function setDefaults() {
    const defaultSettings = {
        GENESYS_showFastButtons: true,
        GENESYS_showFB_flomaster: true,
        GENESYS_showFB_setupRouter: true,
        GENESYS_showFB_setupTV: true,
        ARM_allowCopy: true,
        ARM_sendClientCardExample: true,
        ARM_copyClientAddress: true,
        ARM_copyClientCard: true,
        ARM_copyClientAgreement: true,
        ARM_copySearchMAC: true,
        ARM_showHelperSMSButtons: true,
        ARM_copyTimeSlots: true,
        ARM_changeRequestFBCR: true,
        ARM_changeRequestFBCR_Open_KCNCK1: true,
        ARM_changeRequestFBLF: true,
        ARM_changeRequestFBLF_Open_KCNCK1: true,
        ARM_checkForSpecialClient: true,
        ARM_hideNonActiveApps: true,
        ARM_hideInfoTabRows: true,
        ARM_highlightRequestsClasses: true,
        ARM_filterClientSessions: true,
        LINE_showFB: true,
        LINE_showFB_Mail: true,
        LINE_showFB_Lunch: true,
        LINE_countAppointments: true,

        // Стандартные цвета
        HIGHLIGHTER_CS: "#ff0000",
        HIGHLIGHTER_EMAIL: "#006400",
        HIGHLIGHTER_OCTP: "#008080",
        HIGHLIGHTER_COMPENSATION: "#66CDAA",
        GENESYS_chatColors_agentPromptColor: "#3893E8",
        GENESYS_chatColors_agentTextColor: "#3893E8",
        GENESYS_chatColors_clientPromptColor: "#ED5252",
        GENESYS_chatColors_clientTextColor: "#ED5252",

        GENESYS_chatSound_newChatSound: "resources/sounds/Sound_1.mp3",
        GENESYS_chatSound_newMessageSound: "resources/sounds/Sound_1.mp3",
    };

    browser.storage.sync
        .get(Object.keys(defaultSettings))
        .then((existingSettings) => {
            // Устанавливаем только если значений нет
            const settingsToSet = {};

            Object.keys(defaultSettings).forEach((key) => {
                if (existingSettings[key] === undefined) {
                    settingsToSet[key] = defaultSettings[key];
                }
            });
            return browser.storage.sync.set(settingsToSet);
        })
        .then(() => {
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Базовые настройки установлены`
            )
        })
        .catch((error) => {
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Ошибка установки настроек: ` + error)
        });
}

browser.runtime.onInstalled.addListener(() => {
    checkForUpdates().then(() => {
        console.log("Хелпер - Проверка обновлений")
    });
    setDefaults().then(() => {
        console.log("Хелпер - Установка стандартных настроек")
    });
});
browser.runtime.onStartup.addListener(checkForUpdates);
