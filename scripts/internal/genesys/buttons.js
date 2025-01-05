// Быстрые кнопки initGenesysButtons
async function initGenesysButtons() {
    // Early return if already initialized
    if (document.querySelector(".helper-dropdown")) {
        return;
    }

    // Configuration for available links
    const LINKS_CONFIG = [
        {url: "https://flomaster.chrsnv.ru", text: "Фломастер", key: "GENESYS_showFB_flomaster"},
        {url: "http://cm.roool.ru", text: "ЧатМастер", key: "GENESYS_showFB_chatMaster"},
        {url: "https://dom.ru/service/knowledgebase/internet/kak-nastroit-router", text: "Настройка роутеров", key: "GENESYS_showFB_setupRouter"},
        {url: "https://dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore", text: "Настройка ТВ", key: "GENESYS_showFB_setupTV"},
        {url: "https://dom.ru/service/knowledgebase/domru-tv/nastrojka-tv-pristavok", text: "Настройка декодеров", key: "GENESYS_showFB_setupDecoder"},
        {url: "https://clever.ertelecom.ru/content/space/4/article/12409", text: "ЧТП КТВ", key: "GENESYS_showFB_channelsktv"},
        {url: "https://clever.ertelecom.ru/content/space/4/article/8887", text: "ЧТП ЦКТВ", key: "GENESYS_showFB_channelscktv"},
        {url: "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/?C=M;O=D", text: "FTP ПК", key: "GENESYS_showFB_ftpPC"},
        {url: "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/?C=M;O=D", text: "FTP Моб", key: "GENESYS_showFB_ftpAndroid"},
        {url: "https://mh-dashboard-erth.proptech.ru/web/", text: "Dashboard домофонии", key: "GENESYS_showFB_dashboard"},
        {url: "https://provisioning.ertelecom.ru/devices", text: "Provisioning", key: "GENESYS_showFB_provisioning"}
    ];

    try {
        // Create dropdown container
        const dropdownContainer = document.createElement("li");
        dropdownContainer.className = "helper-dropdown";
        dropdownContainer.style.position = "relative";
        dropdownContainer.style.display = "flex";
        dropdownContainer.style.alignItems = "center";
        dropdownContainer.style.height = "100%";

        // Create button group
        const buttonGroup = document.createElement("div");
        buttonGroup.style.height = "100%";
        buttonGroup.style.position = "relative";
        buttonGroup.style.display = "flex";
        buttonGroup.style.alignItems = "center";
        buttonGroup.title = "Быстрые кнопки";

        // Create dropdown button
        const dropdownButton = document.createElement("button");
        Object.assign(dropdownButton.style, {
            height: "130%",
            color: "white",
            backgroundColor: "#4c5961",
            border: "none",
            padding: "0 15px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            fontSize: "15px"
        });

        dropdownButton.addEventListener("mouseover", () => {
            dropdownButton.style.backgroundColor = "#63737d";
        });

        dropdownButton.addEventListener("mouseout", () => {
            dropdownButton.style.backgroundColor = "#4c5961";
        });

        dropdownButton.innerHTML = `
            Быстрые кнопки
            <span style="margin-left: 5px; border-top: 4px solid white; border-right: 4px solid transparent; border-left: 4px solid transparent;"></span>
        `;

        // Create dropdown menu
        const dropdownMenu = document.createElement("ul");
        Object.assign(dropdownMenu.style, {
            display: "none",
            position: "absolute",
            backgroundColor: "#ffffff",
            border: "1px solid #333",
            minWidth: "200px",
            padding: "5px 0",
            margin: "0",
            listStyle: "none",
            zIndex: "1000",
            right: "0",
            top: "100%",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        });

        // Toggle dropdown on click
        dropdownButton.onclick = () => {
            dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
        };

        // Close dropdown when clicking outside
        document.addEventListener("click", (event) => {
            if (!dropdownContainer.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });

        // Get enabled links from storage
        const settings = await browser.storage.sync.get(LINKS_CONFIG.map(link => link.key));

        // Create menu items
        LINKS_CONFIG.forEach(link => {
            if (!settings[link.key]) return;

            const menuItem = document.createElement("li");

            const menuLink = document.createElement("a");
            Object.assign(menuLink.style, {
                color: "black",
                padding: "8px 15px",
                textDecoration: "none",
                display: "block",
            });

            menuLink.href = link.url;
            menuLink.target = "_blank";
            menuLink.textContent = link.text;

            menuLink.addEventListener("mouseover", () => {
                menuLink.style.backgroundColor = "#2e69db";
                menuLink.style.color = "white";
            });

            menuLink.addEventListener("mouseout", () => {
                menuLink.style.backgroundColor = "transparent";
                menuLink.style.color = "black";
            });

            menuItem.appendChild(menuLink);
            dropdownMenu.appendChild(menuItem);
        });

        // Assemble dropdown
        buttonGroup.appendChild(dropdownButton);
        buttonGroup.appendChild(dropdownMenu);
        dropdownContainer.appendChild(buttonGroup);

        // Insert dropdown into DOM with divider
        const observer = new MutationObserver((_, observer) => {
            const navMenu = document.querySelector(".nav.agent-info");
            if (navMenu) {
                const divider = document.createElement("li");
                divider.className = "divider";
                navMenu.insertBefore(dropdownContainer, navMenu.firstChild);
                navMenu.insertBefore(divider, dropdownContainer);
                observer.disconnect();
                console.info("[Хелпер] - [Генезис] - [Быстрые кнопки] Добавлено выпадающее меню");
            }
        });

        observer.observe(document.body, {childList: true, subtree: true});

    } catch (error) {
        console.error("[Хелпер] - [Генезис] - [Быстрые кнопки] Ошибка инициализации:", error);
    }
}

// Кастомные эмодзи чата
async function customEmojis() {
    const emojiCategories = {
        "base": ["🙂", "😁", "😂", "😅", "😆", "❤️", "😉", "😔", "😭", "😳", "😰", "🙈", "😍", "😌", "🙏", "😥", "🤔", "👌", "👍", "🎉", "🎊", "☀️"],
        "faces": ["😀", "🫡", "😄", "🤣", "😊", "😇", "🙂", "🥰", "😘", "😋", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭"],
        "hands": ["🙏","🤝", "👍", "👎", "👊", "✊", "🤛", "🤜", "🫶", "🤞", "✌️", "🤟", "🤘", "👌", "🤌", "🤏", "👈", "👉"],
        "hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗"],
        "flowers": ["🌼", "🌻", "🌹", "🌷", "🌸"],
        "g": ["⚙️", "❄️", "📎", "🤖", "⌛️", "🪄", "🌹", "🌸", "⭐️", "🍆"]
    };

    function createEmojiContainer() {
        const container = document.createElement('div');
        container.className = 'containerSmile containerSmileHidden enhanced';
        container.style.cssText = `
            border-radius: 5px;
            position: absolute;
            left: 2px;
            right: 105px;
            top: 124px;
            max-width: 450px;
            background-color: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            padding: 5px;
            max-height: 200px;
            overflow-y: auto;
        `;
        return container;
    }

    function createEmojiGrid() {
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(28px, 1fr));
            gap: 2px;
            padding: 5px;
        `;
        return grid;
    }

    function createEmojiElement(emoji) {
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'smileItem';
        emojiDiv.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            padding: 4px;
            cursor: pointer;
            border-radius: 3px;
            transition: background-color 0.15s;
        `;
        emojiDiv.textContent = emoji;
        emojiDiv.onmouseover = () => emojiDiv.style.backgroundColor = '#f0f0f0';
        emojiDiv.onmouseout = () => emojiDiv.style.backgroundColor = 'transparent';
        return emojiDiv;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const existingContainer = document.querySelector('.containerSmile:not(.enhanced)');
                if (existingContainer) {
                    const parent = existingContainer.parentElement;
                    existingContainer.remove();

                    const container = createEmojiContainer();

                    Object.entries(emojiCategories).forEach(([category, emojis]) => {
                        const grid = createEmojiGrid();
                        emojis.forEach(emoji => {
                            grid.appendChild(createEmojiElement(emoji));
                        });
                        container.appendChild(grid);
                    });

                    parent.appendChild(container);
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Скрытие заголовков чата
async function hideChatHeader() {
    new MutationObserver(mutations => {
        const headerDiv = document.querySelector('.wwe-case-information-header');
        if (!headerDiv) return;

        if (!headerDiv.classList.contains("hided-by-helper")) {
            headerDiv.click();
            headerDiv.setAttribute('aria-expanded', 'false');
            headerDiv.classList.add("hided-by-helper");
        }
    }).observe(document.body, {childList: true, subtree: true});
}