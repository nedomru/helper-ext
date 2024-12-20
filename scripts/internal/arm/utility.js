// Разрешение копирования любого текста
async function allowCopy() {
    setTimeout(async () => {
        const waiter = document.getElementById("waiter");
        if (!waiter) return;

        const {parentNode: parent} = waiter;
        parent.style = "";
        parent.onselectstart = "";

        const formform = document.getElementById("formform");
        if (!formform) return;

        [waiter, formform].forEach((el) => {
            el.onmousedown = el.onselectstart = (event) => event.stopPropagation();
        });
    }, 2000);
}

// Отображение договора клиента при изменении обращения
async function showClientAgreementOnChangeRequest() {
    let headerText = document.querySelector(".text-primary");
    headerText.innerText = `Обращение по договору №${
        document.querySelector('input[name="agr_num"]').value
    }`;
}

// Замена предвосхищения Хелпером
async function setHelperAnticipation() {
    const button = document.querySelector(".top_3_butt");
    if (!button) return;
    if (button.textContent.includes("Хелпер")) return;
    button.textContent = "Хелпер";

    const observerSPAS = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForSPAS);
            }
        }
    });

    const observerAccess = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForAccess);
            }
        }
    });

    const observerAccident = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForAccident);
            }
        }
    });

    const observerPPR = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForPPR);
            }
        }
    });

    const observerSpecial = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(checkForSpecial);
            }
        }
    });

    let problems = 0;

    // СПАС
    let spas = document.querySelector(".spas_body");
    if (spas) {
        button.innerHTML += " | СПАС";
        button.style.backgroundColor = "#cc3300";
        problems++;

        console.info(
            `[Хелпер] - [АРМ] - [Предвосхищение] Найден СПАС`,
        );
    } else {
        function checkForSPAS(node) {
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.classList.contains("spas_body")
            ) {
                button.innerHTML += " | СПАС";
                button.style.backgroundColor = "#cc3300";
                problems++;
                observerSPAS.disconnect();
                clearTimeout(timeout);

                console.info(
                    `[Хелпер] - [АРМ] - [Предвосхищение] Найден СПАС`,
                );
            }
        }

        observerSPAS.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerSPAS.disconnect();
        }, 3000);
    }

    // Закрытый доступ
    let access = document.querySelectorAll(".bl_antic_head_w");
    if (access) {
        access.forEach((element) => {
            if (element.textContent.trim() === "Доступ отсутствует") {
                button.innerHTML += " | Доступ";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.info(
                    `[Хелпер] - [АРМ] - [Предвосхищение] Найден закрытый доступ`,
                );
            }
        });
    } else {
        function checkForAccess(node) {
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.classList.contains("bl_antic_head_w")
            ) {
                if (node.textContent.trim() === "Доступ отсутствует") {
                    button.innerHTML += " | Доступ";
                    button.style.backgroundColor = "#cc3300";
                    problems++;
                    observerAccess.disconnect();
                    clearTimeout(timeout);

                    console.info(
                        `[Хелпер] - [АРМ] - [Предвосхищение] Найден закрытый доступ`,
                    );
                }
            }
        }

        observerAccess.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerAccess.disconnect();
        }, 3000);
    }

    // Авария
    let accident = document.querySelectorAll(".bl_antic_head_w");
    if (accident) {
        accident.forEach((element) => {
            if (element.textContent.trim() === "Аварии на адресе") {
                button.innerHTML += " | Авария";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.info(
                    `[Хелпер] - [АРМ] - [Предвосхищение] Найдена авария`,
                );
            }
        });
    } else {
        function checkForAccident(node) {
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.classList.contains("bl_antic_head_w")
            ) {
                if (node.textContent.trim() === "Аварии на адресе") {
                    button.innerHTML += " | Авария";
                    button.style.backgroundColor = "#cc3300";
                    problems++;
                    observerAccess.disconnect();
                    clearTimeout(timeout);

                    console.info(
                        `[Хелпер] - [АРМ] - [Предвосхищение] Найдена авария`,
                    );
                }
            }
        }

        observerAccident.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerAccident.disconnect();
        }, 3000);
    }

    // ППР
    let ppr = document.querySelectorAll(".bl_antic_head_w");
    if (ppr) {
        ppr.forEach((element) => {
            if (element.textContent.trim() === "ППР на адресе") {
                button.innerHTML += " | ППР";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.info(
                    `[Хелпер] - [АРМ] - [Предвосхищение] Найден ППР`,
                );
            }
        });
    } else {
        function checkForPPR(node) {
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.classList.contains("bl_antic_head_w")
            ) {
                if (node.textContent.trim() === "ППР на адресе") {
                    button.innerHTML += " | ППР";
                    button.style.backgroundColor = "#cc3300";
                    problems++;
                    observerPPR.disconnect();
                    clearTimeout(timeout);

                    console.info(
                        `[Хелпер] - [АРМ] - [Предвосхищение] Найден ППР`,
                    );
                }
            }
        }

        observerPPR.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerPPR.disconnect();
        }, 3000);
    }

    // Особый клиент
    let special = document.querySelectorAll(".bl_antic_head_w");
    if (special) {
        special.forEach((element) => {
            if (element.textContent.trim() === "Особый Клиент") {
                button.innerHTML += " | Особый";
                button.style.backgroundColor = "#cc3300";
                problems++;

                console.info(
                    `[Хелпер] - [АРМ] - [Предвосхищение] Найден особый клиент`,
                );
            }
        });
    } else {
        function checkForSpecial(node) {
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.classList.contains("bl_antic_head_w")
            ) {
                if (node.textContent.trim() === "Особый Клиент") {
                    button.innerHTML += " | Особый";
                    button.style.backgroundColor = "#cc3300";
                    problems++;

                    observerSpecial.disconnect();
                    clearTimeout(timeout);

                    console.info(
                        `[Хелпер] - [АРМ] - [Предвосхищение] Найден особый клиент`,
                    );
                }
            }
        }

        observerSpecial.observe(document.body, {childList: true, subtree: true});
        const timeout = setTimeout(() => {
            observerSpecial.disconnect();
        }, 3000);
    }

    if (problems === 0) {
        button.style.backgroundColor = "#008000";
    }
    console.info(
        `[Хелпер] - [АРМ] - [Предвосхищение] Предвосхищение загружено`,
    );
}

