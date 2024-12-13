document.addEventListener("DOMContentLoaded", async function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
    document.getElementById("extension-version").textContent = browser.runtime.getManifest().version;

    document.getElementById("exportSettings").addEventListener("click", exportSettings);
    document.getElementById("importSettings").addEventListener("change", importSettings);
    document.getElementById("exportTabs").addEventListener("click", exportTabs);
    document.getElementById("importTabs").addEventListener("change", importTabs);
    document.getElementById("chatPlaySound").addEventListener("click", function () {
            const selectedSound = document.getElementById("chatSoundSelect").value;
            const audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = selectedSound;

            audioPlayer.play()
        });
    document.getElementById("messagePlaySound").addEventListener("click", function () {
            const selectedSound = document.getElementById("messageSoundSelect").value;
            const audioPlayer = document.getElementById("audioPlayer");
            audioPlayer.src = selectedSound;

            audioPlayer.play()
        });

    const chatSoundSelect = document.getElementById("chatSoundSelect");
    const messageSoundSelect = document.getElementById("messageSoundSelect");

    chatSoundSelect.addEventListener("change", saveChatSelectedSound);

    function saveChatSelectedSound() {
        const selectedSound = chatSoundSelect.value;
        browser.storage.sync
            .set({GENESYS_chatSound_newChatSound: selectedSound})
            .then(() => {
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Настройка выбранного звука изменена на ${selectedSound}`,
                );
            })
            .catch((error) => {
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Ошибка при сохранении выбранного звука: ${error}`,
                );
            });
    }

    messageSoundSelect.addEventListener("change", saveMessageSelectedSound);

    function saveMessageSelectedSound() {
        const selectedSound = messageSoundSelect.value;
        browser.storage.sync
            .set({GENESYS_chatSound_newMessageSound: selectedSound})
            .then(() => {
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - Настройка выбранного звука изменена на ${selectedSound}`,
                );
            })
            .catch((error) => {
                console.error("Ошибка при сохранении выбранного звука:", error);
            });
    }

    // Загрузка сохраненных настроек
    const checkboxIds = [
        "GENESYS_showLineStatus_nck1",
        "GENESYS_showLineStatus_nck2",
        "GENESYS_showFastButtons",
        "GENESYS_showFB_flomaster",
        "GENESYS_showFB_channelsktv",
        "GENESYS_showFB_channelscktv",
        "GENESYS_showFB_chatMaster",
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
        "ARM_changeRequestFBCR_Open_KCNCK2",
        "ARM_changeRequestFBCR_Open_NTPISH",
        "ARM_changeRequestFBCR_Open_ABONISH",
        "ARM_changeRequestFBCR_Open_TS",
        "ARM_changeRequestFBCR_Open_NRD",
        "ARM_changeRequestFBLF",
        "ARM_changeRequestFBLF_Open_KCNCK1",
        "ARM_changeRequestFBLF_Open_KCNCK2",
        "ARM_changeRequestFBLF_Open_VhodNRD",
        "ARM_changeRequestFBLF_Open_Ticket",
        "ARM_changeRequestFBLF_Closed_CancelSZ",
        "ARM_changeRequestFBLF_Closed_NoPages",
        "ARM_changeRequestFBLF_Closed_NoSession",
        "ARM_changeRequestFBLF_Closed_LowSpeed",
        "ARM_changeRequestFBLF_Closed_Disconnections",
        "ARM_changeRequestFBLF_Closed_NoTV",
        "ARM_changeRequestFBLF_Closed_Youtube",
        "ARM_changeRequestFBLF_Self_Priost",
        "ARM_changeRequestFBLF_Self_Activation",
        "ARM_changeRequestFBLF_Self_SpeedBonus",
        "ARM_changeRequestFBLF_Self_WiFiKey",
        "ARM_changeRequestFBLF_Self_RouterSetup",
        "ARM_changeRequestFBLF_Self_RiseAP",
        "ARM_changeRequestFBLF_Self_KTV",
        "ARM_changeRequestFBLF_Self_ActivateKey",
        "ARM_changeRequestFBLF_Self_PIN",
        "ARM_changeRequestFBLF_Self_Zvonok",
        "ARM_changeRequestFBLF_Self_recoverLK",
        "ARM_changeRequestFBLF_Self_CameraVN",
        "ARM_changeRequestFBLF_Self_Pult",
        "ARM_changeRequestFBLF_Self_BadPult",
        "ARM_changeRequestFBLF_Self_Subscriptions",
        "ARM_changeRequestFBLF_Self_ChangeWiFi",
        "ARM_changeRequestFBLF_FastChat_Accident",
        "ARM_changeRequestFBLF_FastChat_NoDiagnostic",
        "ARM_changeRequestFBLF_FastChat_DZ",
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
        "ARM_checkWrongTransfer",
        "ARM_checkSetToMe",
        "ARM_copyClientAddressWithoutCity",
        "ARM_highlightRequestsClasses",
        "ARM_filterClientSessions",
        "LINE_highlightOperators",
        "LINE_dutyButtons",
        "LINE_showFB",
        "LINE_showFB_Mail",
        "LINE_showFB_Lunch",
        "LINE_showFB_OKC",
        "LINE_showFB_BZ",
        "LINE_showFB_ARM",
        "LINE_showFB_BreakNCK1",
        "LINE_showFB_BreakNCK2",
        "LINE_showFB_JIRA",
        "LINE_showFB_NTP1",
        "LINE_showFB_NTP2",
        // "LINE_updateNeededSL",
        "LINE_countAppointments",
        "LINE_highlightEndingAppointments"
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

    const result = await browser.storage.sync.get(checkboxIds);
    try {
        checkboxIds.forEach((id) => {
            const checkbox = document.getElementById(id);
            checkbox.checked = result[id] || false;
        });
    } catch (error) {
        console.error(`Ошибка при загрузке настроек: ${error}`);
    }

    try {
        const colorResults = await browser.storage.sync.get(colorPickerIds);
        colorPickerIds.forEach((id) => {
            const colorPicker = document.getElementById(id);
            colorPicker.value = colorResults[id] || "#007bff";
        });
    } catch (error) {
        console.error(`Ошибка при загрузке цветов: ${error}`);
    }

    try {
        const soundSelects = await browser.storage.sync.get(soundPick);
        document.getElementById("chatSoundSelect").value =
            soundSelects.GENESYS_chatSound_newChatSound;
        document.getElementById("messageSoundSelect").value =
            soundSelects.GENESYS_chatSound_newMessageSound;
    } catch (error) {
        console.error(`Ошибка при загрузке звуков: ${error}`);
    }

    function handleCheckboxChange(event) {
        const setting = event.target.id;
        const isChecked = event.target.checked;
        browser.storage.sync
            .set({[setting]: isChecked})
            .then(() => {
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Настройка ${setting} изменена на ${isChecked}`,
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
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Цвет ${colorSetting} изменён на ${colorValue}`,
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
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Скрыты вкладки начислений`,
        );
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
        console.log(
            `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Скрыты побочные вкладки`,
        );
    });

    // Экспорт настроек
    const allSettingsIds = [...checkboxIds, ...colorPickerIds, ...soundPick];

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
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] - Настройки успешно экспортированы`,
                );
                $.notify("Настройки успешно импортированы", "success");
            });
        };
        reader.readAsText(file);
    }

    // Экспорт вкладок
    function exportTabs() {
        browser.tabs.query({}).then((tabs) => {
            const tabsData = tabs.map(tab => ({
                url: tab.url,
                title: tab.title,
                pinned: tab.pinned,
                active: tab.active
            }));

            const blob = new Blob([JSON.stringify(tabsData, null, 2)], {
                type: "application/json"
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
        }).catch((error) => {
            console.error(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Ошибка при экспорте вкладок:`, error);
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
                Promise.all(tabsData.map(tabData => {
                    return browser.tabs.create({
                        url: tabData.url,
                        pinned: tabData.pinned,
                        active: false // We'll activate the appropriate tab later
                    });
                })).then(createdTabs => {
                    // Find and activate the tab that was active in the exported data
                    const activeTabData = tabsData.find(tab => tab.active);
                    if (activeTabData) {
                        const activeTab = createdTabs.find(tab => tab.url === activeTabData.url);
                        if (activeTab) {
                            browser.tabs.update(activeTab.id, {active: true});
                        }
                    }

                    $.notify("Вкладки успешно импортированы", "success");
                }).catch(error => {
                    console.error(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Ошибка при импорте вкладок:`, error);
                    $.notify("Ошибка при импорте вкладок", "error");
                });
            } catch (error) {
                console.error(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Ошибка при парсинге файла вкладок:`, error);
                $.notify("Ошибка при чтении файла вкладок", "error");
            }
        };
        reader.readAsText(file);
    }

});

function onError(error) {
    console.log(
        `[${new Date().toLocaleTimeString()}] [Хелпер] - [Настройки] Произошла ошибка: ${error}`,
    );
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
