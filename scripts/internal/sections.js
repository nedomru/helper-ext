// Function to get the corresponding tab ID for a button
function getTabId(buttonText) {
    const tabMap = {
        'Главная': 'Главная',
        'MnA': 'MnA',
        'Роутеры': 'Роутеры',
        'РМы': 'РМы',
        'Инструменты': 'Инструменты'
    };
    return tabMap[buttonText] || buttonText;
}

// Function to show a tab
function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tabcontent').forEach(tab => {
        tab.style.display = 'none';
    });

    // Show the selected tab content
    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        if (tabId === "MnA") {
            fetchMNA().then(() =>
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] Загружен список провайдеров`
                )
            );
        } else if (tabId === "Роутеры") {
            fetchRouters().then(() =>
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] Загружен список провайдеров`
                )
            );
        } else if (tabId === "РМы") {
            fetchPhrases().then(() =>
                console.log(
                    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] Загружен список РМов`
                )
            );
        }
    } else {
        console.warn(`Tab content for "${tabId}" not found.`);
    }

    // Update button states
    document.querySelectorAll('.btn-group button').forEach(button => {
        button.classList.remove('active');
        if (getTabId(button.textContent) === tabId) {
            button.classList.add('active');
        }
    });

    // Save the last opened tab
    if (tabId === "Настройки") return;
    browser.storage.sync.set({lastTab: tabId}).then(() => {
        console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - Сохранена последняя вкладка: ${tabId}`)
    }).catch(error => {
        console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - Ошибка сохранения последней вкладки: ${error}`)
    });
}

// Function to add click event listeners to buttons
function addButtonListeners() {
    document.querySelectorAll('.btn-group button').forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = getTabId(button.textContent);
            showTab(tabId);
            event.preventDefault();
        });
    });
}

// Function to initialize tabs
function initTabs() {
    browser.storage.sync.get('lastTab').then(result => {
        const lastTab = result.lastTab || 'Главная';
        showTab(lastTab);
    }).catch(error => {
        console.error('Error retrieving last tab:', error);
        showTab('Главная');
    });
}

function searchTable(inputId, tableId) {
    const input = document.getElementById(inputId);
    const filter = input.value.toUpperCase();
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName("td");
        let rowMatchesSearch = false;

        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            if (cell) {
                const txtValue = cell.textContent || cell.innerText;
                if (txtValue.toUpperCase().includes(filter)) {
                    rowMatchesSearch = true;
                }
            }
        }

        row.style.display = rowMatchesSearch ? "" : "none";
    }
}

function createLinkOrText(value, text, isEmulator = false) {
    if (value === "Нет") {
        return "Нет";
    }
    if (isEmulator && Array.isArray(value)) {
        return value
            .map((link) => `<a href="${link}" target="_blank">${text}</a>`)
            .join(", ");
    }
    return `<a href="${value}" target="_blank">${text}</a>`;
}

async function fetchMNA() {
    try {
        if (document.getElementById("providersTableContent")) return;
        document.getElementById('providersTable').style.display = 'none';

        const response = await fetch("https://helper.chrsnv.ru/api/mna.json");
        const data = await response.json();

        if (data.mna && Array.isArray(data.mna)) {
            const rows = data.mna
                .map(
                    (provider) => `
          <tr>
            <td class="align-middle"><a href="${provider.link}" target="_blank">${provider.name}</a></td>
            <td class="align-middle">${provider.authorization}</td>
            <td class="align-middle">${provider.connection}</td>
          </tr>
        `
                )
                .join("");

            const tableHTML = `
        <table class="table table-hover table-bordered table-responsive table-sm" id="providersTableContent">
          <thead>
            <tr>
              <th scope="col">Провайдер</th>
              <th scope="col">Авторизация</th>
              <th scope="col">Подключение</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            ${rows}
          </tbody>
        </table>
      `;

            const providersTableElement = document.getElementById("providersTable");
            providersTableElement.innerHTML = DOMPurify.sanitize(tableHTML);

            providersTableElement.style.display = 'block';
            providersTableElement.style.opacity = '0';
            providersTableElement.style.transition = 'opacity 0.5s ease-in-out';

            // Trigger reflow to ensure the transition works
            providersTableElement.offsetHeight;

            providersTableElement.style.opacity = '1';
        } else {
            console.error('Ключ "mna" не найден или не является массивом:', data);
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    }
}

async function fetchRouters() {
    try {
        if (document.getElementById("routersTableContent")) return;
        document.getElementById('routersTable').style.display = 'none';

        const response = await fetch("https://helper.chrsnv.ru/api/routers.json");
        const data = await response.json();

        if (data.routers && Array.isArray(data.routers)) {
            const rows = data.routers
                .map(
                    (router) => `
        <tr>
          <td class="align-middle">${router.Name}</td>
          <td class="align-middle">${createLinkOrText(router.PPPoE, "PPPoE")}</td>
          <td class="align-middle">${createLinkOrText(router.DHCP, "DHCP")}</td>
          <td class="align-middle">${createLinkOrText(router.IPoE, "IPoE")}</td>
          <td class="align-middle">${createLinkOrText(router.Channels, "Каналы")}</td>
          <td class="align-middle">${router.Settings}</td>
          <td class="align-middle">${createLinkOrText(router.BZ, "БЗ")}</td>
          <td class="align-middle">${createLinkOrText(router.Emulator, "Эмулятор", true)}</td>
        </tr>
      `
                )
                .join("");

            const tableHTML = `
        <table class="table table-hover table-bordered table-responsive table-sm" id="routersTableContent">
            <thead>
                <tr>
                    <th scope="col">Название</th>
                    <th scope="col">PPPoE</th>
                    <th scope="col">DHCP</th>
                    <th scope="col">IPoE</th>
                    <th scope="col">Каналы</th>
                    <th scope="col">Интерфейс</th>
                    <th scope="col">БЗ</th>
                    <th scope="col">Эмулятор</th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
                ${rows}
            </tbody>
        </table>
      `;

            const routersTableElement = document.getElementById("routersTable");
            routersTableElement.innerHTML = DOMPurify.sanitize(tableHTML);
            routersTableElement.style.display = 'block';
            routersTableElement.style.opacity = '0';
            routersTableElement.style.transition = 'opacity 0.5s ease-in-out';

            // Trigger reflow to ensure the transition works
            routersTableElement.offsetHeight;

            routersTableElement.style.opacity = '1';
        } else {
            console.error('Ключ "routers" не найден или не является массивом:', data);
        }
    } catch (error) {
        console.error("Ошибка при получении данных:", error);
    }
}

async function fetchPhrases() {
    if (document.getElementById("phrasesDirectoryContent")) return;

    const loadingSpinner = document.getElementById('loadingSpinner');
    const phrasesContainer = document.getElementById('phrasesContainer');

    loadingSpinner.style.display = 'block';
    phrasesContainer.style.display = 'none';

    try {
        const response = await fetch("https://flomaster.chrsnv.ru/api/phrases/");
        const data = await response.json();

        const directoryHTML = createDirectoryHTML(data);

        phrasesContainer.innerHTML = DOMPurify.sanitize(directoryHTML);

        loadingSpinner.style.display = 'none';
        phrasesContainer.style.display = 'block';
        phrasesContainer.style.opacity = '0';
        phrasesContainer.style.transition = 'opacity 0.5s ease-in-out';

        // Force reflow
        phrasesContainer.offsetHeight;

        phrasesContainer.style.opacity = '1';

        addEventListeners();
        addStyles();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function createDirectoryHTML(data) {
    const phraseMap = {
        android: "Android", ios: "iOS", lk: "ЛК", web: "Веб",
        android_web: "Андроид/Веб", pppoe: "PPPoE", dhcp: "DHCP", handling: "Отработка"
    };

    return `<ul class="directory" id="phrasesDirectoryContent">${
        Object.entries(data).map(([category, categoryData]) => `
            <li class="directory-item open">
                <span class="directory-folder category-folder" data-folder-type="category">
                    <span class="folder-icon">📂</span>${category}<span class="arrow-icon">⬎</span>
                </span>
                <ul class="directory-content">${
            Object.entries(categoryData.subcategories).map(([subcategory, subcategoryData]) => `
                        <li class="directory-item">
                            <span class="directory-folder subcategory-folder" data-folder-type="subcategory">
                                <span class="folder-icon">📁</span>${subcategory}
                            </span>
                            <ul class="directory-content">${
                Object.entries(subcategoryData.phrases).map(([phrase, phraseData]) => {
                    const phraseKeys = Object.keys(phraseData).filter(key => key !== 'default' && phraseData[key]);
                    return phraseKeys.length > 0 ? `
                                        <li class="directory-item">
                                            <span class="directory-folder phrase-folder" data-folder-type="phrase" data-phrase='${JSON.stringify(phraseData)}'>
                                                <span class="folder-icon">📁</span>${phrase}
                                            </span>
                                            <ul class="directory-content">${
                        phraseKeys.map(key => `
                                                    <li class="directory-item">
                                                        <span class="directory-file phrase" data-phrase='${JSON.stringify(phraseData[key])}'>
                                                            <span class="file-icon">📄</span>${phraseMap[key] || key}
                                                        </span>
                                                    </li>
                                                `).join('')
                    }</ul>
                                        </li>
                                    ` : `
                                        <li class="directory-item">
                                            <span class="directory-file phrase" data-phrase='${JSON.stringify(phraseData)}'>
                                                <span class="file-icon">📄</span>${phrase}
                                            </span>
                                        </li>
                                    `;
                }).join('')
            }</ul>
                        </li>
                    `).join('')
        }</ul>
            </li>
        `).join('')
    }</ul>`;
}

function addEventListeners() {
    document.querySelectorAll('.directory-folder').forEach(folder => {
        folder.addEventListener('click', function() {
            this.parentElement.classList.toggle('open');
            updateFolderIcon(this);
        });
    });

    document.querySelectorAll('.phrase').forEach(phraseElement => {
        phraseElement.addEventListener('click', function(event) {
            event.preventDefault();
            const phraseData = JSON.parse(this.getAttribute('data-phrase'));
            const defaultPhrase = phraseData.default?.value || phraseData.value || 'Стандартная фраза недоступна';
            navigator.clipboard.writeText(defaultPhrase)
                .then(() => $.notify("Скопировано", "success"))
                .catch(err => console.error('Не удалось скопировать: ', err));
        });

        phraseElement.addEventListener('mouseover', event => {
            const phraseData = JSON.parse(event.currentTarget.getAttribute('data-phrase'));
            showMiniWindow(event, phraseData);
        });

        phraseElement.addEventListener('mouseout', hideMiniWindow);
    });
}

function updateFolderIcon(folderElement) {
    const folderIcon = folderElement.querySelector('.folder-icon');
    let arrowIcon = folderElement.querySelector('.arrow-icon');
    const isOpen = folderElement.parentElement.classList.contains('open');

    folderIcon.textContent = isOpen ? '📂' : '📁';

    if (isOpen) {
        if (!arrowIcon) {
            arrowIcon = document.createElement('span');
            arrowIcon.className = 'arrow-icon';
            folderElement.appendChild(arrowIcon);
        }
        arrowIcon.textContent = '⬎';
    } else if (arrowIcon) {
        folderElement.removeChild(arrowIcon);
    }
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .directory { list-style-type: none; padding-left: 20px; }
        .directory-item { margin: 5px 0; }
        .directory-folder, .directory-file { cursor: pointer; user-select: none; padding: 5px; border-radius: 5px; display: inline-block; }
        .directory-content { display: none; }
        .directory-item.open > .directory-content { display: block; }
        .category-folder { background-color: #f7f7f7; border: 1px solid #9da4ab; }
        .subcategory-folder { background-color: #e6ffe6; border: 1px solid #b3ffb3; }
        .phrase-folder { background-color: #fff0e6; border: 1px solid #ffd1b3; }
        .phrase { background-color: #f9f9f9; border: 1px solid #e6e6e6; }
        .directory-folder:hover, .directory-file:hover { filter: brightness(0.9); }
        #miniWindow { position: absolute; background-color: white; border: 1px solid #ccc; padding: 10px; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); display: none; z-index: 1000; max-width: 300px; }
        .folder-icon, .file-icon { margin-right: 5px; }
        .arrow-icon { margin-left: 5px; }
    `;
    document.head.appendChild(style);
}

function showMiniWindow(event, phraseData) {
    const miniWindow = document.getElementById('miniWindow') || createMiniWindow();
    let content = '';
    if (typeof phraseData === 'string') {
        content = `<div>${phraseData}</div>`;
    } else {
        for (const [key, value] of Object.entries(phraseData)) {
            const phraseMap = {
                android: "Android",
                ios: "iOS",
                lk: "ЛК",
                web: "Веб",
                android_web: "Андроид/Веб",
                pppoe: "PPPoE",
                dhcp: "DHCP",
                handling: "Отработка"
            };

            const phraseType = phraseMap[key] || "РМ"; // Default to null if key not found

            if (value && typeof value === 'object' && value.value) {
                content += `<div><strong>${phraseType}:</strong> ${value.value}</div>`;
            }
        }
    }
    miniWindow.innerHTML = content || '<strong>РМ:</strong> Стандартная фраза недоступна';
    miniWindow.style.display = 'block';
    miniWindow.style.left = `${event.pageX + 10}px`;
    miniWindow.style.top = `${event.pageY + 10}px`;
}

function hideMiniWindow() {
    const miniWindow = document.getElementById('miniWindow');
    if (miniWindow) {
        miniWindow.style.display = 'none';
    }
}

function createMiniWindow() {
    const miniWindow = document.createElement('div');
    miniWindow.id = 'miniWindow';
    document.body.appendChild(miniWindow);
    return miniWindow;
}

// Call initTabs and addButtonListeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    addButtonListeners();
});