// Фильтр сессий клиента по типу разрывов
async function initFilterClientSessions() {
    const container = document.querySelector(".container");
    const targetNode = document.getElementById("js-res-app");
    let filterContainer, countDisplay;

    const createFilterAndCountElements = () => {
        filterContainer = document.createElement("div");
        filterContainer.innerHTML = `
            <label for="reason-filter">Фильтр по причине завершения:</label>
            <select id="reason-filter"></select>
            <div id="reason-count-display" style="max-width: 200px; margin-top: 10px;"></div>
        `;
        container.insertBefore(filterContainer, targetNode);

        const reasonFilter = filterContainer.querySelector("#reason-filter");
        reasonFilter.addEventListener("change", filterClientSessions);

        countDisplay = filterContainer.querySelector("#reason-count-display");
    };

    const updateFilterAndCount = () => {
        const {uniqueReasons, reasonCounts} = getUniqueReasonsAndCounts();
        updateFilter(uniqueReasons);
        updateCountDisplay(reasonCounts);
    };

    const updateFilter = (uniqueReasons) => {
        const reasonFilter = document.getElementById("reason-filter");
        reasonFilter.innerHTML = `<option value="all">Все</option>${uniqueReasons
            .map((reason) => `<option value="${reason}">${reason}</option>`)
            .join("")}`;
    };

    const updateCountDisplay = (reasonCounts) => {
        if (!countDisplay) return;

        // Sort the reasons by count in descending order
        const sortedReasons = Object.entries(reasonCounts).sort(
            (a, b) => b[1] - a[1]
        );

        // Calculate total count
        const totalCount = Object.values(reasonCounts).reduce((sum, count) => sum + count, 0);

        countDisplay.innerHTML = `
        <table style="width:100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid black; padding: 5px; text-align: center;">Разрыв</th>
                    <th style="border: 1px solid black; padding: 5px; text-align: center;">Кол-во</th>
                </tr>
            </thead>
            <tbody>
                ${sortedReasons
            .map(
                ([reason, count]) => `
                            <tr>
                                <td style="border: 1px solid black; padding: 5px;">${reason}</td>
                                <td style="border: 1px solid black; padding: 5px;">${count}</td>
                            </tr>
                        `
            )
            .join("")}
                <tr>
                    <td style="border: 1px solid black; padding: 5px; font-weight: bold;">Всего разрывов</td>
                    <td style="border: 1px solid black; padding: 5px; font-weight: bold;">${totalCount}</td>
                </tr>
            </tbody>
        </table>
    `;
    };

    const filterClientSessions = () => {
        const filter = document.getElementById("reason-filter").value;
        const rows = document.querySelectorAll("#js-res-app table tbody tr");
        rows.forEach((row) => {
            const reasonCell = row.cells[6]; // 7th column (index 6)
            if (reasonCell) {
                row.style.display =
                    filter === "all" || reasonCell.textContent.includes(filter)
                        ? ""
                        : "none";
            }
        });
    };

    const getUniqueReasonsAndCounts = () => {
        const rows = document.querySelectorAll("#js-res-app table tbody tr");
        const reasonCounts = {};
        rows.forEach((row) => {
            const reason = row.cells[6]?.textContent.trim();
            if (reason) {
                reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
            }
        });
        return {
            uniqueReasons: Object.keys(reasonCounts),
            reasonCounts,
        };
    };

    const observerCallback = () => {
        if (document.querySelector("#js-res-app table tbody")) {
            if (!filterContainer) createFilterAndCountElements();
            updateFilterAndCount();
            filterClientSessions();
        }
    };

    if (targetNode) {
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, {childList: true, subtree: true});
    } else {
        observerCallback();
    }
}

