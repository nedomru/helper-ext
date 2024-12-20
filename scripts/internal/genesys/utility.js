// Удаление бесполезных кнопок
async function hideUselessButtons() {
    const buttonsToRemove = [
        "Facebook In Progress",
        "Facebook Draft",
        "Twitter In Progress",
        "Twitter Draft",
    ];

    const observerOther = new MutationObserver(() => {
        const facebookButton = document.querySelector(
            `a[aria-label="Facebook In Progress"]`
        );

        if (facebookButton) {
            buttonsToRemove.forEach((button) => {
                const btn = document.querySelector(`a[aria-label="${button}"]`);
                if (btn) {
                    btn.remove();
                }
            });
            document.querySelector(".dropdown.account-help").remove();
            document.querySelector(".rebranding-logo").remove();

            observerOther.disconnect();
            console.info(
                `[Хелпер] - [Генезис] - [Бесполезные кнопки] Все бесполезные кнопки удалены`
            );
        }
    });

    observerOther.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Изменение цветов клиента и оператора в чате
async function setupGenesysChatColors() {
    function applyColors() {
        browser.storage.sync.get([
            "GENESYS_chatColors_agentPromptColor",
            "GENESYS_chatColors_agentTextColor",
            "GENESYS_chatColors_clientPromptColor",
            "GENESYS_chatColors_clientTextColor",
        ], function (result) {
            const agentNameColor = result.GENESYS_chatColors_agentPromptColor;
            const agentTextColor = result.GENESYS_chatColors_agentTextColor;
            const clientNameColor = result.GENESYS_chatColors_clientPromptColor;
            const clientTextColor = result.GENESYS_chatColors_clientTextColor;

            const colorScript = document.createElement('script');
            colorScript.type = 'text/javascript';
            let code = `
window.genesys.wwe.configuration.set("chat.agent.prompt-color", "${agentNameColor}");
window.genesys.wwe.configuration.set("chat.agent.text-color", "${agentTextColor}");
window.genesys.wwe.configuration.set("chat.client.prompt-color", "${clientNameColor}");
window.genesys.wwe.configuration.set("chat.client.text-color", "${clientTextColor}");
      `
            colorScript.appendChild(document.createTextNode(code));

            document.body.appendChild(colorScript)

            $.notify("Загружены кастомные цвета чата", "success")
            console.info(`[Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные цвета чата`)
        });
    }

    function checkForGenesys() {
        if (document.querySelector(".wwe-account-state")) {
            observer.disconnect();
            applyColors();
        }
    }

    const observer = new MutationObserver(() => {
        checkForGenesys();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    checkForGenesys();
}

// Изменение звуков нового чата и сообщения
async function setupGenesysChatSound() {
    const baseURL = 'http://genesys-srv.cc3.ertelecom.ru/sounds/';
    function convertPath(path) {
        const fileName = path.split('/').pop(); // Получаем имя файла
        return `${baseURL}${fileName}|-1|0`; // Формируем новый URL с добавлением |-1|0
    }

    function applySound() {
        browser.storage.sync.get([
            "GENESYS_chatSound_newChatSound",
            "GENESYS_chatSound_newMessageSound",
        ], function (result) {
            const newChatSound = convertPath(result.GENESYS_chatSound_newChatSound);
            const newMessageSound = convertPath(result.GENESYS_chatSound_newMessageSound);

            const soundScript = document.createElement('script');
            soundScript.type = 'text/javascript';
            let code = `
window.genesys.wwe.configuration.set("chat.ringing-bell", "${newChatSound}")
window.genesys.wwe.configuration.set("chat.new-message-bell", "${newMessageSound}")
      `
            soundScript.appendChild(document.createTextNode(code));

            document.body.appendChild(soundScript)

            $.notify("Загружены кастомные звуки чата", "success")
            console.info(`[Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные звуки чата`)
        });
    }

    function checkForGenesys() {
        if (document.querySelector(".wwe-account-state")) {
            observer.disconnect();
            applySound();
        }
    }

    const observer = new MutationObserver(() => {
        checkForGenesys();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });

    checkForGenesys();
}