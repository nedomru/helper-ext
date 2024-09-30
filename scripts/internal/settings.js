document.addEventListener("DOMContentLoaded", async function () {
    $('[data-bs-toggle="tooltip"]').tooltip();
    document.getElementById("extension-version").textContent = browser.runtime.getManifest().version;

    // Загрузка сохраненных настроек
    const checkboxIds = [
        "OTHER_CheckUpdates",
        "OTHER_DarkTheme",
        // "OTHER_DarkTheme_ARM",
        "GENESYS_showLineStatus_nck1",
        "GENESYS_showLineStatus_nck2",
        /*"GENESYS_showLineMessages",*/
        "GENESYS_showFastButtons",
        "GENESYS_showFB_chatMaster",
        "GENESYS_showFB_setupRouter",
        "GENESYS_showFB_setupTV",
        "GENESYS_showFB_setupDecoder",
        "GENESYS_showFB_ftpPC",
        "GENESYS_showFB_ftpAndroid",
        "GENESYS_showFB_dashboard",
        "GENESYS_showFB_provisioning",
        "GENESYS_hideUselessButtons",
        // "GENESYS_hideChatHeader",
        "GENESYS_showOCTPLineStatus",
        // "GENESYS_showClientChannelOnCard",
        "ARM_allowCopy",
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
        "ARM_changeRequestFBLF_Open_SZVG",
        "ARM_changeRequestFBLF_Open_VhodNRD",
        "ARM_changeRequestFBLF_Open_Ticket",
        "ARM_changeRequestFBLF_Closed_CancelSZ",
        "ARM_changeRequestFBLF_Closed_NoPages",
        "ARM_changeRequestFBLF_Closed_NoSession",
        "ARM_changeRequestFBLF_Closed_LowSpeed",
        "ARM_changeRequestFBLF_Closed_Disconnections",
        "ARM_changeRequestFBLF_Closed_NoTV",
        "ARM_changeRequestFBLF_Closed_Youtube",
        "ARM_changeRequestFBLF_Self_Balance",
        "ARM_changeRequestFBLF_Self_Priost",
        "ARM_changeRequestFBLF_Self_Activation",
        "ARM_changeRequestFBLF_Self_ChangeTP",
        "ARM_changeRequestFBLF_Self_PromisedPayment",
        "ARM_changeRequestFBLF_Self_SpeedBonus",
        "ARM_changeRequestFBLF_Self_WiFiKey",
        "ARM_changeRequestFBLF_Self_RouterSetup",
        "ARM_changeRequestFBLF_Self_RiseAP",
        "ARM_changeRequestFBLF_Self_KTV",
        "ARM_changeRequestFBLF_Self_ActivateKey",
        "ARM_changeRequestFBLF_Self_PIN",
        "ARM_changeRequestFBLF_Self_Zvonok",
        "ARM_changeRequestFBLF_Self_CameraVN",
        "ARM_changeRequestFBLF_Self_Pult",
        "ARM_changeRequestFBLF_Self_BadPult",
        "ARM_changeRequestFBLF_FastChat_Accident",
        "ARM_changeRequestFBLF_FastChat_NoDiagnostic",
        "ARM_changeRequestFBLF_FastChat_DZ",
        "ARM_checkForSpecialClient",
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
        "LINE_updateNeededSL",
    ];

    const colorPickerIds = [
        "HIGHLIGHTER_CS",
        "HIGHLIGHTER_EMAIL",
        "HIGHLIGHTER_OCTP",
        "HIGHLIGHTER_SZVG",
        "HIGHLIGHTER_COMPENSATION",
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

    function toggleDarkTheme(isDark) {
        if (isDark) {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
    }

    // Загрузка состояния темной темы
    let darkThemeActive = result.OTHER_DarkTheme;
    toggleDarkTheme(darkThemeActive);

    // Обработчик изменения состояния переключателя темной темы
    const darkThemeCheckbox = document.getElementById("OTHER_DarkTheme");
    darkThemeCheckbox.addEventListener("change", function () {
        const isChecked = darkThemeCheckbox.checked;
        toggleDarkTheme(isChecked);
    });

    function handleCheckboxChange(event) {
        const setting = event.target.id;
        const isChecked = event.target.checked;
        browser.storage.sync
            .set({[setting]: isChecked})
            .then(() => {
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Настройка ${setting} изменена на ${isChecked}`
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
                    `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Цвет ${colorSetting} изменён на ${colorValue}`
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
            `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Скрыты вкладки начислений`
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
            `[${new Date().toLocaleTimeString()}] [Помощник] - [Настройки] Скрыты побочные вкладки`
        );
    });
});

function onError(error) {
    console.log(`Ошибка: ${error}`);
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
