let dataToHighlight = {};

async function getHighlightColors() {
    try {
        const settings = await browser.storage.sync.get([
            "HIGHLIGHTER_CS",
            "HIGHLIGHTER_EMAIL",
            "HIGHLIGHTER_OCTP",
            "HIGHLIGHTER_COMPENSATION",
        ]);

        return {
            "Контакт сорвался": settings.HIGHLIGHTER_CS || "#ff0000",
            "Обращение из Email": settings.HIGHLIGHTER_EMAIL || "#006400",
            "ОЦТП - Входящая связь": settings.HIGHLIGHTER_OCTP || "#008080",
            "Компенсация за аварию": settings.HIGHLIGHTER_COMPENSATION || "#66CDAA",
        };
    } catch (error) {
        console.error("[Хелпер] - [Подсветка] Ошибка при получении цветов:", error);
        return {};
    }
}

function highlightText(element, colors) {
    if (!element || !element.textContent) return;

    const text = element.textContent.trim();
    let newHTML = text;

    // First check for warranty dates
    const warrantyMatch = text.match(/гарантийный срок до (\d{2}\.\d{2}\.\d{4})/);
    if (warrantyMatch) {
        const date = new Date(warrantyMatch[1].split(".").reverse().join("-"));
        const currentDate = new Date();
        const color = date > currentDate ? "green" : "red";
        newHTML = text.replace(
            warrantyMatch[1],
            `<span style="color: ${color}; font-weight: bold;">${warrantyMatch[1]}</span>`
        );
        element.innerHTML = newHTML;
        return;
    }

    // Then check for highlighted texts
    for (const [textToFind, color] of Object.entries(colors)) {
        if (text.includes(textToFind)) {
            newHTML = text.replace(
                new RegExp(textToFind, 'g'),
                `<span style="color: ${color}; font-weight: bold;">${textToFind}</span>`
            );
            element.innerHTML = newHTML;
            return;
        }
    }
}

async function initHighlighting() {
    const colors = await getHighlightColors();
    const settings = await browser.storage.sync.get("ARM_removeUselessAppealsColumns");
    const removeColumns = settings.ARM_removeUselessAppealsColumns;

    // Create mutation observer for dynamic content
    const observer = new MutationObserver(() => processTable(colors, removeColumns));

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Initial processing
    processTable(colors, removeColumns);
}

function processTable(colors, removeColumns) {
    try {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length < (removeColumns ? 9 : 10)) return;

                const stageCell = cells[2];
                const warrantyCell = cells[5];
                const problemCell = cells[removeColumns ? 9 : 10];

                // Skip if already processed
                if (row.hasAttribute('data-highlighted')) return;

                // Process each cell if it exists and hasn't been highlighted
                if (stageCell && !stageCell.classList.contains('helper-highlighted')) {
                    highlightText(stageCell, colors);
                    stageCell.classList.add('helper-highlighted');
                }

                if (warrantyCell && !warrantyCell.classList.contains('helper-highlighted')) {
                    highlightText(warrantyCell, colors);
                    warrantyCell.classList.add('helper-highlighted');
                }

                if (problemCell && !problemCell.classList.contains('helper-highlighted')) {
                    highlightText(problemCell, colors);
                    problemCell.classList.add('helper-highlighted');
                }

                // Mark row as processed
                row.setAttribute('data-highlighted', 'true');
            });
        });
    } catch (error) {
        console.error('[Хелпер] - [Подсветка] Ошибка при обработке таблицы:', error);
    }
}

// Handle other page specific highlights
if (document.URL.indexOf("wcc_request_appl_support.change_request_appl") !== -1) {
    highlightRequestsEdit();
}

if (document.URL.indexOf("db.ertelecom.ru/cgi-bin/ppo/excells/adv_act_retention") !== -1) {
    highlightCompensation();
}

function highlightRequestsEdit() {
    const block = document.querySelector(".col-sm-9");
    if (block) {
        block.innerHTML = block.innerHTML.replaceAll(
            "Контакт сорвался",
            "<span style='color: red; font-weight:bold'>Контакт сорвался</span>"
        );
    }
}

function highlightCompensation() {
    const cells = document.querySelectorAll("th");
    cells.forEach((cell) => {
        if (cell.innerText === "Компенсация за аварию") {
            cell.style.color = "black";
            cell.style.backgroundColor = "white";
            const tdCell = cell.parentElement.querySelector("td");
            if (tdCell) {
                tdCell.style.color = "black";
                tdCell.style.backgroundColor = "white";
            }
        }
    });
}