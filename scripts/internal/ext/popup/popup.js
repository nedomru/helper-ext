/* global browser */

document.addEventListener("DOMContentLoaded", async function () {
    const submitMac = document.getElementById("submit-mac");
    const submitIP = document.getElementById("submit-ip");
    const submitLink = document.getElementById("submit-link");
    const submitSpecialist = document.getElementById("submit-specialist");
    const submitPremium = document.getElementById("submit-premium");

    submitMac.addEventListener("click", handleMacSubmit);
    submitIP.addEventListener("click", handleIPSubmit);
    submitLink.addEventListener("click", handleLinkSubmit);
    submitSpecialist.addEventListener("click", handleSpecialistSubmit);
    submitPremium.addEventListener("click", handlePremiumSubmit);



    populatePremiumDropdown()

    // Установка линии специалиста в проверке премии
    try {
        const result = await browser.storage.sync.get("POPUP_userLine");
        const specialistLine = result.POPUP_userLine || "nck1";
        const selectElement = document.getElementById("premium-select");

        const optionIndex = Array.from(selectElement.options).findIndex(option => option.value === specialistLine);
        selectElement.selectedIndex = optionIndex >= 0 ? optionIndex : 0;

        console.info(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Проверка премии] Загружена линия специалиста: ${specialistLine}`);
    } catch (error) {
        console.error(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Проверка премии] Ошибка при загрузке линии:`, error);
        document.getElementById("premium-select").selectedIndex = 0;
    }

    document.getElementById("openSettings").addEventListener("click", function () {
        browser.runtime.openOptionsPage();
        window.close();
    });

    document.getElementById("openTelegram").addEventListener("click", function () {
        window.open("https://t.me/+jH1mblw0ytcwOWUy", "_blank");
        window.close();
    });

    document.getElementById("openDonate").addEventListener("click", function () {
        window.open("https://pay.cloudtips.ru/p/787b494c", "_blank");
        window.close();
    });

    document.getElementById("searchProvider").addEventListener("input", () =>
        searchTable("searchProvider", "providersTable")
    );

    document.getElementById("searchRouter").addEventListener("input", () =>
        searchTable("searchRouter", "routersTable")
    );

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

