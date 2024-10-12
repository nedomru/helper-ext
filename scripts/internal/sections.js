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
    } else if(tabId === "РМы") {
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
  browser.storage.sync.set({ lastTab: tabId }).then(() => {
    console.log(`Saved last tab: ${tabId}`);
  }).catch(error => {
    console.error('Error saving last tab:', error);
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
    const response = await fetch("https://helper.chrsnv.ru/api/mna.json");
    const data = await response.json();

    // Проверяем, содержит ли объект ключ 'mna'
    if (data.mna && Array.isArray(data.mna)) {
      // Создаём содержимое таблицы
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

      // Формируем полную таблицу
      const tableHTML = `
        <table class="table table-hover table-bordered table-responsive table-sm">
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

      document.getElementById("providersTable").innerHTML =
          DOMPurify.sanitize(tableHTML);
    } else {
      console.error('Ключ "mna" не найден или не является массивом:', data);
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

async function fetchRouters() {
  try {
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
        <table class="table table-hover table-bordered table-responsive table-sm">
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

      document.getElementById("routersTable").innerHTML =
          DOMPurify.sanitize(tableHTML);
    } else {
      console.error('Ключ "routers" не найден или не является массивом:', data);
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

async function fetchPhrases() {
  try {
    const response = await fetch("https://flomaster.chrsnv.ru/api/phrases/");
    const data = await response.json();

    let treeHTML = '<ul class="tree">';

    // Create tree structure
    Object.entries(data).forEach(([category, categoryData]) => {
      treeHTML += `
        <li>
          <span class="folder category-folder">${category}</span>
          <ul class="nested">
      `;

      Object.entries(categoryData.subcategories).forEach(([subcategory, subcategoryData]) => {
        treeHTML += `
          <li>
            <span class="folder subcategory-folder">${subcategory}</span>
            <ul class="nested">
        `;

        Object.entries(subcategoryData.phrases).forEach(([phrase, phraseData]) => {
          const phraseKeys = Object.keys(phraseData).filter(key => key !== 'default' && phraseData[key]);
          if (phraseKeys.length > 0) {
            treeHTML += `
              <li>
                <span class="folder phrase-folder" data-phrase='${JSON.stringify(phraseData)}'>${phrase}</span>
                <ul class="nested">
            `;
            phraseKeys.forEach(key => {
              treeHTML += `
                <li>
                  <span class="phrase" data-phrase='${JSON.stringify(phraseData[key])}'>${key}</span>
                </li>
              `;
            });
            treeHTML += `
                </ul>
              </li>
            `;
          } else {
            treeHTML += `
              <li>
                <span class="phrase" data-phrase='${JSON.stringify(phraseData)}'>${phrase}</span>
              </li>
            `;
          }
        });

        treeHTML += `
            </ul>
          </li>
        `;
      });

      treeHTML += `
          </ul>
        </li>
      `;
    });

    treeHTML += '</ul>';

    // Insert the tree structure into the DOM
    document.getElementById("phrasesContainer").innerHTML = DOMPurify.sanitize(treeHTML);

    // Add event listeners
    document.querySelectorAll('.folder').forEach(folder => {
      folder.addEventListener('click', function(event) {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("open");
        event.stopPropagation();
      });
    });

    document.querySelectorAll('.phrase, .phrase-folder').forEach(phraseElement => {
      phraseElement.addEventListener('click', function(event) {
        const phraseData = JSON.parse(this.getAttribute('data-phrase'));
        const defaultPhrase = phraseData.default?.value || phraseData.value || 'No default phrase available';
        navigator.clipboard.writeText(defaultPhrase).then(() => {
          $.notify("Скопировано", "success")
        }).catch(err => {
          console.error('Не удалось скопировать: ', err);
        });
        event.stopPropagation();
      });

      phraseElement.addEventListener('mouseover', function(event) {
        const phraseData = JSON.parse(this.getAttribute('data-phrase'));
        showMiniWindow(event, phraseData);
      });

      phraseElement.addEventListener('mouseout', function() {
        hideMiniWindow();
      });
    });

    const style = document.createElement('style');
    style.textContent = `
      .tree {
        list-style-type: none;
        padding-left: 20px;
      }
      .nested {
        display: none;
      }
      .nested.active {
        display: block;
      }
      .folder {
        cursor: pointer;
        user-select: none;
        padding: 5px;
        border-radius: 15px;
        display: inline-block;
        margin: 2px 0;
      }
      .folder::before {
        content: "▶";
        display: inline-block;
        margin-right: 6px;
        transition: transform 0.2s;
      }
      .folder.open::before {
        transform: rotate(90deg);
      }
      .category-folder {
        background-color: #e6f2ff;
        border: 1px solid #b3d9ff;
      }
      .subcategory-folder {
        background-color: #e6ffe6;
        border: 1px solid #b3ffb3;
      }
      .phrase-folder {
        background-color: #fff0e6;
        border: 1px solid #ffd1b3;
      }
      .phrase {
        cursor: pointer;
        padding: 5px;
        display: inline-block;
        border-radius: 5px;
        background-color: #f9f9f9;
        border: 1px solid #e6e6e6;
        margin: 2px 0;
      }
      .folder:hover, .phrase:hover {
        filter: brightness(0.9);
      }
      #miniWindow {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        display: none;
        z-index: 1000;
        max-width: 300px;
      }
      #notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        display: none;
        z-index: 1001;
      }
    `;
    document.head.appendChild(style);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function showMiniWindow(event, phraseData) {
  const miniWindow = document.getElementById('miniWindow') || createMiniWindow();
  let content = '';
  if (typeof phraseData === 'string') {
    content = `<div>${phraseData}</div>`;
  } else {
    for (const [key, value] of Object.entries(phraseData)) {
      if (value && typeof value === 'object' && value.value) {
        content += `<div><strong>${key}:</strong> ${value.value}</div>`;
      }
    }
  }
  miniWindow.innerHTML = content || 'No additional information available';
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

  // Debug: Log all .tabcontent elements
  console.log('Available .tabcontent elements:');
  document.querySelectorAll('.tabcontent').forEach(tab => {
    console.log(tab.id);
  });

  // Debug: Log all buttons
  console.log('Available buttons:');
  document.querySelectorAll('.btn-group button').forEach(button => {
    console.log(button.textContent);
  });
});

// Add a global click listener to catch any clicks that might be stopped by other event listeners
document.addEventListener('click', (event) => {
  if (event.target.matches('.btn-group button')) {
    console.log(`Global click detected on button: ${event.target.textContent}`);
  }
});