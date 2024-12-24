async function initGenesysButtons() {
    // Early return if buttons are already initialized
    if (document.querySelector(".helper")) {
        return;
    }

    // Configuration for buttons
    const BUTTON_STYLES = {
        container: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            marginLeft: "15px"
        },
        link: {
            fontSize: "1rem",
            fontFamily: "Roboto, Tahoma, Verdana",
            textAlign: "center",
            color: "white",
            marginRight: "8px",
            cursor: "pointer",
            height: "28px",
            width: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            lineHeight: "auto",
            backgroundColor: "#4c5961",
            border: "none",
            borderRadius: "18px",
            textDecoration: "none"
        }
    };

    const LINKS_CONFIG = [
        {url: "https://flomaster.chrsnv.ru", text: "Фломастер", key: "GENESYS_showFB_flomaster"},
        {url: "http://cm.roool.ru", text: "ЧМ", key: "GENESYS_showFB_chatMaster"},
        {
            url: "https://dom.ru/service/knowledgebase/internet/kak-nastroit-router",
            text: "Роутеры",
            key: "GENESYS_showFB_setupRouter"
        },
        {
            url: "https://dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore",
            text: "ТВ",
            key: "GENESYS_showFB_setupTV"
        },
        {
            url: "https://clever.ertelecom.ru/content/space/4/article/12409",
            text: "ЧТП КТВ",
            key: "GENESYS_showFB_channelsktv"
        },
        {
            url: "https://clever.ertelecom.ru/content/space/4/article/8887",
            text: "ЧТП ЦКТВ",
            key: "GENESYS_showFB_channelscktv"
        },
        {
            url: "https://dom.ru/service/knowledgebase/domru-tv/nastrojka-tv-pristavok",
            text: "Декодеры",
            key: "GENESYS_showFB_setupDecoder"
        },
        {
            url: "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/?C=M;O=D",
            text: "FTP ПК",
            key: "GENESYS_showFB_ftpPC"
        },
        {
            url: "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/?C=M;O=D",
            text: "FTP Моб",
            key: "GENESYS_showFB_ftpAndroid"
        },
        {url: "https://mh-dashboard-erth.proptech.ru/web/", text: "Dashboard", key: "GENESYS_showFB_dashboard"},
        {url: "https://provisioning.ertelecom.ru/devices", text: "Провиж", key: "GENESYS_showFB_provisioning"}
    ];

    try {
        // Remove border-radius !important rule
        for (const styleSheet of document.styleSheets) {
            try {
                const rules = styleSheet.cssRules || styleSheet.rules;
                if (!rules) continue;

                for (const rule of rules) {
                    if (rule.selectorText === ".wwe input, .wwe select, .wwe button, .wwe textarea") {
                        rule.style.setProperty("border-radius", "0px", "");
                        break;
                    }
                }
            } catch (e) {
            }
        }

        // Create buttons container
        const buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("helper-buttons");
        Object.assign(buttonsContainer.style, BUTTON_STYLES.container);

        // Fetch all settings at once
        const settings = await browser.storage.sync.get(LINKS_CONFIG.map(link => link.key));

        // Create and add enabled buttons
        const createButton = (link) => {
            if (!settings[link.key]) return null;

            const button = document.createElement("a");
            button.href = link.url;
            button.target = "_blank";
            button.textContent = link.text;
            button.className = "helper";

            Object.assign(button.style, BUTTON_STYLES.link);

            button.addEventListener("mouseenter", () => button.style.backgroundColor = "#63737d");
            button.addEventListener("mouseleave", () => button.style.backgroundColor = "#4c5961");

            return button;
        };

        const buttons = LINKS_CONFIG.map(createButton).filter(Boolean);
        buttonsContainer.append(...buttons);

        // Add buttons to DOM
        const observer = new MutationObserver((_, observer) => {
            const lineHeader = document.getElementById("break_window");
            if (lineHeader) {
                lineHeader.parentNode.insertBefore(buttonsContainer, lineHeader.nextSibling);
                observer.disconnect();
                console.info("[Хелпер] - [Генезис] - [Быстрые кнопки] Добавлены быстрые кнопки");
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

    } catch (error) {
        console.error("[Хелпер] - [Генезис] - [Быстрые кнопки] Ошибка инициализации:", error);
    }
}
