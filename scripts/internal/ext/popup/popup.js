/* global browser */

document.addEventListener("DOMContentLoaded", function () {
    const submitMac = document.getElementById("submit-mac");
    const submitIP = document.getElementById("submit-ip");
    const submitWhois = document.getElementById("submit-whois");
    const submitLink = document.getElementById("submit-link");
    const submitPremium = document.getElementById("submit-premium");
    submitMac.addEventListener("click", handleMacSubmit);
    submitIP.addEventListener("click", handleIPSubmit);
    submitWhois.addEventListener("click", handleWhoisSubmit);
    submitLink.addEventListener("click", handleLinkSubmit);
    submitPremium.addEventListener("click", handlePremiumSubmit);

    document
        .getElementById("openSettings")
        .addEventListener("click", function () {
            browser.runtime.openOptionsPage();
            window.close();
        });
    document
        .getElementById("openTelegram")
        .addEventListener("click", function () {
            window.open("https://t.me/+jH1mblw0ytcwOWUy", "_blank");
            window.close();
        });
    document.getElementById("openPlaner").addEventListener("click", function () {
        window.open("https://planer.chrsnv.ru/spaces/issues/5aeb4b5fbfa349c5a4bd0d4897c807d3", "_blank");
        window.close();
    });
    document.getElementById("openDonate").addEventListener("click", function () {
        window.open("https://pay.cloudtips.ru/p/787b494c", "_blank");
        window.close();
    });

    document
        .getElementById("searchProvider")
        .addEventListener("input", () =>
            searchTable("searchProvider", "providersTable")
        );
    document
        .getElementById("searchRouter")
        .addEventListener("input", () =>
            searchTable("searchRouter", "routersTable")
        );

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});

