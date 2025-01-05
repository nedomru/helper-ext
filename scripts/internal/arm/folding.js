// Скрытие строк на вкладке Инфо
async function initInformationFold() {
    new MutationObserver(mutations => {
        const informationTab = document.getElementById('tabs-2444');
        if (!informationTab?.textContent) return;

        const tableContainer = informationTab.querySelector('.col-sm-8');
        const table = tableContainer?.querySelector('.table-condensed');
        if (!table || table.getAttribute('processed-by-helper')) return;

        try {
            const rowsToHide = [
                "Статус:",
                "Схема оплаты:",
                "",
                "Категория:",
                "Контактные e-mail:",
                "Место рождения",
                "Активные приложения",
                "Промо-пакет",
                "Идентификационные данные",
                "Автоплатеж"
            ];

            let totalHidden = 0;

            // Процессим строки
            Array.from(table.rows).slice(2).forEach(row => {
                const firstCell = row.cells[0]?.textContent;
                if (rowsToHide.includes(firstCell)) {
                    row.style.display = 'none';
                    row.setAttribute('helper-hidden-row', 'true');
                    totalHidden++;
                }
            });

            if (totalHidden > 0) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'display: flex; margin-bottom: 10px; align-items: center;';

                const toggleButton = document.createElement('button');
                toggleButton.id = 'helper-toggle-info';
                toggleButton.className = 'btn btn-xs btn-primary helper';
                toggleButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
                toggleButton.textContent = `▶️ Развернуть строки`;
                toggleButton.setAttribute('data-state', 'hidden');
                toggleButton.setAttribute('type', 'button');
                toggleButton.title = `Скрыты следующие поля: ${rowsToHide.filter(r => r).join(', ')}`;

                const status = document.createElement('span');
                status.textContent = 'Дополнительные поля скрыты';
                status.style.color = '#dc3545';

                // Handle toggle click
                toggleButton.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isHidden = toggleButton.getAttribute('data-state') === 'hidden';
                    const newState = isHidden ? 'visible' : 'hidden';

                    // Update rows visibility
                    document.querySelectorAll('[helper-hidden-row="true"]')
                        .forEach(row => row.style.display = isHidden ? 'table-row' : 'none');

                    // Update button and status text
                    toggleButton.textContent = isHidden
                        ? '🔽 Свернуть строки'
                        : `▶️ Развернуть строки`;
                    toggleButton.setAttribute('data-state', newState);

                    status.textContent = isHidden
                        ? 'Отображены все поля'
                        : 'Дополнительные поля скрыты';
                    status.style.color = isHidden ? '#198754' : '#dc3545';
                });

                // Add links if they exist
                ['#lk', '#lk_sso'].forEach(selector => {
                    const link = document.querySelector(`a.not_mobil_tech${selector}`);
                    if (link) {
                        link.textContent = selector === '#lk' ? '🚪 ЛК клиента' : '🚪 ЛК клиента (SSO)';
                        link.classList.add('btn', 'btn-primary', 'btn-xs');
                        link.style.cssText = 'margin-right: 10px; text-decoration: none;';
                        buttonContainer.appendChild(link);
                    }
                });

                buttonContainer.appendChild(toggleButton);
                buttonContainer.appendChild(status);
                tableContainer.insertBefore(buttonContainer, tableContainer.firstChild);

                // Remove standalone pipe symbols
                Array.from(tableContainer.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '|')
                    .forEach(node => node.remove());
            }

            // Mark table as processed
            table.setAttribute('processed-by-helper', 'true');
            console.info(`[Хелпер] - [АРМ] - [Клиентская информация] Обработано скрытых строк: ${totalHidden}`);

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Клиентская информация] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Скрытие неактивных приложений на вкладке Приложения
async function initApplicationsFold() {
    new MutationObserver(mutations => {
        const appsTab = document.getElementById('tabs-2120');
        if (!appsTab?.textContent) return;

        const table = appsTab.querySelector('.table-condensed');
        if (!table || table.getAttribute('processed-by-helper')) return;

        try {
            let totalHidden = 0;

            // Process each row starting from index 1 (skip header)
            Array.from(table.rows).slice(1).forEach(row => {
                try {
                    const status = row.cells[4]?.textContent;
                    if (status === "Закрыт" || status === "Не активен") {
                        row.style.display = "none";
                        row.setAttribute("helper-hidden-row", "true");
                        totalHidden++;
                    }
                } catch (rowError) {
                    console.error(`[Хелпер] - [АРМ] - [Приложения] Ошибка обработки строки:`, rowError);
                }
            });

            // Add toggle controls if we have hidden rows
            if (totalHidden > 0 && !appsTab.querySelector('#helper-toggle-apps')) {
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = 'display: flex; align-items: center; margin-bottom: 10px;';

                const toggleButton = document.createElement('button');
                toggleButton.id = 'helper-toggle-apps';
                toggleButton.className = 'btn btn-xs btn-primary helper';
                toggleButton.style.cssText = 'cursor: pointer; margin-right: 10px;';
                toggleButton.textContent = `▶️ Развернуть приложения (${totalHidden})`;
                toggleButton.setAttribute('data-state', 'hidden');
                toggleButton.setAttribute('type', 'button');

                const status = document.createElement('span');
                status.textContent = 'Неактивные и закрытые приложения скрыты';
                status.style.color = '#dc3545';

                toggleButton.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isHidden = toggleButton.getAttribute('data-state') === 'hidden';
                    const newState = isHidden ? 'visible' : 'hidden';

                    // Update rows visibility
                    document.querySelectorAll('[helper-hidden-row="true"]')
                        .forEach(row => row.style.display = isHidden ? 'table-row' : 'none');

                    // Update button and status text
                    toggleButton.textContent = isHidden
                        ? '🔽 Свернуть приложения'
                        : `▶️ Развернуть приложения (${totalHidden})`;
                    toggleButton.setAttribute('data-state', newState);

                    status.textContent = isHidden
                        ? 'Отображены все приложения'
                        : 'Неактивные и закрытые приложения скрыты';
                    status.style.color = isHidden ? '#198754' : '#dc3545';
                });

                buttonContainer.appendChild(toggleButton);
                buttonContainer.appendChild(status);

                const lineBreak = document.createElement('br');
                appsTab.insertBefore(lineBreak, appsTab.firstChild);
                appsTab.insertBefore(buttonContainer, lineBreak);
            }

            // Mark table as processed
            table.setAttribute('processed-by-helper', 'true');
            console.info(`[Хелпер] - [АРМ] - [Приложения] Обработано скрытых строк: ${totalHidden}`);

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Приложения] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Скрытие промежуточных шагов обращений
async function initAppealsFold() {
    new MutationObserver(() => {
        const container = document.getElementById('lazy_content_2448');
        if (!container?.textContent) return;

        const table = container.querySelector('table.border');
        if (!table || table.getAttribute('processed-by-helper')) return;

        try {
            let totalHidden = 0;
            const rows = Array.from(table.rows).slice(2); // Skip headers
            const appeals = [];
            let currentAppeal = [];

            // Group rows into appeals
            rows.forEach(row => {
                if (row.cells[0].textContent === '1') {
                    if (currentAppeal.length) appeals.push(currentAppeal);
                    currentAppeal = [row];
                } else {
                    currentAppeal.push(row);
                }
            });
            if (currentAppeal.length) appeals.push(currentAppeal);

            appeals.forEach((appeal, index) => {
                const effectiveLength = index === 0 ? appeal.length - 1 : appeal.length;

                const minSteps = 3;
                if (effectiveLength < minSteps) return;

                const appealNum = index + 1;
                const hiddenSteps = effectiveLength - 2;
                totalHidden += hiddenSteps;

                appeal.forEach((row, stepIndex) => {
                    row.setAttribute('appeal-number', appealNum);

                    // Check for edit_comment class to identify last step
                    const hasEditComment = row.querySelector('.edit_comment') !== null;

                    if (stepIndex === 0) {
                        row.setAttribute('appeal-step', 'first');
                    } else if (hasEditComment || stepIndex === appeal.length - 1) {
                        // Mark as last step if it has edit_comment or is the last row
                        row.setAttribute('appeal-step', 'last');
                        row.style.display = ''; // Ensure it's visible
                    } else {
                        row.setAttribute('appeal-step', 'intermediate');
                        row.style.display = 'none';
                    }
                });

                const toggleRow = document.createElement('tr');
                toggleRow.style.backgroundColor = '#E5E1DA';

                const toggleCell = document.createElement('td');
                toggleCell.colSpan = table.rows[0].cells.length;
                toggleCell.style.padding = '0';

                const toggleButton = document.createElement('a');
                toggleButton.href = '#';
                toggleButton.style.cssText = 'cursor:pointer; color:#ff0000; text-decoration:none; padding:5px; display:block; text-align:center;';
                toggleButton.setAttribute('data-state', 'hidden');
                toggleButton.textContent = `▶️ Шаги скрыты (${hiddenSteps})`

                toggleButton.addEventListener('click', e => {
                    e.preventDefault();
                    const isHidden = toggleButton.getAttribute('data-state') === 'hidden';
                    const newState = isHidden ? 'visible' : 'hidden';

                    document.querySelectorAll(`[appeal-number="${appealNum}"][appeal-step="intermediate"]`)
                        .forEach(row => row.style.display = isHidden ? 'table-row' : 'none');

                    toggleButton.textContent = isHidden
                        ? `🔽 Шаги отображены`
                        : `▶️ Шаги скрыты (${hiddenSteps})`
                    toggleButton.setAttribute('data-state', newState);
                    toggleButton.style.color = isHidden ? '#006400' : '#ff0000';
                });

                toggleCell.appendChild(toggleButton);
                toggleRow.appendChild(toggleCell);
                appeal[0].parentNode.insertBefore(toggleRow, appeal[0].nextSibling);
            });

            if (totalHidden > 0) {
                const btnContainer = document.createElement('div');
                btnContainer.style.cssText = 'display: flex; align-items: center; margin: 10px 0;';

                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'helper-toggle-appeals';
                toggleBtn.className = 'btn btn-xs btn-primary helper';
                toggleBtn.style.cssText = 'cursor: pointer; margin-right: 10px;';
                toggleBtn.textContent = `▶️ Шаги скрыты`;
                toggleBtn.setAttribute('data-state', 'hidden');
                toggleBtn.setAttribute('type', 'button');

                const status = document.createElement('span');
                status.textContent = 'Промежуточные шаги скрыты';
                status.style.color = '#dc3545';

                toggleBtn.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isHidden = toggleBtn.getAttribute('data-state') === 'hidden';
                    const newState = isHidden ? 'visible' : 'hidden';

                    const toggleButtons = table.querySelectorAll('a[data-state]');
                    toggleButtons.forEach(btn => {
                        const appealNum = btn.closest('tr').previousSibling.getAttribute('appeal-number');
                        const hiddenCount = document.querySelectorAll(`[appeal-number="${appealNum}"][appeal-step="intermediate"]`).length;
                        btn.textContent = isHidden
                            ? '🔽 Шаги отображены'
                            : `▶️ Шаги скрыты (${hiddenCount})`;
                        btn.setAttribute('data-state', newState);
                        btn.style.color = isHidden ? '#006400' : '#ff0000';
                    });

                    document.querySelectorAll('[appeal-step="intermediate"]')
                        .forEach(row => row.style.display = isHidden ? 'table-row' : 'none');

                    toggleBtn.textContent = isHidden
                        ? '🔽 Шаги отображены'
                        : `▶️ Шаги скрыты`;
                    toggleBtn.setAttribute('data-state', newState);

                    status.textContent = isHidden
                        ? 'Отображены все шаги'
                        : 'Промежуточные шаги скрыты';
                    status.style.color = isHidden ? '#198754' : '#dc3545';
                });

                btnContainer.appendChild(toggleBtn);
                btnContainer.appendChild(status);
                container.insertBefore(btnContainer, container.firstChild);
            }

            table.setAttribute('processed-by-helper', 'true');
            console.info(`[Хелпер] - [АРМ] - [Обращения] Обработано скрытых шагов: ${totalHidden}`);

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Скрытие промежуточных шагов сервисных заявок
async function initServiceRequestsFold() {
    const COMPLETION_STATUSES = [
        'Выполнено (Отправить в Call-центр)',
        'Заявка выполнена',
        'Выполнено',
        'Помощь оказана',
    ];

    new MutationObserver(() => {
        const serviceContainer = document.getElementById('lazy_content_2445');
        if (!serviceContainer?.textContent) return;

        const requestsContainer = serviceContainer.querySelector('#tc_ppd_tp_cz');
        if (!requestsContainer || requestsContainer.getAttribute('processed-by-helper')) return;

        try {
            let totalHidden = 0;
            const tables = requestsContainer.querySelectorAll('table.border');

            tables.forEach(table => {
                const rows = Array.from(table.querySelectorAll('tr')).slice(1);
                if (rows.length < 2) return;

                const lastContentRow = rows[rows.length - 2];
                const lastRowStatus = lastContentRow?.cells[2]?.textContent.trim();

                if (COMPLETION_STATUSES.includes(lastRowStatus)) {
                    const requestId = Math.random().toString(36).substr(2, 9);
                    const firstRow = rows[0];
                    const detailRow = rows[rows.length - 1];
                    const middleRows = rows.slice(1, -2);
                    totalHidden += middleRows.length;

                    firstRow.style.display = 'table-row';
                    lastContentRow.style.display = 'table-row';
                    detailRow.style.display = 'table-row';

                    middleRows.forEach(row => {
                        row.style.display = 'none';
                        row.setAttribute('data-request-id', requestId);
                    });

                    if (middleRows.length > 0) {
                        const toggleRow = document.createElement('tr');
                        toggleRow.style.backgroundColor = '#E5E1DA';

                        const toggleCell = document.createElement('td');
                        toggleCell.colSpan = firstRow.cells.length;
                        toggleCell.style.padding = '0';

                        const toggleButton = document.createElement('a');
                        toggleButton.href = '#';
                        toggleButton.style.cssText = 'cursor:pointer; color:#ff0000; text-decoration:none; padding:5px; display:block; text-align:center;';
                        toggleButton.setAttribute('data-state', 'hidden');
                        toggleButton.textContent = `▶️ Шаги скрыты (${middleRows.length})`;

                        toggleButton.addEventListener('click', e => {
                            e.preventDefault();
                            const isHidden = toggleButton.getAttribute('data-state') === 'hidden';
                            const newState = isHidden ? 'visible' : 'hidden';

                            const rows = document.querySelectorAll(`[data-request-id="${requestId}"]`);
                            rows.forEach(row => {
                                row.style.display = isHidden ? 'table-row' : 'none';
                            });

                            toggleButton.textContent = isHidden
                                ? `🔽 Шаги отображены`
                                : `▶️ Шаги скрыты (${middleRows.length})`;
                            toggleButton.setAttribute('data-state', newState);
                            toggleButton.style.color = isHidden ? '#006400' : '#ff0000';
                        });

                        toggleCell.appendChild(toggleButton);
                        toggleRow.appendChild(toggleCell);
                        firstRow.parentNode.insertBefore(toggleRow, firstRow.nextSibling);
                    }
                }
            });

            if (totalHidden > 0) {
                const btnContainer = document.createElement('div');
                btnContainer.style.cssText = 'display: flex; align-items: center; margin: 10px 0;';

                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'helper-toggle-requests';
                toggleBtn.className = 'btn btn-xs btn-primary helper';
                toggleBtn.style.cssText = 'cursor: pointer; margin-right: 10px;';
                toggleBtn.textContent = `▶️ Шаги скрыты`;
                toggleBtn.setAttribute('data-state', 'hidden');
                toggleBtn.setAttribute('type', 'button');

                const status = document.createElement('span');
                status.textContent = 'Промежуточные шаги скрыты';
                status.style.color = '#dc3545';

                // Find and replace this part in the toggle button click handler
                toggleBtn.addEventListener('click', e => {
                    e.preventDefault();
                    const isHidden = toggleBtn.getAttribute('data-state') === 'hidden';
                    const newState = isHidden ? 'visible' : 'hidden';

                    const toggleButtons = requestsContainer.querySelectorAll('a[data-state]');
                    toggleButtons.forEach(btn => {
                        // Get the hidden rows count by finding next row with data-request-id
                        const buttonRow = btn.closest('tr');
                        const nextRow = buttonRow.nextElementSibling;
                        if (nextRow) {
                            const requestId = nextRow.getAttribute('data-request-id');
                            // Get original count of hidden rows for this request
                            const hiddenCount = document.querySelectorAll(`[data-request-id="${requestId}"]`).length;
                            btn.textContent = isHidden
                                ? '🔽 Шаги отображены'
                                : `▶️ Шаги скрыты (${hiddenCount})`;
                            btn.setAttribute('data-state', newState);
                            btn.style.color = isHidden ? '#006400' : '#ff0000';
                        }
                    });

                    document.querySelectorAll('[data-request-id]')
                        .forEach(row => row.style.display = isHidden ? 'table-row' : 'none');

                    toggleBtn.textContent = isHidden
                        ? '🔽 Шаги отображены'
                        : `▶️ Шаги скрыты`;
                    toggleBtn.setAttribute('data-state', newState);

                    status.textContent = isHidden
                        ? 'Отображены все шаги'
                        : 'Промежуточные шаги скрыты';
                    status.style.color = isHidden ? '#198754' : '#dc3545';
                });

                btnContainer.appendChild(toggleBtn);
                btnContainer.appendChild(status);
                serviceContainer.insertBefore(btnContainer, serviceContainer.firstChild);
            }

            requestsContainer.setAttribute('processed-by-helper', 'true');
            console.info(`[Хелпер] - [АРМ] - [Сервисные заявки] Обработано скрытых шагов: ${totalHidden}`);

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Сервисные заявки] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Скрытие промежуточных шагов заявок на подключение
async function initConnectionRequestsFold() {
    new MutationObserver(() => {
        const requestsContainer = document.getElementById('lazy_content_802');
        if (!requestsContainer?.textContent) return;

        if (requestsContainer.getAttribute('processed-by-helper')) return;

        try {
            let totalHidden = 0;
            const tables = requestsContainer.querySelectorAll('table.border');

            tables.forEach(table => {
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                if (rows.length < 2) return;

                const firstRow = rows[0];
                const lastRow = rows[rows.length - 1];
                const middleRows = rows.slice(1, -1);
                totalHidden += middleRows.length;

                firstRow.style.display = 'table-row';
                lastRow.style.display = 'table-row';

                const requestId = Math.random().toString(36).substr(2, 9);

                middleRows.forEach(row => {
                    row.style.display = 'none';
                    row.setAttribute('data-request-id', requestId);
                });

                if (middleRows.length > 0) {
                    const toggleRow = document.createElement('tr');
                    toggleRow.style.backgroundColor = '#E5E1DA';

                    const toggleCell = document.createElement('td');
                    toggleCell.colSpan = table.rows[0].cells.length;
                    toggleCell.style.padding = '0';

                    const toggleButton = document.createElement('a');
                    toggleButton.href = '#';
                    toggleButton.style.cssText = 'cursor:pointer; color:#ff0000; text-decoration:none; padding:5px; display:block; text-align:center;';
                    toggleButton.setAttribute('data-state', 'hidden');
                    toggleButton.textContent = `▶️ Шаги скрыты (${middleRows.length})`;

                    toggleButton.addEventListener('click', e => {
                        e.preventDefault();
                        const isHidden = toggleButton.getAttribute('data-state') === 'hidden';
                        const newState = isHidden ? 'visible' : 'hidden';

                        const rows = document.querySelectorAll(`[data-request-id="${requestId}"]`);
                        rows.forEach(row => {
                            row.style.display = isHidden ? 'table-row' : 'none';
                        });

                        toggleButton.textContent = isHidden
                            ? `🔽 Шаги отображены`
                            : `▶️ Шаги скрыты (${middleRows.length})`;
                        toggleButton.setAttribute('data-state', newState);
                        toggleButton.style.color = isHidden ? '#006400' : '#ff0000';
                    });

                    toggleCell.appendChild(toggleButton);
                    toggleRow.appendChild(toggleCell);
                    firstRow.parentNode.insertBefore(toggleRow, firstRow.nextSibling);
                }
            });

            if (totalHidden > 0) {
                const btnContainer = document.createElement('div');
                btnContainer.style.cssText = 'display: flex; align-items: center; margin: 10px 0;';

                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'helper-toggle-connections';
                toggleBtn.className = 'btn btn-xs btn-primary helper';
                toggleBtn.style.cssText = 'cursor: pointer; margin-right: 10px;';
                toggleBtn.textContent = `▶️ Шаги скрыты`;
                toggleBtn.setAttribute('data-state', 'hidden');
                toggleBtn.setAttribute('type', 'button');

                const status = document.createElement('span');
                status.textContent = 'Промежуточные шаги скрыты';
                status.style.color = '#dc3545';

                toggleBtn.addEventListener('click', e => {
                    e.preventDefault();
                    const isHidden = toggleBtn.getAttribute('data-state') === 'hidden';
                    const newState = isHidden ? 'visible' : 'hidden';

                    const toggleButtons = requestsContainer.querySelectorAll('a[data-state]');
                    toggleButtons.forEach(btn => {
                        // Get the hidden rows count by finding next row with data-request-id
                        const buttonRow = btn.closest('tr');
                        const nextRow = buttonRow.nextElementSibling;
                        if (nextRow) {
                            const requestId = nextRow.getAttribute('data-request-id');
                            // Get original count of hidden rows for this request
                            const hiddenCount = document.querySelectorAll(`[data-request-id="${requestId}"]`).length;
                            btn.textContent = isHidden
                                ? '🔽 Шаги отображены'
                                : `▶️ Шаги скрыты (${hiddenCount})`;
                            btn.setAttribute('data-state', newState);
                            btn.style.color = isHidden ? '#006400' : '#ff0000';
                        }
                    });

                    document.querySelectorAll('[data-request-id]')
                        .forEach(row => row.style.display = isHidden ? 'table-row' : 'none');

                    toggleBtn.textContent = isHidden
                        ? '🔽 Шаги отображены'
                        : `▶️ Шаги скрыты`;
                    toggleBtn.setAttribute('data-state', newState);

                    status.textContent = isHidden
                        ? 'Отображены все шаги'
                        : 'Промежуточные шаги скрыты';
                    status.style.color = isHidden ? '#198754' : '#dc3545';
                });

                btnContainer.appendChild(toggleBtn);
                btnContainer.appendChild(status);
                requestsContainer.insertBefore(btnContainer, requestsContainer.firstChild);
            }

            requestsContainer.setAttribute('processed-by-helper', 'true');
            console.info(`[Хелпер] - [АРМ] - [Заявки] Обработано скрытых шагов: ${totalHidden}`);

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Заявки] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Удаление неиспользуемых вкладок диагностики EQM
async function removeDiagnosticTabs() {
    new MutationObserver(mutations => {
        const container = document.getElementById('lazy_content_2507');
        if (!container?.textContent) return;

        try {
            $('a[href="#diagTelephony"]').remove();
            $('a[href="#dataRecovery"]').remove();
            $('a[href="#diagSpas"]').remove();
            $('a[href="#diagDeviceIzet"]').remove();
            $('a[href="#diagIptv"]').remove();
            $('a[href*="novotelecom"][href*="aboncard"]').remove();
        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Удаление неиспользуемых колонок в обращениях
async function removeAppealsColumns() {
    new MutationObserver(mutations => {
        const container = document.getElementById('lazy_content_2448');
        if (!container?.textContent) return;

        try {
            const table = document.querySelector('table');
            if (!table) return;

            const tables = document.querySelectorAll('table');

            tables.forEach(table => {
                // Get all rows
                const rows = table.querySelectorAll('tr');
                if (!rows.length) return;

                // Get the header row (first row)
                const headerRow = rows[0];
                const headers = Array.from(headerRow.querySelectorAll('th'));

                // Find indexes of columns to remove by matching header text
                const columnsToRemove = ['Оборудование', 'Продукт', 'Платформа', 'Исполнитель'];
                const indexesToRemove = [];

                headers.forEach((header, index) => {
                    const headerText = header.textContent.trim();
                    if (columnsToRemove.includes(headerText)) {
                        indexesToRemove.push(index);
                    }
                });

                // Sort indexes in descending order to avoid shifting issues
                indexesToRemove.sort((a, b) => b - a);

                // Remove the columns from each row
                rows.forEach(row => {
                    const cells = Array.from(row.cells);
                    indexesToRemove.forEach(index => {
                        if (cells[index]) {
                            cells[index].remove();
                        }
                    });
                });

                // Update colspan for any header rows that span the full table width
                const fullWidthHeaders = table.querySelectorAll('td[colspan="14"]');
                fullWidthHeaders.forEach(header => {
                    header.setAttribute('colspan', '10'); // 14 - 4 removed columns = 10
                });
            });
        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}