// Автоматическое сворачивание СПАСа
async function hideSPAS() {
    // Своваричаем предвосхищение
    let header = document.getElementById("collapse-top-3");
    if (header) header.className = "collapse";
}

// Удаление вкладок с договора клиента
async function deleteTabs(tabList) {
    const listItems = document.querySelectorAll(".tabs_new");

    const removePromises = Array.from(listItems).map(async (item) => {
        if (tabList.includes(item.textContent.trim())) {
            item.remove();
        }
    });

    await Promise.all(removePromises);
}

// Проверка и уведомление об особом клиенте
async function checkForSpecialClient() {
    const observerSpecial = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.classList.contains("bl_antic_head_w")
                    ) {
                        checkSpecialClient(node);
                    }
                });
            }
        }
    });

    const checkSpecialClient = (element) => {
        if (element.textContent.trim() === "Особый Клиент") {
            alert("Внимание! Особый клиент!");
            console.info(
                `[Хелпер] - [АРМ] - [Особый клиент] Найден особый клиент`,
            );
            observerSpecial.disconnect();
        }
    };

    const special = document.querySelectorAll(".bl_antic_head_w");
    if (special.length > 0) {
        special.forEach(checkSpecialClient);
    } else {
        observerSpecial.observe(document.body, {childList: true, subtree: true});
        setTimeout(() => {
            observerSpecial.disconnect();
        }, 3000);
        // Подключение для вызывания для существующих дочерних элементов
        const existingNodes = document.body.querySelectorAll(".bl_antic_head_w");
        existingNodes.forEach(checkSpecialClient);
    }
}

