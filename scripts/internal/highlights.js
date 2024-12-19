// Подсветка классификаторов на вкладке Обращений
let intervalId;

if (document.URL.indexOf("db.ertelecom.ru/cgi-bin") !== -1) {
    const config = {
        ARM_highlightRequestsClasses: initHighlighting,
    };

    browser.storage.sync.get(Object.keys(config)).then((result) => {
        Object.keys(config).forEach((key) => {
            if (result[key]) {
                config[key]();
            }
        });
    });
}

// Подсветка классификаторов на вкладке Изменения обращений
if (
    document.URL.indexOf("wcc_request_appl_support.change_request_appl") !== -1
) {
    highlightRequestsEdit();
}

// Подсветка компенсации за аварию в операциях с договором
if (
    document.URL.indexOf(
        "db.ertelecom.ru/cgi-bin/ppo/excells/adv_act_retention"
    ) !== -1
) {
    highlightCompensation();
}

let dataToHighlight = {};

// Функция для получения значения цвета из color picker
function getHighlightColors(callback) {
    browser.storage.sync
        .get([
            "HIGHLIGHTER_CS",
            "HIGHLIGHTER_EMAIL",
            "HIGHLIGHTER_OCTP",
            "HIGHLIGHTER_COMPENSATION",
        ])
        .then((settings) => {
            dataToHighlight = {
                "Контакт сорвался": settings.HIGHLIGHTER_CS || "#ff0000",
                "Обращение из Email": settings.HIGHLIGHTER_EMAIL || "#006400",
                "ОЦТП - Входящая связь": settings.HIGHLIGHTER_OCTP || "#008080",
                "Компенсация за аварию": settings.HIGHLIGHTER_COMPENSATION || "#66CDAA",
            };
            if (callback) callback(); // вызываем callback после загрузки данных
        })
        .catch((error) => {
            console.error("Ошибка при получении цветов:", error);
        });
}

function highlightText(element) {
    const text = element.innerText;

    // First check for warranty date to avoid multiple innerHTML updates
    const warrantyMatch = text.match(/гарантийный срок до (\d{2}\.\d{2}\.\d{4})/);
    if (warrantyMatch) {
        const date = new Date(warrantyMatch[1].split(".").reverse().join("-"));
        const currentDate = new Date();
        const color = date > currentDate ? "green" : "red";
        element.innerHTML = text.replace(
            warrantyMatch[1],
            `<span style="color: ${color}; font-weight: bold;">${warrantyMatch[1]}</span>`
        );
        return;
    }

    // Then check for highlight texts
    for (const [textToFind, color] of Object.entries(dataToHighlight)) {
        if (text.includes(textToFind)) {
            element.innerHTML = text.replace(
                textToFind,
                `<span style="color: ${color}; font-weight: bold;">${textToFind}</span>`
            );
            return;
        }
    }
}

async function initHighlighting() {
    // Get initial colors
    await getHighlightColors();

    // Create observer for both appeals containers
    new MutationObserver(async (mutations) => {
        try {
            const settings = await browser.storage.sync.get("ARM_removeUselessAppealsColumns");
            const removeColumns = settings.ARM_removeUselessAppealsColumns;
            const minLength = removeColumns ? 9 : 10;
            const problemColumnIndex = removeColumns ? 9 : 10;

            // Check both containers
            const appealsContainer = document.getElementById('lazy_content_2448');
            const warrantyContainer = document.getElementById('lazy_content_801');

            // Process appeals container
            if (appealsContainer?.textContent) {
                appealsContainer.querySelectorAll('table tr').forEach(row => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length <= minLength) return;

                    const problemCell = cells[problemColumnIndex];
                    const stageCell = cells[2];
                    const warrantyCell = cells[5];

                    if (!problemCell?.textContent ||
                        !stageCell?.textContent ||
                        !warrantyCell?.textContent) return;

                    // Skip if already highlighted
                    if (problemCell.classList.contains("helper-highlighted") ||
                        stageCell.classList.contains("helper-highlighted") ||
                        warrantyCell.classList.contains("helper-highlighted")) return;

                    // Highlight cells
                    highlightText(stageCell);
                    highlightText(problemCell);
                    problemCell.classList.add("helper-highlighted");

                    highlightText(warrantyCell);
                    warrantyCell.classList.add("helper-highlighted");
                });
            }

            // Process warranty container
            if (warrantyContainer?.textContent) {
                warrantyContainer.querySelectorAll('table tr').forEach(row => {
                    const cells = row.querySelectorAll("td");
                    if (cells.length < 6) return;

                    const warrantyCell = cells[5];
                    if (!warrantyCell?.textContent) return;

                    // Skip if already highlighted
                    if (warrantyCell.classList.contains("helper-highlighted")) return;

                    // Highlight warranty cell
                    highlightText(warrantyCell);
                    warrantyCell.classList.add("helper-highlighted");
                });
            }

        } catch (error) {
            console.error(`[${new Date().toLocaleTimeString()}] [Хелпер] - [АРМ] - [Подсветка] Ошибка:`, error);
        }
    }).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
    });
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
            tdCell.style.color = "black";
            tdCell.style.backgroundColor = "white";
        }
    });
}
