document.addEventListener("DOMContentLoaded", function () {
  const acceptButton = document.getElementById("acceptSelected");
  const declineButton = document.getElementById("declineAll");
  const storageConsent = document.getElementById("storageConsent");
  const apiConsent = document.getElementById("apiConsent");

  // Check if user has already given consent
  browser.storage.local.get("privacyConsents").then(({ privacyConsents }) => {
    if (privacyConsents) {
      window.close();
    }
  });

  acceptButton.addEventListener("click", async () => {
    // Validate that all checkboxes are checked
    if (!storageConsent.checked || !apiConsent.checked) {
      alert("Пожалуйста, подтверди все условия перед продолжением");
      return;
    }

    const consents = {
      storage: storageConsent.checked,
      api: apiConsent.checked,
    };

    await browser.storage.local.set({
      privacyConsents: consents,
      firstRun: false,
    });

    window.close();
  });

  declineButton.addEventListener("click", async () => {
    const confirmDelete = confirm("Ты уверен, что хочешь удалить расширение?");
    if (confirmDelete) {
      try {
        await browser.storage.local.clear();
        await browser.storage.sync.clear();
        await browser.management.uninstallSelf();
      } catch (error) {
        error("Ошибка при удалении:", error);
        alert(
          "Пожалуйста, удали расширение самостоятельно на странице about:addons",
        );
      }
    }
  });
});
