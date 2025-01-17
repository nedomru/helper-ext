// Function to get the corresponding tab ID for a button
function getTabId(buttonText) {
    const tabMap = {
        'Главная': 'Главная', 'MnA': 'MnA', 'Роутеры': 'Роутеры', 'РМы': 'РМы', 'Инструменты': 'Инструменты'
    };
    return tabMap[buttonText] || buttonText;
}

// Function to show a tab
async function showTab(tabId) {
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
            method: 'GET', headers: {
                'Accept': 'application/json', 'Content-Type': 'application/json'
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
        if (cachedOnly && data) {
            displayMNAData(data);
            return
        }
        let isDataUpdated = false;

        if (data) {
            displayMNAData(data);
            console.info(`[Хелпер] - [Общее] - [Провайдеры] Список провайдеров загружен из кеша`)
        }

        // Fetch fresh data from API in the background
        const providersApiData = await fetchFromAPI("https://helper.chrsnv.ru/api/mna.json");

        // Compare API data with cached data
        if (JSON.stringify(providersApiData) !== JSON.stringify(data)) {
            // If data is different, update cache and display
            await saveToStorage("mnaData", providersApiData);
            console.info(`[Хелпер] - [Общее] - [Провайдеры] Загружены новые провайдеры из API`)
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

    if (data || data.mna && Array.isArray(data.mna)) {
        const rows = data.mna
            .map((provider) => `
      <tr>
        <td class="align-middle"><a href="${provider.link}" target="_blank">${provider.name}</a></td>
        <td class="align-middle">${provider.authorization}</td>
        <td class="align-middle">${provider.connection}</td>
      </tr>
    `)
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
        if (cachedOnly && data) {
            displayRoutersData(data);
            return
        }
        let isDataUpdated = false;

        if (data) {
            // If data exists in cache, display it immediately
            displayRoutersData(data);
            console.info(`[Хелпер] - [Общее] - [Роутеры] Список роутеров загружен из кеша`)
        }

        // Fetch fresh data from API in the background
        const routersApiData = await fetchFromAPI("https://helper.chrsnv.ru/api/routers.json");

        // Compare API data with cached data
        if (JSON.stringify(routersApiData) !== JSON.stringify(data)) {
            // If data is different, update cache and display
            await saveToStorage("routersData", routersApiData);
            console.info(`[Хелпер] - [Общее] - [Роутеры] Загружены новые роутеры из API`)
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

    if (data || data.routers && Array.isArray(data.routers)) {
        const rows = data.routers
            .map((router) => `
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
  `)
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

// Call initTabs and addButtonListeners when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    addButtonListeners();
});
