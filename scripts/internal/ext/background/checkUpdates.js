async function checkForUpdates() {
    /**
     * Check if there is a new version of the extension available on GitHub.
     * If a new version is available, open the update page in a new tab.
     */
    function compareVersions(v1, v2) {
        const v1Parts = v1.split(".").map(Number);
        const v2Parts = v2.split(".").map(Number);
        for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;
            if (v1Part < v2Part) return -1; // v1 меньше v2
            if (v1Part > v2Part) return 1; // v1 больше v2
        }
        return 0; // versions are equal
    }

    const response = await fetch(
        "https://api.github.com/repos/nedomru/helper-site/releases/latest",
    );

    const data = await response.json();

    const latestVersion = data.tag_name;
    const currentVersion = browser.runtime.getManifest().version;

    if (compareVersions(latestVersion, currentVersion) > 0) {
        await browser.tabs.create({
            url: browser.runtime.getURL("pages/update.html"),
        });
        const {privacyConsents} =
            await browser.storage.local.get("privacyConsents");
        if (!privacyConsents) {
            const consentUrl = browser.runtime.getURL("pages/privacy-consent.html");
            await browser.tabs.create({url: consentUrl});
        }
    }
}

async function setDefaults() {
    /**
     * Set default extension settings and save them to local browser storage
     */
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
        ARM_changeRequestFBLF_Closed_ServiceEng: true,
        ARM_leftFrame_fastSR: true,
        ARM_leftFrame_fastSR_internet_noLink: true,
        ARM_leftFrame_fastSR_internet_uncatalogedBreaks: true,
        ARM_leftFrame_fastSR_internet_lowSpeed: true,
        ARM_leftFrame_fastSR_tv_noSignal: true,
        ARM_checkForSpecialClient: true,
        ARM_hideNonActiveApps: true,
        ARM_hideInfoTabRows: true,
        ARM_hideRequests: true,
        ARM_hideAppeals: true,
        ARM_hideConnectionRequests: true,
        ARM_showAgreementOnChange: true,
        ARM_highlightRequestsClasses: true,
        ARM_filterClientSessions: true,
        ARM_removeUselessDiagTabs: true,
        ARM_removeUselessAppealsColumns: true,
        ARM_setAppealItemToInternet: true,
        LINE_showFB: true,
        LINE_showFB_Mail: true,
        LINE_showFB_Lunch: true,
        LINE_countAppointments: true,
        LINE_highlightEndingAppointments: true,
        POPUP_userLine: "specialist",

        // Default colors
        HIGHLIGHTER_CS: "#ff0000",
        HIGHLIGHTER_EMAIL: "#006400",
        HIGHLIGHTER_OCTP: "#008080",
        HIGHLIGHTER_COMPENSATION: "#66CDAA",
        GENESYS_chatColors_agentPromptColor: "#3893E8",
        GENESYS_chatColors_agentTextColor: "#3893E8",
        GENESYS_chatColors_clientPromptColor: "#ED5252",
        GENESYS_chatColors_clientTextColor: "#ED5252",

        // Default sounds
        GENESYS_chatSound_newChatSound: "../resources/sounds/Sound_1.mp3",
        GENESYS_chatSound_newMessageSound: "../resources/sounds/Sound_1.mp3",
    };

    browser.storage.sync
        .get(Object.keys(defaultSettings))
        .then((existingSettings) => {
            // Set value to key only if the value of key is undefined
            const settingsToSet = {};

            Object.keys(defaultSettings).forEach((key) => {
                if (existingSettings[key] === undefined) {
                    settingsToSet[key] = defaultSettings[key];
                }
            });
            return browser.storage.sync.set(settingsToSet);
        })
        .then(() => {
            console.info(`[Хелпер] - [Запуск] Базовые настройки установлены`);
        })
        .catch((error) => {
            console.error(
                `[Хелпер] - [Запуск] Ошибка установки настроек: ` + error,
            );
        });
}

browser.runtime.onInstalled.addListener(async () => {
    checkForUpdates().then(async (details) => {
        console.info("[Хелпер] - [Запуск] Хелпер - Проверка обновлений");
    });
    setDefaults().then(() => {
        console.info("[Хелпер] - [Запуск] Установка стандартных настроек");
    });
    const consentUrl = browser.runtime.getURL("pages/privacy-consent.html");
    const { privacyConsents } = await browser.storage.local.get("privacyConsents");
    if (!privacyConsents) {
        await browser.tabs.create({ url: consentUrl });
    }
});

browser.runtime.onStartup.addListener(async () => {
    // Check for automatic data clearing setting on every startup
    const { automaticDataClearing } = await browser.storage.sync.get("automaticDataClearing");
    if (automaticDataClearing) {
        await clearBrowsingData();
    }

    checkForUpdates();
});