// Автоматическое форматирование MAC-адресов в EQM
async function autoFormatEQMMacs() {
    new MutationObserver(mutations => {
        const container = document.getElementById('lazy_content_2507');
        if (!container?.textContent) return;

        try {
            // Process all text nodes in the container that contain MAC addresses
            const walker = document.createTreeWalker(
                container,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: node => {
                        // Only process text nodes that contain MAC-like patterns
                        return /[0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}/i.test(node.textContent)
                            ? NodeFilter.FILTER_ACCEPT
                            : NodeFilter.FILTER_SKIP;
                    }
                },
                false
            );

            let currentNode;
            while (currentNode = walker.nextNode()) {
                const originalText = currentNode.textContent;

                // Replace MAC addresses using hyphens with colon format
                const newText = originalText.replace(
                    /([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})/gi,
                    (match, p1, p2, p3, p4, p5, p6) => {
                        // Preserve original case while ensuring colons as separators
                        return `${p1}:${p2}:${p3}:${p4}:${p5}:${p6}`;
                    }
                );

                // Only update if changes were made
                if (originalText !== newText) {
                    currentNode.textContent = newText;
                }
            }

            // Also process MAC addresses in input fields with specific attributes
            const macInputs = container.querySelectorAll('input[readonly][value*="-"]');
            macInputs.forEach(input => {
                const macValue = input.value;
                if (macValue.includes('-')) {
                    input.value = macValue.replace(/-/g, ':');
                }
            });

        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
        }
    }).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributeFilter: ['value'] // Also watch for changes to input values
    });
}

