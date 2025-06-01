document.addEventListener("DOMContentLoaded", async function () {
    const submitMac = document.getElementById("submit-mac");
    const submitIP = document.getElementById("submit-ip");
    const submitLink = document.getElementById("submit-link");
    const submitSpecialist = document.getElementById("submit-specialist");
    const submitPremium = document.getElementById("submit-premium");
    // const submitGPT = document.getElementById("submit-gpt");

    submitMac.addEventListener("click", handleMacSubmit);
    submitIP.addEventListener("click", handleIPSubmit);
    submitLink.addEventListener("click", handleLinkSubmit);
    submitSpecialist.addEventListener("click", handleSpecialistSubmit);
    submitPremium.addEventListener("click", handlePremiumSubmit);
    // submitGPT.addEventListener("click", handleGPTSubmit);

    const mappings = {
        "input-link": "submit-link",
        "input-mac": "submit-mac",
        "input-ip": "submit-ip",
        "input-specialist": "submit-specialist"
    };

    Object.keys(mappings).forEach(inputId => {
        const input = document.getElementById(inputId);
        const buttonId = mappings[inputId];
        const button = document.getElementById(buttonId);

        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                button.click();
            }
        });
    });

    populatePremiumDropdown(); // Fill premium dropdown with updated values

    // Set specialist line in premium check
    try {
        const result = await browser.storage.sync.get("POPUP_userLine");
        const specialistLine = result.POPUP_userLine || "specialist";
        const selectElement = document.getElementById("premium-select");

        const optionIndex = Array.from(selectElement.options).findIndex(
            (option) => option.value === specialistLine,
        );
        selectElement.selectedIndex = optionIndex >= 0 ? optionIndex : 0;

        info(
            `[Хелпер] - [Проверка премии] Дожность сотрудника загружена: ${specialistLine}`,
        );
    } catch (error) {
        error(
            `[Хелпер] - [Проверка премии] Ошибка при загрузке линии:`,
            error,
        );
        document.getElementById("premium-select").selectedIndex = 0;
    }

    async function clearBrowsingData() {
        const dataToRemove = {cache: true, cookies: true, localStorage: true};

        // Clear the data
        await browser.browsingData.remove({since: 0}, dataToRemove);

        // Wait for operation to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify clearing (basic check)
        let success = true;
        if (dataToRemove.cookies) {
            try {
                const remainingCookies = await browser.cookies.getAll({});
                success = remainingCookies.length < 5; // Allow for essential cookies
                console.log("Remaining cookies:", remainingCookies.length);
            } catch (e) {
                console.log("Cannot verify cookies directly");
            }
        }

        alert("🔄 Рекомендуется перезапустить браузер для применения изменений");
        success ? $.notify("Данные очищены", "success") : $.notify("⚠️ Данные частично очищены", "warning")
        await info("[Хелпер] - [Очистка] Данные браузера успешно очищены")
    }

    // Set onclick listener for data clearing button
    document
        .getElementById("clearData")
        .addEventListener("click", function () {
            clearBrowsingData();
        });

    // Set onclick listener for settings button
    document
        .getElementById("openSettings")
        .addEventListener("click", function () {
            browser.runtime.openOptionsPage();
            window.close();
        });

    // Set onclick listener for Telegram button
    document
        .getElementById("openTelegram")
        .addEventListener("click", function () {
            window.open("https://t.me/+jH1mblw0ytcwOWUy", "_blank");
            window.close();
        });

    // Set onclick listener for Donate button
    document.getElementById("openDonate").addEventListener("click", function () {
        window.open("https://pay.cloudtips.ru/p/787b494c", "_blank");
        window.close();
    });

    // Set input listener for searchProvider
    document
        .getElementById("searchProvider")
        .addEventListener("input", () =>
            searchTable("searchProvider", "providersTable"),
        );

    // Set input listener for searchRouter
    document
        .getElementById("searchRouter")
        .addEventListener("input", () =>
            searchTable("searchRouter", "routersTable"),
        );

    const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]',
    );
    const tooltipList = [...tooltipTriggerList].map(
        (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl),
    );
});
