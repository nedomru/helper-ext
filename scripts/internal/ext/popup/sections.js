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
        browser.storage.sync.set({lastTab: tabId});
    } else {
        console.warn(`Tab content for "${tabId}" not found.`);
    }

    document.querySelectorAll('.helper-tab-btn').forEach(button => {
        button.classList.remove('active');
        if (getTabId(button.textContent) === tabId) {
            button.classList.add('active');
        }
    });
}

// Function to add click event listeners to buttons
function addButtonListeners() {
    document.querySelectorAll('.helper-tab-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = getTabId(button.textContent);
            showTab(tabId);
            event.preventDefault();
        });
    });
}

// Function to initialize tabs
async function initTabs() {
    await browser.storage.sync.get('lastTab').then(result => {
        const lastTab = result.lastTab || 'Главная';
        showTab(lastTab);
    }).catch(error => {
        console.error('Error retrieving last tab:', error);
        showTab('Главная');
    });
    await fetchMNA(true)
    await fetchRouters(true)
    await fetchPhrases(true)
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
    try {
        const response = await fetch(api_url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching from ${api_url}:`, error);
        throw error;
    }
}

async function getFromStorage(key) {
    return new Promise((resolve) => {
        browser.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

async function saveToStorage(key, data) {
    return new Promise((resolve) => {
        browser.storage.local.set({[key]: data}, resolve);
    });
}

async function fetchMNA(cachedOnly = false) {
    if (document.getElementById("providersTableContent")) return;

    const providersTableElement = document.getElementById("providersTable");
    providersTableElement.style.display = 'none';

    try {
        // Try to get data from cache first
        let data = await getFromStorage("mnaData");
        if (cachedOnly) {
            displayMNAData(data);
            return
        }
        let isDataUpdated = false;

        if (data) {
            displayMNAData(data);
            console.info(
                `[Хелпер] - [Общее] - [Провайдеры] Список провайдеров загружен из кеша`
            )
        }

        // Fetch fresh data from API in the background
        const providersApiData = await fetchFromAPI("https://helper.chrsnv.ru/api/mna.json");

        // Compare API data with cached data
        if (JSON.stringify(providersApiData) !== JSON.stringify(data)) {
            // If data is different, update cache and display
            await saveToStorage("mnaData", providersApiData);
            console.info(
                `[Хелпер] - [Общее] - [Провайдеры] Загружены новые провайдеры из API`
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

async function fetchRouters(cachedOnly = false) {
    if (document.getElementById("routersTableContent")) return;

    const routersTableElement = document.getElementById("routersTable");
    routersTableElement.style.display = 'none';

    try {
        let data = await getFromStorage("routersData");
        if (cachedOnly) {
            displayRoutersData(data);
            return
        }
        let isDataUpdated = false;

        if (data) {
            // If data exists in cache, display it immediately
            displayRoutersData(data);
            console.info(
                `[Хелпер] - [Общее] - [Роутеры] Список роутеров загружен из кеша`
            )
        }

        // Fetch fresh data from API in the background
        const routersApiData = await fetchFromAPI("https://helper.chrsnv.ru/api/routers.json");

        // Compare API data with cached data
        if (JSON.stringify(routersApiData) !== JSON.stringify(data)) {
            // If data is different, update cache and display
            await saveToStorage("routersData", routersApiData);
            console.info(
                `[Хелпер] - [Общее] - [Роутеры] Загружены новые роутеры из API`
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

async function fetchPhrases(cachedOnly = false) {
    if (document.getElementById("phrasesDirectoryContent")) return;

    const loadingSpinner = document.getElementById('loadingSpinner');
    const phrasesContainer = document.getElementById('phrasesContainer');

    loadingSpinner.style.display = 'block';
    phrasesContainer.style.display = 'none';

    try {
        let data = await getFromStorage("phrasesData");

        if (data && !Array.isArray(data.phrases?.hits)) {
            console.warn("Invalid cached data format, clearing cache");
            data = null;
            await browser.storage.local.remove("phrasesData");
        }

        if (cachedOnly && data) {
            displayPhrasesData(data.phrases.hits);
            return;
        }

        let isDataUpdated = false;

        if (data) {
            displayPhrasesData(data.phrases.hits);
            console.info(`[Хелпер] - [Общее] - [РМы] Список РМов загружен из кеша`);
        }

        if (!cachedOnly) {
            try {
                const phrasesApiData = await fetchFromAPI("https://helper.chrsnv.ru/api/phrases.json");

                if (!Array.isArray(phrasesApiData.phrases?.hits)) {
                    throw new Error("API response is not in the expected format");
                }

                if (JSON.stringify(phrasesApiData) !== JSON.stringify(data)) {
                    await saveToStorage("phrasesData", phrasesApiData);
                    console.info(`[Хелпер] - [Общее] - [РМы] Загружены новые РМы из API`);
                    data = phrasesApiData;
                    isDataUpdated = true;
                }

                if (!data || isDataUpdated) {
                    displayPhrasesData(data.phrases.hits);
                }
            } catch (apiError) {
                console.error("API fetch error:", apiError);
                if (!data) {
                    throw apiError;
                }
            }
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        phrasesContainer.innerHTML = DOMPurify.sanitize(`
            <div class="error-message">
                <p>Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.</p>
                <p>Техническая информация: ${error.message}</p>
            </div>
        `);
        loadingSpinner.style.display = 'none';
        phrasesContainer.style.display = 'block';
    }
}

function displayPhrasesData(data) {
    if (!Array.isArray(data)) {
        console.error("Invalid data format provided to displayPhrasesData");
        return;
    }

    const phrasesContainer = document.getElementById('phrasesContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');

    try {
        const directoryHTML = createDirectoryHTML(data);

        phrasesContainer.innerHTML = DOMPurify.sanitize(directoryHTML);

        loadingSpinner.style.display = 'none';
        phrasesContainer.style.display = 'block';
        phrasesContainer.style.opacity = '0';
        phrasesContainer.style.transition = 'opacity 0.5s ease-in-out';
        phrasesContainer.offsetHeight; // Force reflow
        phrasesContainer.style.opacity = '1';

        addEventListeners();
        addStyles();
        setupSearch();
    } catch (error) {
        console.error("Error displaying phrases data:", error);
        phrasesContainer.innerHTML = DOMPurify.sanitize(`
            <div class="error-message">
                <p>Произошла ошибка при отображении данных.</p>
                <p>Техническая информация: ${error.message}</p>
            </div>
        `);
        loadingSpinner.style.display = 'none';
        phrasesContainer.style.display = 'block';
    }
}

function createDirectoryHTML(data) {
    function buildHierarchyTree(data) {
        // First, filter out _top entries and create a unique items map
        const uniqueItemsMap = new Map();

        const filteredData = data.filter(item => {
            // Skip items with _top anchor
            if (item.anchor === '_top') return false;

            // Find the highest non-null level
            const maxLevel = Object.keys(item.hierarchy)
                .reduce((max, key) => {
                    const level = parseInt(key.replace('lvl', ''));
                    return item.hierarchy[key] ? Math.max(max, level) : max;
                }, -1);

            if (maxLevel === -1) return false;

            // Create a unique key using URL and the content of the highest non-null level
            const key = `${item.url_without_anchor}-${item.hierarchy[`lvl${maxLevel}`]}`;

            if (uniqueItemsMap.has(key)) return false;

            uniqueItemsMap.set(key, item);
            return true;
        });

        const tree = new Map();

        filteredData.forEach(item => {
            let currentLevel = tree;

            // Find the highest non-null level
            const maxLevel = Object.keys(item.hierarchy)
                .reduce((max, key) => {
                    const level = parseInt(key.replace('lvl', ''));
                    return item.hierarchy[key] ? Math.max(max, level) : max;
                }, -1);

            // Get all levels up to the highest non-null level
            const levels = [];
            for (let i = 0; i <= maxLevel; i++) {
                if (i === maxLevel || item.hierarchy[`lvl${i}`]) {
                    levels.push({
                        name: item.hierarchy[`lvl${i}`],
                        level: i,
                        isFinal: i === maxLevel
                    });
                }
            }

            // Build the tree structure
            levels.forEach((level, index) => {
                if (!level.name) return;

                if (!currentLevel.has(level.name)) {
                    currentLevel.set(level.name, {
                        content: new Map(),
                        items: [],
                        level: level.level
                    });
                }

                if (level.isFinal) {
                    // This is the final level, add it as an item
                    currentLevel.get(level.name).items.push({
                        url: item.url,
                        title: level.name,
                        type: item.type
                    });
                } else {
                    // Move to next level in hierarchy
                    currentLevel = currentLevel.get(level.name).content;
                }
            });
        });

        return tree;
    }

    function renderTree(tree, level = 0) {
        let html = '<ul class="directory-list">';

        tree.forEach((value, key) => {
                const hasSubfolders = value.content.size > 0;
                const hasItems = value.items.length > 0;

                // If it's a leaf node, render it directly as a file
                if (value.isLeaf) {
                    html += `
                <li class="directory-item">
                    <a href="${value.items[0].url}" target="_blank" class="directory-file">
                        <span class="file-icon">📄</span>
                        <span class="file-name">${key}</span>
                    </a>
                </li>`;
                } else {
                    html += `
                <li class="directory-item">
                    <div class="directory-folder" data-folder-type="level-${value.level}">
                        <span class="folder-icon">📂</span>
                        <span class="folder-name">${key}</span>
                        <span class="arrow-icon">▸</span>
                    </div>
                    <div class="directory-content">`;

                    if (hasSubfolders) {
                        html += renderTree(value.content, level + 1);
                    }

                    if (hasItems) {
                        html += value.items.map(item => `
                        <div class="directory-item">
                            <a href="${item.url}" target="_blank" class="directory-file">
                                <span class="file-icon">📄</span>
                                <span class="file-name">${item.title}</span>
                            </a>
                        </div>
                    `).join('');
                    }

                    html += `
                    </div>
                </li>`;
                }
            }
        )


        html += '</ul>';
        return html;
    }

    const tree = buildHierarchyTree(data);
    return `
        <div class="directory" id="phrasesDirectoryContent">
            ${renderTree(tree)}
        </div>
    `;
}

function setupSearch() {
    const searchInput = document.getElementById('searchPhrase');
    const debounceTimeout = 300;
    let timeoutId = null;

    searchInput.addEventListener('input', (e) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.directory-item');

            items.forEach(item => {
                const folderName = item.querySelector('.folder-name')?.textContent.toLowerCase() || '';
                const fileName = item.querySelector('.file-name')?.textContent.toLowerCase() || '';
                const isMatch = folderName.includes(searchTerm) || fileName.includes(searchTerm);

                if (isMatch) {
                    // Show this item and all its parents
                    item.style.display = '';
                    let parent = item.parentElement.closest('.directory-item');
                    while (parent) {
                        parent.style.display = '';
                        parent.classList.add('open');
                        parent = parent.parentElement.closest('.directory-item');
                    }
                } else {
                    // Only hide if none of the children match
                    const hasMatchingChild = Array.from(item.querySelectorAll('.directory-item'))
                        .some(child => child.style.display !== 'none');
                    item.style.display = hasMatchingChild ? '' : 'none';
                }
            });
        }, debounceTimeout);
    });
}

function addEventListeners() {
    document.querySelectorAll('.directory-folder').forEach(folder => {
        folder.addEventListener('click', () => {
            const item = folder.closest('.directory-item');
            item.classList.toggle('open');
            const arrowIcon = folder.querySelector('.arrow-icon');
            arrowIcon.textContent = item.classList.contains('open') ? '▾' : '▸';
        });
    });

    // Add hover effect for files to show full title
    document.querySelectorAll('.directory-file').forEach(file => {
        const fileName = file.querySelector('.file-name');
        if (fileName) {
            fileName.title = fileName.textContent;
        }
    });
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .directory {
            font-family: Arial, sans-serif;
            padding: 10px;
        }
        
        .directory-list {
            list-style: none;
            padding-left: 20px;
            margin: 0;
        }
        
        .directory-item {
            margin: 5px 0;
        }
        
        .directory-folder {
            cursor: pointer;
            padding: 8px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s;
        }
        
        .directory-folder:hover {
            background: #e0e0e0;
        }
        
        .directory-content {
            display: none;
            margin-left: 20px;
        }
        
        .directory-item.open > .directory-content {
            display: block;
        }
        
        .directory-file {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            text-decoration: none;
            color: inherit;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .directory-file:hover {
            background: #f0f0f0;
        }
        
        .folder-icon, .file-icon {
            font-size: 1.2em;
        }
        
        .arrow-icon {
            margin-left: auto;
            font-size: 0.8em;
        }
        
        [data-folder-type="level-0"] {
            background: #e3f2fd;
        }
        
        [data-folder-type="level-1"] {
            background: #e8f5e9;
        }
        
        [data-folder-type="level-2"] {
            background: #fff3e0;
        }
        
        [data-folder-type="level-3"] {
            background: #f3e5f5;
        }
        
        [data-folder-type="level-4"] {
            background: #e0f7fa;
        }
        
        .file-name {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 500px;
        }
        
        .error-message {
            padding: 20px;
            background: #fff3f3;
            border: 1px solid #ffcdd2;
            border-radius: 4px;
            margin: 10px 0;
        }
        
        /* Animation for folder opening/closing */
        .directory-content {
            transition: all 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}

// Call initTabs and addButtonListeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    addButtonListeners();
});