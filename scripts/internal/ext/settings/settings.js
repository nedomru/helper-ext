document.addEventListener("DOMContentLoaded", async function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
    document.getElementById("extension-version").textContent =
        browser.runtime.getManifest().version;

    document
        .getElementById("clearCacheAndCookie")
        .addEventListener("click", () => {
            clearBrowsingData({ cache: true, cookies: true });
        });

    document
        .getElementById("clearCache")
        .addEventListener("click", () => {
            clearBrowsingData({ cache: true });
        });

    document
        .getElementById("clearCookie")
        .addEventListener("click", () => {
            clearBrowsingData({ cookies: true });
        });
    document
        .getElementById("checkUpdates")
        .addEventListener("click", checkForUpdates);
    document
        .getElementById("exportSettings")
        .addEventListener("click", exportSettings);
    document
        .getElementById("exportSettings")
        .addEventListener("click", exportSettings);
    document
        .getElementById("importSettings")
        .addEventListener("change", importSettings);
    document.getElementById("exportTabs").addEventListener("click", exportTabs);
    document.getElementById("importTabs").addEventListener("change", importTabs);
    document
        .getElementById("chatPlaySound")
        .addEventListener("click", function () {
            const selectedSound = document.getElementById("chatSoundSelect").value;
            const audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = selectedSound;

            audioPlayer.play();
        });
    document
        .getElementById("messagePlaySound")
        .addEventListener("click", function () {
            const selectedSound = document.getElementById("messageSoundSelect").value;
            const audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = selectedSound;

            audioPlayer.play();
        });

    const chatSoundSelect = document.getElementById("chatSoundSelect");
    const messageSoundSelect = document.getElementById("messageSoundSelect");

    chatSoundSelect.addEventListener("change", saveChatSelectedSound);

    function saveChatSelectedSound() {
        const selectedSound = chatSoundSelect.value;
        browser.storage.sync
            .set({GENESYS_chatSound_newChatSound: selectedSound})
            .then(() => {
                info(
                    `[Хелпер] - [Настройки] Настройка выбранного звука изменена на ${selectedSound}`,
                );
            })
            .catch((error) => {
                error(
                    `[Хелпер] - [Настройки] Ошибка при сохранении выбранного звука: ${error}`,
                );
            });
    }

    messageSoundSelect.addEventListener("change", saveMessageSelectedSound);

    function saveMessageSelectedSound() {
        const selectedSound = messageSoundSelect.value;
        browser.storage.sync
            .set({GENESYS_chatSound_newMessageSound: selectedSound})
            .then(() => {
                info(
                    `[Хелпер] - Настройка выбранного звука изменена на ${selectedSound}`,
                );
            })
            .catch((error) => {
                error("Ошибка при сохранении выбранного звука:", error);
            });
    }

    // Загрузка сохраненных настроек
    const checkboxIds = [
        "GENESYS_showLineStatus_nck1",
        "GENESYS_showFastButtons",
        "GENESYS_showFB_flomaster",
        "GENESYS_showFB_channelsktv",
        "GENESYS_showFB_channelscktv",
        "GENESYS_showFB_setupRouter",
        "GENESYS_showFB_setupTV",
        "GENESYS_showFB_setupDecoder",
        "GENESYS_showFB_ftpPC",
        "GENESYS_showFB_ftpAndroid",
        "GENESYS_showFB_dashboard",
        "GENESYS_showFB_provisioning",
        "GENESYS_hideUselessButtons",
        "GENESYS_showOCTPLineStatus",
        "GENESYS_chatColors",
        "GENESYS_chatSound",
        "GENESYS_showFlomaster",
        "GENESYS_hideAnswersTab",
        "GENESYS_hideMyRMs",
        "GENESYS_hideChatHeader",
        "GENESYS_allowChatResize",
        "GENESYS_allowImagePaste",
        "GENESYS_customEmoji",
        "GENESYS_showLineMessages",
        "ARM_allowCopy",
        "ARM_sendClientCardExample",
        "ARM_hideSPAS",
        "ARM_copyClientAddress",
        "ARM_copyClientCard",
        "ARM_copyClientAgreement",
        "ARM_copySearchMAC",
        "ARM_copyTimeSlots",
        "ARM_showHelperSMSButtons",
        "ARM_changeRequestFBCR",
        "ARM_changeRequestFBCR_Open_KCNCK1",
        "ARM_changeRequestFBCR_Open_NTPISH",
        "ARM_changeRequestFBCR_Open_ABONISH",
        "ARM_changeRequestFBCR_Open_TS",
        "ARM_changeRequestFBCR_Open_NRD",
        "ARM_changeRequestFBLF",
        "ARM_changeRequestFBLF_Open_KCNCK1",
        "ARM_changeRequestFBLF_Open_Abon",
        "ARM_changeRequestFBLF_Open_AbonPriost",
        "ARM_changeRequestFBLF_Open_VhodNRD",
        "ARM_changeRequestFBLF_Open_Ticket",
        "ARM_changeRequestFBLF_Closed_CancelSZ",
        "ARM_changeRequestFBLF_Closed_NoPages",
        "ARM_changeRequestFBLF_Closed_NoSession",
        "ARM_changeRequestFBLF_Closed_LowSpeed",
        "ARM_changeRequestFBLF_Closed_Disconnections",
        "ARM_changeRequestFBLF_Closed_NoTV",
        "ARM_changeRequestFBLF_Open_Youtube",
        "ARM_changeRequestFBLF_FastChat_Accident",
        "ARM_changeRequestFBLF_FastChat_NoDiagnostic",
        "ARM_changeRequestFBLF_FastChat_DZ",
        "ARM_changeRequestFBLF_Closed_ServiceEng",
        "ARM_leftFrame_fastSR",
        "ARM_leftFrame_fastSR_internet_noLink",
        "ARM_leftFrame_fastSR_internet_uncatalogedBreaks",
        "ARM_leftFrame_fastSR_internet_lowSpeed",
        "ARM_leftFrame_fastSR_tv_noSignal",
        "ARM_checkForSpecialClient",
        "ARM_checkPaidHelp",
        "ARM_showAgreementOnChange",
        "ARM_hideTabIPTV",
        "ARM_hideTabMVNO",
        "ARM_hideTabAVTOSP",
        "ARM_hideTabPORTRET",
        "ARM_hideTabABONEMENT",
        "ARM_hideTabPL",
        "ARM_hideTabInvoices",
        "ARM_hideTabPayments",
        "ARM_hideTabAutopayment",
        "ARM_hideTabDiagnostic",
        "ARM_hideTabDiagnosticNew",
        "ARM_hideTabSpecialOffers",
        "ARM_hideTabBalanceLimit",
        "ARM_hideTabMNP",
        "ARM_hideTabMainSales",
        "ARM_hideTabLoans",
        "ARM_hideNonActiveApps",
        "ARM_hideInfoTabRows",
        "ARM_hideRequests",
        "ARM_hideAppeals",
        "ARM_hideConnectionRequests",
        "ARM_checkWrongTransfer",
        "ARM_checkSetToMe",
        "ARM_copyClientAddressWithoutCity",
        "ARM_highlightRequestsClasses",
        "ARM_filterClientSessions",
        "ARM_removeUselessDiagTabs",
        "ARM_removeUselessAppealsColumns",
        "ARM_setAppealItemToInternet",
        "LINE_highlightOperators",
        "LINE_dutyButtons",
        "LINE_showFB",
        "LINE_showFB_Mail",
        "LINE_showFB_Lunch",
        "LINE_showFB_OKC",
        "LINE_showFB_BZ",
        "LINE_showFB_ARM",
        "LINE_showFB_BreakNCK",
        "LINE_showFB_JIRA",
        "LINE_showFB_NTP1",
        "LINE_showFB_NTP2",
        "LINE_countAppointments",
        "LINE_highlightEndingAppointments",
        "automaticDataClearing"
    ];

    const colorPickerIds = [
        "HIGHLIGHTER_CS",
        "HIGHLIGHTER_EMAIL",
        "HIGHLIGHTER_OCTP",
        "HIGHLIGHTER_COMPENSATION",
        "GENESYS_chatColors_agentPromptColor",
        "GENESYS_chatColors_agentTextColor",
        "GENESYS_chatColors_clientPromptColor",
        "GENESYS_chatColors_clientTextColor",
    ];

    const soundPick = [
        "GENESYS_chatSound_newChatSound",
        "GENESYS_chatSound_newMessageSound",
    ];

    const other = ["POPUP_userLine", "automaticDataClearing"];

    const result = await browser.storage.sync.get(checkboxIds);
    try {
        checkboxIds.forEach((id) => {
            const checkbox = document.getElementById(id);
            checkbox.checked = result[id] || false;
        });
    } catch (error) {
        error(`Ошибка при загрузке настроек: ${error}`);
    }

    try {
        const colorResults = await browser.storage.sync.get(colorPickerIds);
        colorPickerIds.forEach((id) => {
            const colorPicker = document.getElementById(id);
            colorPicker.value = colorResults[id] || "#007bff";
        });
    } catch (error) {
        error(`Ошибка при загрузке цветов: ${error}`);
    }

    try {
        const soundSelects = await browser.storage.sync.get(soundPick);
        document.getElementById("chatSoundSelect").value =
            soundSelects.GENESYS_chatSound_newChatSound;
        document.getElementById("messageSoundSelect").value =
            soundSelects.GENESYS_chatSound_newMessageSound;
    } catch (error) {
        error(`Ошибка при загрузке звуков: ${error}`);
    }

    function handleCheckboxChange(event) {
        const setting = event.target.id;
        const isChecked = event.target.checked;
        browser.storage.sync
            .set({[setting]: isChecked})
            .then(() => {
                info(
                    `[Хелпер] - [Настройки] Настройка ${setting} изменена на ${isChecked}`,
                );
            })
            .catch(onError);
    }

    function handleColorChange(event) {
        const colorSetting = event.target.id;
        const colorValue = event.target.value;
        browser.storage.sync
            .set({[colorSetting]: colorValue})
            .then(() => {
                info(
                    `[Хелпер] - [Настройки] Цвет ${colorSetting} изменён на ${colorValue}`,
                );
            })
            .catch(onError);
    }

    // Привязка обработчиков изменения к чекбоксам
    checkboxIds.forEach((id) => {
        const checkbox = document.getElementById(id);
        checkbox.addEventListener("change", handleCheckboxChange);
    });

    // Привязка обработчиков изменения к color picker
    colorPickerIds.forEach((id) => {
        const colorPicker = document.getElementById(id);
        colorPicker.addEventListener("input", handleColorChange);
    });

    // Общая функция для кнопок с тогглами
    function toggleCheckboxes(checkboxIds) {
        checkboxIds.forEach((id) => {
            document.getElementById(id).checked = true;
        });

        browser.storage.sync
            .set(checkboxIds.reduce((acc, id) => ({...acc, [id]: true}), {}))
            .catch(onError);
    }

    // Обработчик для кнопки "toggleMoneyButton"
    const toggleMoneyButton = document.getElementById("toggleMoneyCheckboxes");
    toggleMoneyButton.addEventListener("click", function () {
        const moneyCheckboxIds = [
            "ARM_hideTabABONEMENT",
            "ARM_hideTabPL",
            "ARM_hideTabInvoices",
            "ARM_hideTabPayments",
            "ARM_hideTabAutopayment",
            "ARM_hideTabSpecialOffers",
            "ARM_hideTabBalanceLimit",
            "ARM_hideTabMainSales",
            "ARM_hideTabLoans",
        ];
        toggleCheckboxes(moneyCheckboxIds);
        info(`[Хелпер] - [Настройки] Скрыты вкладки начислений`);
    });

    // Обработчик для кнопки "toggleOtherButton"
    const toggleOtherButton = document.getElementById("toggleOtherCheckboxes");
    toggleOtherButton.addEventListener("click", function () {
        const otherCheckboxIds = [
            "ARM_hideTabIPTV",
            "ARM_hideTabMVNO",
            "ARM_hideTabAVTOSP",
            "ARM_hideTabPORTRET",
            "ARM_hideTabMNP",
            "ARM_hideTabDiagnostic",
            "ARM_hideTabDiagnosticNew",
        ];
        toggleCheckboxes(otherCheckboxIds);
        info(`[Хелпер] - [Настройки] Скрыты побочные вкладки`);
    });

    // Экспорт настроек
    const allSettingsIds = [
        ...checkboxIds,
        ...colorPickerIds,
        ...soundPick,
        ...other,
    ];

    function exportSettings() {
        chrome.storage.sync.get(allSettingsIds, function (settings) {
            const blob = new Blob([JSON.stringify(settings)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "helper_settings.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }

    // Импорт настроек
    function importSettings(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            const settings = JSON.parse(event.target.result);
            browser.storage.sync.set(settings, function () {
                info(
                    `[Хелпер] - [Настройки] - Настройки успешно экспортированы`,
                );
                $.notify("Настройки успешно импортированы", "success");
            });
        };
        reader.readAsText(file);
    }

    // Экспорт вкладок
    function exportTabs() {
        browser.tabs
            .query({})
            .then((tabs) => {
                const tabsData = tabs.map((tab) => ({
                    url: tab.url,
                    title: tab.title,
                    pinned: tab.pinned,
                    active: tab.active,
                }));

                const blob = new Blob([JSON.stringify(tabsData, null, 2)], {
                    type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                a.download = `browser_tabs_${timestamp}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            })
            .catch((error) => {
                error(
                    `[Хелпер] - [Настройки] Ошибка при экспорте вкладок:`,
                    error,
                );
                $.notify("Ошибка при экспорте вкладок", "error");
            });
    }

    // Импорт вкладок
    function importTabs(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                const tabsData = JSON.parse(event.target.result);

                // Create all tabs
                Promise.all(
                    tabsData.map((tabData) => {
                        return browser.tabs.create({
                            url: tabData.url,
                            pinned: tabData.pinned,
                            active: false, // We'll activate the appropriate tab later
                        });
                    }),
                )
                    .then((createdTabs) => {
                        // Find and activate the tab that was active in the exported data
                        const activeTabData = tabsData.find((tab) => tab.active);
                        if (activeTabData) {
                            const activeTab = createdTabs.find(
                                (tab) => tab.url === activeTabData.url,
                            );
                            if (activeTab) {
                                browser.tabs.update(activeTab.id, {active: true});
                            }
                        }

                        $.notify("Вкладки успешно импортированы", "success");
                    })
                    .catch((error) => {
                        error(
                            `[Хелпер] - [Настройки] Ошибка при импорте вкладок:`,
                            error,
                        );
                        $.notify("Ошибка при импорте вкладок", "error");
                    });
            } catch (error) {
                error(
                    `[Хелпер] - [Настройки] Ошибка при парсинге файла вкладок:`,
                    error,
                );
                $.notify("Ошибка при чтении файла вкладок", "error");
            }
        };
        reader.readAsText(file);
    }

    async function clearBrowsingData({ cache = false, cookies = false }) {
        const dataToRemove = {};
        if (cache) dataToRemove.cache = true;
        if (cookies) dataToRemove.cookies = true;
        dataToRemove.localStorage = true;

        if (Object.keys(dataToRemove).length === 0) return;

        const clearedItems = Object.keys(dataToRemove);

        try {
            // Clear the data
            await browser.browsingData.remove({ since: 0 }, dataToRemove);

            // Wait for operation to complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Verify clearing (basic check)
            let success = true;
            if (dataToRemove.cookies) {
                try {
                    const remainingCookies = await browser.cookies.getAll({});
                    success = remainingCookies.length < 5; // Allow for essential cookies
                    await info("[Хелпер] - [Очистка] Осталось куки после очистки:", remainingCookies.length);
                } catch (e) {
                    await info("[Хелпер] - [Очистка] Невозможно верифицировать куки");
                }
            }

            // Show appropriate message and handle restart
            clearedItems.join(", ");
            alert("🔄 Рекомендуется перезапустить браузер для применения изменений");
            success ? $.notify("Данные очищены", "success") : $.notify("⚠️ Данные частично очищены", "warning")

            await info("[Хелпер] - [Очистка] Данные браузера успешно очищены")

        } catch (errorInfo) {
            await error("[Хелпер] - [Очистка] Ошибка при очистке:", error);
            const errorMessage = `❌ Ошибка при очистке: ${clearedItems.join(", ")}\n\n🔄 Попробуй перезапустить браузер и повторить операцию.`;
            alert(errorMessage);
            $.notify("Ошибка очистки данных", "error");
        }
    }

    // Add log management functionality
    const downloadLogsBtn = document.getElementById('downloadLogs');
    const clearLogsBtn = document.getElementById('clearLogs');
    const logContent = document.getElementById('logContent');

    // Function to update log viewer
    async function updateLogViewer() {
        try {
            const logs = await getLogs();
            logContent.textContent = logs.map(log =>
                `[${log.timestamp}] [${log.level}]${log.module ? ` [${log.module}]` : ''} ${log.message}`
            ).join('\n');
        } catch (error) {
            error('Error updating log viewer:', error);
        }
    }

    // Download logs button handler
    downloadLogsBtn.addEventListener('click', async () => {
        try {
            await downloadLogs();
        } catch (error) {
            error('Error downloading logs:', error);
        }
    });

    // Clear logs button handler
    clearLogsBtn.addEventListener('click', async () => {
        try {
            await clearLogs();
            await updateLogViewer();
        } catch (error) {
            error('Error clearing logs:', error);
        }
    });

    // Initial log viewer update
    await updateLogViewer();
});

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
        "https://api.github.com/repos/nedomru/helper-site/releases/latest",
    );

    const data = await response.json();

    const latestVersion = data.tag_name;
    const currentVersion = browser.runtime.getManifest().version;

    if (compareVersions(latestVersion, currentVersion) > 0) {
        await browser.tabs.create({
            url: browser.runtime.getURL("pages/update.html"),
        });
    } else {
        $.notify("Обновлений нет");
    }
}

function onError(error) {
    error(`[Хелпер] - [Настройки] Произошла ошибка: ${error}`);
}

$(document).ready(function () {
    // Логика для вложенных дропдаунов
    $(".dropdown-submenu a.dropdown-item").on("click", function (e) {
        e.preventDefault(); // предотвращает переход по ссылке
        e.stopPropagation(); // предотвращает всплытие события к родительским элементам

        // Инициализируем вкладку, если она неактивна
        if (!$(this).hasClass("active")) {
            $('[data-bs-toggle="tab"]').removeClass("active");
            $(this).addClass("active"); // Добавляем активный класс
        }

        // Переключаем вкладку
        var targetTab = $(this).attr("href");
        $(".tab-pane").removeClass("show active"); // Скрываем все вкладки
        $(targetTab).addClass("show active"); // Показываем выбранную вкладку
    });
});
