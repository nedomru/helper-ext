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
            fetchMNA()
        } else if (tabId === "Роутеры") {
            fetchRouters()
        } else if (tabId === "РМы") {
            fetchPhrases()
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
    browser.storage.sync.set({lastTab: tabId})
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

async function fetchFromAPI(api_url) {
    const response = await fetch(api_url);
    return await response.json();
}

async function getFromStorage(key) {
    return new Promise((resolve) => {
        browser.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

async function getMultipleFromStorage(keys) {
    return new Promise((resolve) => {
        browser.storage.local.get(keys, resolve);
    });
}

async function saveToStorage(key, data) {
    return new Promise((resolve) => {
        browser.storage.local.set({[key]: data}, resolve);
    });
}

async function fetchMNA() {
    if (document.getElementById("providersTableContent")) return;

    const providersTableElement = document.getElementById("providersTable");
    providersTableElement.style.display = 'none';

    try {
        // Try to get data from cache first
        let data = await getFromStorage("mnaData");
        let isDataUpdated = false;

        if (data) {
            displayMNAData(data);
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - [Провайдеры] Список провайдеров загружен из кеша`
            )
        }

        // Fetch fresh data from API in the background
        const providersApiData = await fetchFromAPI("https://helper.chrsnv.ru/api/mna.json");

        // Compare API data with cached data
        if (JSON.stringify(providersApiData) !== JSON.stringify(data)) {
            // If data is different, update cache and display
            await saveToStorage("mnaData", providersApiData);
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - [Провайдеры] Загружены новые провайдеры из API`
            )
            data = providersApiData;
            isDataUpdated = true;
        }

        // If data wasn't in cache initially or has been updated, display it
        if (!data || isDataUpdated) {
            displayMNAData(data);
        }

    } catch (error) {
        console.error("Error fetching MNA data:", error);
    }
}

function displayMNAData(data) {
    const providersTableElement = document.getElementById("providersTable");

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

        providersTableElement.innerHTML = DOMPurify.sanitize(tableHTML);

        providersTableElement.style.display = 'block';
        providersTableElement.style.opacity = '0';
        providersTableElement.style.transition = 'opacity 0.5s ease-in-out';

        // Trigger reflow to ensure the transition works
        providersTableElement.offsetHeight;

        providersTableElement.style.opacity = '1';
    } else {
        console.error('Key "mna" not found or is not an array:', data);
    }
}

async function fetchRouters() {
    if (document.getElementById("routersTableContent")) return;

    const routersTableElement = document.getElementById("routersTable");
    routersTableElement.style.display = 'none';

    try {
        // Try to get data from cache first
        let data = await getFromStorage("routersData");
        let isDataUpdated = false;

        if (data) {
            // If data exists in cache, display it immediately
            displayRoutersData(data);
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - [Роутеры] Список роутеров загружен из кеша`
            )
        }

        // Fetch fresh data from API in the background
        const routersApiData = await fetchFromAPI("https://helper.chrsnv.ru/api/routers.json");

        // Compare API data with cached data
        if (JSON.stringify(routersApiData) !== JSON.stringify(data)) {
            // If data is different, update cache and display
            await saveToStorage("routersData", routersApiData);
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - [Роутеры] Загружены новые роутеры из API`
            )
            data = routersApiData;
            isDataUpdated = true;
        }

        // If data wasn't in cache initially or has been updated, display it
        if (!data || isDataUpdated) {
            displayRoutersData(data);
        }

    } catch (error) {
        console.error("Error fetching routers data:", error);
    }
}

// Функция для отображения данных роутеров
function displayRoutersData(data) {
    const routersTableElement = document.getElementById("routersTable");

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

        routersTableElement.innerHTML = DOMPurify.sanitize(tableHTML);
        routersTableElement.style.display = 'block';
        routersTableElement.style.opacity = '0';
        routersTableElement.style.transition = 'opacity 0.5s ease-in-out';

        // Trigger reflow to ensure the transition works
        routersTableElement.offsetHeight;

        routersTableElement.style.opacity = '1';
    } else {
        console.error('Key "routers" not found or is not an array:', data);
    }
}

async function fetchPhrases() {
    if (document.getElementById("phrasesDirectoryContent")) return;

    const loadingSpinner = document.getElementById('loadingSpinner');
    const phrasesContainer = document.getElementById('phrasesContainer');

    loadingSpinner.style.display = 'block';
    phrasesContainer.style.display = 'none';

    try {
        // Try to get data from storage first
        let data = await getFromStorage("phrasesData");
        let isDataUpdated = false;

        if (data) {
            // If data exists in storage, display it immediately
            displayPhrasesData(data);
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - [РМы] Список РМов загружен из кеша`
            )
        }

        // Fetch fresh data from API in the background
        const phrasesApiData = await fetchFromAPI(api_url = "https://flomaster.chrsnv.ru/api/phrases/");

        // Compare API data with storage data
        if (JSON.stringify(phrasesApiData) !== JSON.stringify(data)) {
            // If data is different, update storage and display
            await saveToStorage("phrasesData", phrasesApiData);
            console.log(
                `[${new Date().toLocaleTimeString()}] [Хелпер] - [Общее] - [РМы] Загружены новые РМы из API`
            )
            data = phrasesApiData;
            isDataUpdated = true;
        }

        // If data wasn't in storage initially or has been updated, display it
        if (!data || isDataUpdated) {
            displayPhrasesData(data);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Функция для отображения данных РМов
function displayPhrasesData(data) {
    const phrasesContainer = document.getElementById('phrasesContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');

    const directoryHTML = createDirectoryHTML(data);

    phrasesContainer.innerHTML = DOMPurify.sanitize(directoryHTML);

    loadingSpinner.style.display = 'none';
    phrasesContainer.style.display = 'block';
    phrasesContainer.style.opacity = '0';
    phrasesContainer.style.transition = 'opacity 0.5s ease-in-out';
    phrasesContainer.offsetHeight;
    phrasesContainer.style.opacity = '1';

    addEventListeners();
    addStyles();
}

function createDirectoryHTML(data) {
    const phraseMap = {
        android: "Android", ios: "iOS", smartdom: "SmartDom", lk: "ЛК", web: "Веб",
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
            const defaultPhrase = phraseData.default?.value || phraseData.android?.value || phraseData.ios?.value || phraseData.smartdom?.value || phraseData.lk?.value || phraseData.handling?.value || phraseData.android_web?.value || phraseData.pppoe?.value || phraseData.dhcp?.value || phraseData.value || 'Стандартная фраза недоступна';
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
                smartDom: "SmartDom",
                lk: "ЛК",
                web: "Веб",
                android_web: "Андроид/Веб",
                pppoe: "PPPoE",
                dhcp: "DHCP",
                handling: "Отработка"
            };

            const phraseType = phraseMap[key] || "РМ";
            if (value && typeof value === 'object' && content === '') {
                content += `<div><strong>${phraseType}:</strong> ${value.value}</div>`;
            } else if (value && typeof value === 'string' && content === '') {
                content += `<div><strong>${phraseType}:</strong> ${value}</div>`;
            }
        }
    }
    miniWindow.innerHTML = content || '<strong>РМ:</strong> Предпросмотр недоступен';
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