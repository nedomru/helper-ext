// Поиск по обращениям
async function searchByAppeal() {
    new MutationObserver(mutations => {
        const container = document.getElementById('lazy_content_2448');
        if (!container?.textContent) return;

        try {
            // Check if search field already exists to avoid duplicates
            if (!document.getElementById('appealsSearchField')) {
                // Create search wrapper with label
                const searchWrapper = document.createElement('div');
                searchWrapper.style.cssText = 'margin-bottom: 10px 0; display: flex; align-items: center; gap: 10px;';

                const searchField = document.createElement('input');
                searchField.id = 'appealsSearchField';
                searchField.type = 'text';
                searchField.placeholder = 'Поиск...';
                searchField.className = 'form-control';
                searchField.style.cssText = 'width: 15%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;';

                searchWrapper.appendChild(searchField);

                // Insert search wrapper before the tab content
                const tabContent = container.querySelector('.tab-content');
                if (tabContent) {
                    tabContent.parentNode.insertBefore(searchWrapper, tabContent);
                }

                // Add search functionality
                searchField.addEventListener('input', function (e) {
                    const searchValue = e.target.value.toLowerCase();
                    const tables = container.querySelectorAll('.tab-pane table');

                    tables.forEach(table => {
                        const rows = table.getElementsByTagName('tr');
                        const toggleRows = table.querySelectorAll('tr[style*="background-color: rgb(248, 249, 250)"]');

                        // Show/hide toggle rows based on search value
                        toggleRows.forEach(row => {
                            row.style.display = searchValue ? 'none' : 'table-row';
                        });

                        // Start from index 1 to skip header row
                        for (let i = 1; i < rows.length; i++) {
                            const row = rows[i];

                            // Skip category header rows and toggle rows
                            if (row.cells.length === 1 || row.style.backgroundColor === 'rgb(248, 249, 250)') continue;

                            const cells = row.getElementsByTagName('td');
                            let rowText = '';

                            // Concatenate all cell text in the row
                            for (let j = 0; j < cells.length; j++) {
                                rowText += cells[j].textContent.toLowerCase() + ' ';
                            }

                            // If searching, show all rows that match
                            if (searchValue) {
                                row.style.display = rowText.includes(searchValue) ? '' : 'none';
                            } else {
                                // If not searching, restore original state
                                if (row.getAttribute('appeal-step') === 'intermediate') {
                                    row.style.display = 'none';
                                } else {
                                    row.style.display = '';
                                }
                            }
                        }
                    });

                    // Update global toggle button state and text
                    const globalToggleBtn = document.getElementById('helper-toggle-appeals');
                    const statusText = globalToggleBtn?.nextElementSibling;

                    if (globalToggleBtn) {
                        globalToggleBtn.style.display = searchValue ? 'none' : '';
                        if (statusText) {
                            statusText.style.display = searchValue ? 'none' : '';
                        }
                    }
                });
            }

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
        }
    }).observe(document.getElementById('lazy_content_2448') || document.body, {
        childList: true,
        subtree: true
    });
}

// Поиск по логам
async function searchByLog() {
    new MutationObserver(mutations => {
        const container = document.getElementById('clientlog');
        if (!container?.textContent) return;

        try {
            // Check if search field already exists to avoid duplicates
            if (!document.getElementById('logSearchField')) {
                // Create search field
                const searchField = document.createElement('input');
                searchField.id = 'logSearchField';
                searchField.type = 'text';
                searchField.placeholder = 'Поиск...';
                searchField.className = 'form-control';
                searchField.style.cssText = 'margin: 10px 0; width: 15%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;';

                // Insert search field before the table
                container.parentNode.insertBefore(searchField, container);

                // Add search functionality
                searchField.addEventListener('input', function (e) {
                    const searchValue = e.target.value.toLowerCase();
                    const table = container.querySelector('table');
                    const rows = table.getElementsByTagName('tr');

                    // Start from index 1 to skip header row
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        const cells = row.getElementsByTagName('td');
                        let rowText = '';

                        // Concatenate all cell text in the row
                        for (let j = 0; j < cells.length; j++) {
                            rowText += cells[j].textContent.toLowerCase() + ' ';
                        }

                        // Show/hide row based on search match
                        if (rowText.includes(searchValue)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    }
                });
            }

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
        }
    }).observe(document.body, {childList: true, subtree: true});
}

// Поиск по свойствам
async function searchByFlag() {
    // Create the observer and store its reference
    const observer = new MutationObserver(mutations => {
        const container = document.getElementById('lazy_content_2416');
        const flagTable = container?.querySelector('.table-flag-agr');
        if (!flagTable) return;

        try {
            // Check if search field already exists to avoid duplicates
            if (!document.getElementById('flagSearchField')) {
                // Create search wrapper with label
                const searchWrapper = document.createElement('div');
                searchWrapper.style.cssText = 'margin: 10px 0; display: flex; align-items: center; gap: 10px;';

                const searchField = document.createElement('input');
                searchField.id = 'flagSearchField';
                searchField.type = 'text';
                searchField.placeholder = 'Поиск...';
                searchField.className = 'form-control';
                searchField.style.cssText = 'width: 15%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;';

                searchWrapper.appendChild(searchField);

                // Insert search wrapper before the flag table
                const buttonContainer = container.querySelector('.dialog_agr_flag').parentNode;
                buttonContainer.appendChild(searchWrapper);

                // Add search functionality
                searchField.addEventListener('input', function (e) {
                    const searchValue = e.target.value.toLowerCase();
                    const table = flagTable.querySelector('table');
                    if (!table) return;

                    const rows = table.getElementsByTagName('tr');

                    // Start from index 1 to skip header row
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        const cells = row.getElementsByTagName('td');
                        let rowText = '';

                        // Concatenate all cell text in the row
                        for (let j = 0; j < cells.length; j++) {
                            rowText += cells[j].textContent.toLowerCase() + ' ';
                        }

                        // Show/hide row based on search match
                        if (rowText.includes(searchValue)) {
                            row.style.display = '';
                        } else {
                            row.style.display = 'none';
                        }
                    }
                });

                // Disconnect observer once search field is added
                observer.disconnect();
            }
        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Признаки] Ошибка:`, error);
        }
    });

    // Start observing the target node
    observer.observe(document.getElementById('lazy_content_2416') || document.body, {
        childList: true,
        subtree: true
    });
}