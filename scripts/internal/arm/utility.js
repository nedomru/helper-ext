/**
 * Removes restrictions on the "waiter" element's parent to allow text selection and copying.
 * If the "waiter" and "formform" elements exist, it assigns event handlers to prevent event propagation,
 * allowing text within these elements to be selectable without interference.
 */
function allowCopy() {
    requestAnimationFrame(() => {
        const waiter = document.getElementById("waiter");
        if (!waiter) return;

        const parent = waiter.parentNode;

        if (parent) {
            parent.removeAttribute("style");
            parent.removeAttribute("onselectstart");
        }

        const formform = document.getElementById("formform");

        // Apply event handlers only if elements exist
        [waiter, formform].filter(Boolean).forEach(element => {
            // Use a more efficient event handler assignment
            const stopPropagation = event => event.stopPropagation();
            element.onmousedown = stopPropagation;
            element.onselectstart = stopPropagation();
        });
    });
}

/**
 * Get client agreement number from page code, and display it in the header
 */
async function showClientAgreementOnChangeRequest() {
    let headerText = document.querySelector(".text-primary");
    headerText.innerText = `Обращение по договору №${document.querySelector('input[name="agr_num"]').value}`;
}

/**
 * Anticipation checker and replacement for arm top3 button
 */
async function setHelperAnticipation() {
    const button = document.querySelector(".top_3_butt");
    if (!button || button.textContent.includes("Хелпер")) return;

    button.textContent = "Хелпер";
    let problems = 0;

    // Define problem types to check for
    const problemTypes = [{
        name: "СПАС", selector: ".spas_body", textCheck: null, // No text check needed
        logMessage: "Найден СПАС"
    }, {
        name: "Доступ",
        selector: ".bl_antic_head_w",
        textCheck: "Доступ отсутствует",
        logMessage: "Найден закрытый доступ"
    }, {
        name: "Авария", selector: ".bl_antic_head_w", textCheck: "Аварии на адресе", logMessage: "Найдена авария"
    }, {
        name: "ППР", selector: ".bl_antic_head_w", textCheck: "ППР на адресе", logMessage: "Найден ППР"
    }, {
        name: "Особый", selector: ".bl_antic_head_w", textCheck: "Особый Клиент", logMessage: "Найден особый клиент"
    }];

    // Function to check and mark a problem
    const markProblem = (type) => {
        button.innerHTML += ` | ${type.name}`;
        button.style.backgroundColor = "#cc3300";
        problems++;
        console.info(`[Хелпер] - [АРМ] - [Предвосхищение] ${type.logMessage}`);
        return true;
    };

    // Check for existing elements first
    problemTypes.forEach(type => {
        const elements = document.querySelectorAll(type.selector);
        if (elements && elements.length > 0) {
            if (!type.textCheck) {
                // For elements without text check (like СПАС)
                markProblem(type);
            } else {
                // For elements that need text content verification
                elements.forEach(element => {
                    if (element.textContent.trim() === type.textCheck) {
                        markProblem(type);
                    }
                });
            }
        }
    });

    // Set up a single observer for all problem types
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;

                    // Check each node against all problem types
                    problemTypes.forEach(type => {
                        if (node.classList && node.classList.contains(type.selector.substring(1))) {
                            // For elements without text check
                            if (!type.textCheck) {
                                markProblem(type);
                            }
                            // For elements with text check
                            else if (node.textContent.trim() === type.textCheck) {
                                markProblem(type);
                            }
                        }
                    });
                });
            }
        }
    });

    // Start observing with a single observer
    observer.observe(document.body, {childList: true, subtree: true});

    // Set a single timeout to disconnect the observer
    setTimeout(() => {
        observer.disconnect();
    }, 3000);

    // Set button color to green if no problems found
    if (problems === 0) {
        button.style.backgroundColor = "#008000";
    }

    console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Предвосхищение загружено`);
}

/**
 * Initialize the filter and count display for client sessions
 */
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

        // Sorting by date of session end
        const sortedReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1],);

        const totalCount = Object.values(reasonCounts).reduce((sum, count) => sum + count, 0,);

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
            .map(([reason, count]) => `
                            <tr>
                                <td style="border: 1px solid black; padding: 5px;">${reason}</td>
                                <td style="border: 1px solid black; padding: 5px;">${count}</td>
                            </tr>
                        `,)
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
            const reasonCell = row.cells[6];
            if (reasonCell) {
                row.style.display = filter === "all" || reasonCell.textContent.includes(filter) ? "" : "none";
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
            uniqueReasons: Object.keys(reasonCounts), reasonCounts,
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

/**
 * Removes tabs from agreement page
 * @param tabList List of enabled to delete tabs from agreement
 */
async function deleteTabs(tabList) {
    const listItems = document.querySelectorAll(".tabs_new");

    const removePromises = Array.from(listItems).map(async (item) => {
        if (tabList.includes(item.textContent.trim())) {
            item.remove();
        }
    });

    await Promise.all(removePromises);
}

/**
 * Checks for special client, send alert if found
 */
async function checkForSpecialClient() {
    const observerSpecial = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains("bl_antic_head_w")) {
                        checkSpecialClient(node);
                    }
                });
            }
        }
    });

    const checkSpecialClient = (element) => {
        if (element.textContent.trim() === "Особый Клиент") {
            alert("Внимание! Особый клиент!");
            console.info(`[Хелпер] - [АРМ] - [Особый клиент] Найден особый клиент`);
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
        const existingNodes = document.body.querySelectorAll(".bl_antic_head_w");
        existingNodes.forEach(checkSpecialClient);
    }
}

/**
 * Automatic formatting of EQM data.
 * Reformat MAC address to XX:XX:XX:XX:XX:XX
 * Removes EQM diag button
 */
async function autoFormatEQM() {
    new MutationObserver((mutations) => {
        const container = document.getElementById("lazy_content_2507");
        if (!container?.textContent) return;

        try {
            const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
                acceptNode: (node) => {
                    return /[0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}/i.test(node.textContent,) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                },
            }, false,);

            let currentNode;
            while ((currentNode = walker.nextNode())) {
                const originalText = currentNode.textContent;

                const newText = originalText.replace(/([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})/gi, (match, p1, p2, p3, p4, p5, p6) => {
                    return `${p1}:${p2}:${p3}:${p4}:${p5}:${p6}`;
                },);

                if (originalText !== newText) {
                    currentNode.textContent = newText;
                }
            }

            const macInputs = container.querySelectorAll('input[readonly][value*="-"]',);
            document.querySelector(".start_eqm_diag").remove()
            macInputs.forEach((input) => {
                const macValue = input.value;
                if (macValue.includes("-")) {
                    input.value = macValue.replace(/-/g, ":");
                }
            });
        } catch (error) {
            console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
        }
    }).observe(document.body, {
        childList: true, subtree: true, characterData: true, attributeFilter: ["value"],
    });
}

/**
 * Format compensate button to be more visible
 */
async function autoFormatCompensateButtons() {
    const compensationLinks = document.querySelectorAll("a.compensation");

    compensationLinks.forEach((link) => {
        if (link.textContent.trim().toLowerCase() === "ok") {
            link.textContent = "Применить";
        }
    });
}

/**
 * Change appeal item of left frame to "Интернет"
 */
async function changeAppealItemToInternet() {
    const changeEvent = new Event("change", {
        bubbles: true, cancelable: true,
    });

    const product = document.querySelector(".uni_reas_prod");
    const values = Array.from(product.options).map((option) => option.value);

    if (values.includes("70")) {
        product.value = "70";
        product.dispatchEvent(changeEvent);
    }
}
