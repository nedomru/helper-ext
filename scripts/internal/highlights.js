// Подсветка классификаторов на вкладке Обращений
let intervalId;

if (document.URL.indexOf("db.ertelecom.ru/cgi-bin") !== -1) {
    const config = {
        ARM_highlightRequestsClasses: highlightClasses,
    };

    browser.storage.sync.get(Object.keys(config)).then((result) => {
        Object.keys(config).forEach((key) => {
            if (result[key]) {
                config[key]();
            }
        });
    });

    function highlightClasses() {
        getHighlightColors(() => {
            setInterval(highlightRequestsTab, 1000);
        });
    }
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
    let text = element.innerText;

    Object.entries(dataToHighlight).forEach(([textToFind, color]) => {
        if (text.includes(textToFind)) {
            const span = document.createElement("span");
            span.style.color = color;
            span.style.fontWeight = "bold";
            span.textContent = textToFind;
            element.innerHTML = text.replace(textToFind, span.outerHTML);
        }
    });

    let dateRegex = /\d{2}\.\d{2}\.\d{4}/;
    let match = text.match(dateRegex);
    if (text.includes("гарантийный срок до") && match) {
        let date = new Date(match[0].split(".").reverse().join("-"));
        let currentDate = new Date();

        let span = document.createElement("span");
        span.style.color = date > currentDate ? "green" : "red";
        span.style.fontWeight = "bold";
        span.textContent = match[0];
        element.innerHTML = text.replace(match[0], span.outerHTML);
    }
}

async function highlightRequestsTab() {
    const settings = await browser.storage.sync.get("ARM_removeUselessAppealsColumns");
    const removeColumns = settings.ARM_removeUselessAppealsColumns;

    const rows = document.querySelectorAll("tr");
    rows.forEach((row) => {
        const cells = row.querySelectorAll("td");

        // Set minimum required length based on column removal status
        const minLength = removeColumns ? 9 : 10;
        if (cells.length <= minLength) return; // Skip if not enough cells

        let classProblemColumnNumber = removeColumns ? 9 : 10;

        // Get cells with null checks
        const problemCell = cells[classProblemColumnNumber];
        const stageCell = cells[2];
        const warrantyCell = cells[5];

        // Only proceed if all required cells exist
        if (!problemCell || !stageCell || !warrantyCell) return;

        // Check if already highlighted
        if (
            problemCell.classList.contains("helper-highlighted") ||
            stageCell.classList.contains("helper-highlighted") ||
            warrantyCell.classList.contains("helper-highlighted")
        ) {
            clearInterval(intervalId);
            return;
        }

        // Highlight cells
        highlightText(stageCell);
        highlightText(problemCell);
        problemCell.classList += "helper-highlighted";

        highlightText(warrantyCell);
        warrantyCell.classList += "helper-highlighted";
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
