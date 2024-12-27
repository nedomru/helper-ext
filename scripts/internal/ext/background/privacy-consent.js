document.addEventListener('DOMContentLoaded', function() {
    const acceptButton = document.getElementById('acceptSelected');
    const declineButton = document.getElementById('declineAll');
    const storageConsent = document.getElementById('storageConsent');
    const apiConsent = document.getElementById('apiConsent');

    acceptButton.addEventListener('click', async () => {
        const consents = {
            storage: storageConsent.checked,
            api: apiConsent.checked
        };

        await browser.storage.local.set({
            privacyConsents: consents,
            firstRun: false
        });

        if (!consents.storage && !consents.api) {
            await handleExtensionRemoval();
        } else {
            window.close();
        }
    });

    declineButton.addEventListener('click', handleExtensionRemoval);
});

async function handleExtensionRemoval() {
    try {
        // Clear any stored data
        await browser.storage.local.clear();
        await browser.storage.sync.clear();

        // Notify user and uninstall
        alert('Хелпер будет удален прямо сейчас, покеда :)');
        await browser.management.uninstallSelf();
    } catch (error) {
        console.error('Ошибка при удалении:', error);
        alert('Пожалуйста, удали расширение самостоятельно на странице about:addons');
    }
}