// Автоматическое проставление компенсации за аварию за несколько дней
async function addMassCompensationButton() {
    // Date validation regex: DD.MM format
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])$/;
    const currentYear = new Date().getFullYear();

    // Helper function to get parameters from URL with proper escaping
    function getParametersFromUrl() {
        const url = new URL(window.location.href);
        return {
            sessionId: url.searchParams.get('session_id$c'),
            userId: url.searchParams.get('client$c'),
            agreementId: url.searchParams.get('agreement_id$i')
        };
    }

    // Helper function to get required parameters from page
    function getPageParameters() {
        // Get the products count
        const productsCount = document.querySelector('input[name="products_cnt$i"]')?.value;

        // Find the specific row for "Компенсация за аварию"
        const compensationRow = Array.from(document.querySelectorAll('th')).find(
            th => th.textContent.includes('Компенсация за аварию')
        )?.closest('tr');

        // Get the compensation link from this specific row
        const compensationLink = compensationRow?.querySelector('a.compensation');

        // Get the attributes from the specific compensation link
        const monthId = compensationLink?.getAttribute('month_id');
        const flagId = compensationLink?.getAttribute('flag_id');
        const flagIdAndIndex = compensationLink?.getAttribute('flag_id_and_i');

        return {
            productsCount,
            monthId,
            flagId,
            flagIdAndIndex
        };
    }

    // Helper function to validate date
    function isValidDate(dateString) {
        if (!dateRegex.test(dateString)) return false;

        const [day, month] = dateString.split('.').map(Number);
        const date = new Date(currentYear, month - 1, day);

        return date.getDate() === day &&
            date.getMonth() === month - 1;
    }

    // Helper function to format date with current year
    function formatDateWithYear(dateString) {
        return `${dateString}.${currentYear}`;
    }

    // Helper function to get dates array between start and end dates
    function getDatesArray(startDate, endDate) {
        const dates = [];
        const currentDate = new Date(startDate.split('.').reverse().join('-'));
        const lastDate = new Date(endDate.split('.').reverse().join('-'));

        while (currentDate <= lastDate) {
            dates.push(currentDate.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    // Helper function to make compensation request
    async function makeCompensationRequest(urlParameters, pageParameters, compensationDate) {
        // Get the current location's hostname and extract the base domain
        const currentURL = window.location.href;
        const baseURL = currentURL.match(/(https:\/\/[^\/]+)/)[1];

        // Construct the full URL using the same base domain
        const fetchURL = `${baseURL}/cgi-bin/ppo/excells/adv_act_retention.add_flag`;

        const requestBody = new URLSearchParams({
            'session_id$c': urlParameters.sessionId,
            'client$c': urlParameters.userId,
            'agreement_id$i': urlParameters.agreementId,
            'products_cnt$i': pageParameters.productsCount,
            'month_id$i': pageParameters.monthId,
            'flag_id$i': pageParameters.flagId,
            'flag_id_and_i$i': pageParameters.flagIdAndIndex,
            'date_from$c': compensationDate
        });

        const response = await fetch(fetchURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded",
                "Sec-GPC": "1",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "iframe",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Priority": "u=4",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            body: requestBody.toString()
        });

        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('windows-1251');
        const responseText = decoder.decode(buffer);

        // Check for successful response indicators
        if (!responseText.includes('УСПЕШНОЕ') || !responseText.includes('Флаг успешно добавлен')) {
            $.notify(`Ошибка добавления компенсации для даты: ${compensationDate}`, "error");
            throw new Error(`Failed for date ${compensationDate}: Invalid response content`);
        }

        if (!response.ok) {
            throw new Error(`Failed for date ${compensationDate}: HTTP ${response.status}`);
        }

        return true;
    }

    // Find and process table cells
    const tableCells = document.querySelectorAll("th");
    tableCells.forEach((cell) => {
        if (cell.innerText === "Компенсация за аварию") {
            const lineBreak = document.createElement("br");
            const button = document.createElement("button");
            button.innerText = "Несколько дней";
            button.className = "button";

            button.onclick = async () => {
                // Get parameters from URL and page
                const urlParameters = getParametersFromUrl();
                const pageParameters = getPageParameters();

                // Validate we have all required parameters
                if (!urlParameters.sessionId || !urlParameters.userId || !urlParameters.agreementId) {
                    $.notify("Не удалось получить необходимые параметры из URL", "error");
                    return;
                }

                if (!pageParameters.productsCount || !pageParameters.monthId ||
                    !pageParameters.flagId || !pageParameters.flagIdAndIndex) {
                    $.notify("Не удалось получить необходимые параметры со страницы", "error");
                    return;
                }

                // Get start date (now only requiring DD.MM)
                let startDate = prompt("Введите начальную дату (ДД.ММ):");
                if (!startDate) return;
                if (!isValidDate(startDate)) {
                    $.notify("Неверный формат начальной даты. Используйте формат ДД.ММ", "error");
                    return;
                }
                startDate = formatDateWithYear(startDate);

                // Get end date (now only requiring DD.MM)
                let endDate = prompt("Введите конечную дату (ДД.ММ):");
                if (!endDate) return;
                if (!isValidDate(endDate)) {
                    $.notify("Неверный формат конечной даты. Используйте формат ДД.ММ", "error");
                    return;
                }
                endDate = formatDateWithYear(endDate);

                // Validate date range
                const startDateObject = new Date(startDate.split('.').reverse().join('-'));
                const endDateObject = new Date(endDate.split('.').reverse().join('-'));
                if (startDateObject > endDateObject) {
                    $.notify("Начальная дата не может быть позже конечной даты", "error");
                    return;
                }

                try {
                    const dates = getDatesArray(startDate, endDate);
                    let successCount = 0;
                    let errorCount = 0;

                    // Process each date
                    for (const date of dates) {
                        try {
                            await makeCompensationRequest(urlParameters, pageParameters, date);
                            successCount++;
                            // Add small delay between requests
                            await new Promise(resolve => setTimeout(resolve, 100));
                        } catch (error) {
                            console.error('Error processing compensation:', error);
                            errorCount++;
                        }
                    }

                    // Show final results
                    if (successCount > 0) {
                        $.notify(`Успешно добавлено компенсаций: ${successCount}`, "success");
                    }
                    if (errorCount > 0) {
                        $.notify(`Ошибок при добавлении: ${errorCount}`, "error");
                    }

                } catch (error) {
                    console.error('Failed to process compensations:', error);
                    $.notify("Произошла ошибка при обработке компенсаций", "error");
                }
            };
            cell.appendChild(lineBreak);
            cell.appendChild(button);
        }
    });
}
