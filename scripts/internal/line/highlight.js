// Подсветка операторов с определенными классами на линии
async function highlightOperators() {
    const STATUSES = {
        PROJECT: "Проектная деятельность",
        RSG: "Задачи от руководителя группы",
        LEARNING: "Обучение",
        HELP: "Помощь смежному отделу"
    };

    const COLOR_MAP = {
        light: {
            [STATUSES.PROJECT]: "#F7DCB9",
            [STATUSES.RSG]: "#B3C8CF",
            [STATUSES.LEARNING]: "#DFCCFB",
            [STATUSES.HELP]: "#F3D0D7",
        },
        dark: {
            [STATUSES.PROJECT]: "#5D6D7E",
            [STATUSES.RSG]: "#4C688B",
            [STATUSES.LEARNING]: "#75608E",
            [STATUSES.HELP]: "#82494A",
        },
    };

    const appointmentsTable = document.getElementsByClassName("bottom-row")[0];
    if (!appointmentsTable) {
        console.error("[Хелпер] - [Линия] Таблица не найдена");
        return;
    }

    let highlightTimeout = null;

    const highlightRows = (tbody) => {
        if (highlightTimeout) {
            clearTimeout(highlightTimeout);
        }

        highlightTimeout = setTimeout(() => {
            const theme = document
                .querySelector(".v-application.v-application--is-ltr")
                .classList.contains("theme--dark")
                ? "dark"
                : "light";

            const rows = tbody.querySelectorAll("tr");
            rows.forEach((row) => {
                const cells = row.querySelectorAll("td, th");
                let statusFound = false;

                for (const [status, color] of Object.entries(COLOR_MAP[theme])) {
                    for (const cell of cells) {
                        if (cell.textContent.includes(status)) {
                            row.style.backgroundColor = color;
                            statusFound = true;
                            break;
                        }
                    }
                    if (statusFound) break;
                }

                if (!statusFound) {
                    row.style.backgroundColor = theme === "dark" ? "#1e1e1e" : "#FFFFFF";
                }
            });

        }, 100);
    };

    const observer = new MutationObserver((mutations) => {
        const tbody = appointmentsTable.querySelector("tbody");
        if (tbody) {
            highlightRows(tbody);
        }
    });

    observer.observe(appointmentsTable, {
        childList: true,
        subtree: true,
        characterData: true
    });

    // Инициализация подсветки
    const tbody = appointmentsTable.querySelector("tbody");
    if (tbody) {
        highlightRows(tbody);
    }

    return observer;
}

// Подсветка близких к концу назначений
async function highlightEndingAppointments() {
    const THIRTY_MINUTES = 30 * 60 * 1000;
    let updateTimeout = null;
    let observer = null;

    const appointmentsTable = document.getElementsByClassName("bottom-row")[0];
    if (!appointmentsTable) {
        console.error("[Хелпер] - [Линия] Таблица не найдена");
        return;
    }

    // Cached date parsing function using a Map for memoization
    const dateCache = new Map();
    function parseDate(dateStr) {
        if (dateCache.has(dateStr)) {
            return dateCache.get(dateStr);
        }
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('.');
        const [hours, minutes] = timePart.split(':');
        const date = new Date(year, month - 1, day, hours, minutes);
        dateCache.set(dateStr, date);
        return date;
    }

    function updateHighlights(tbody) {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        updateTimeout = setTimeout(() => {
            if (!tbody) return;

            const currentTime = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg' }));
            const rows = tbody.getElementsByTagName('tr');

            for (let i = 0; i < rows.length; i++) {
                const endTimeCell = rows[i].cells[5];
                if (!endTimeCell) continue;

                const endTimeText = endTimeCell.textContent.trim();
                if (!endTimeText) continue;

                const endTime = parseDate(endTimeText);
                const timeUntilEnd = endTime - currentTime;

                const needsHighlight = timeUntilEnd > 0 && timeUntilEnd <= THIRTY_MINUTES;
                const isCurrentlyHighlighted = endTimeCell.style.fontWeight === '700';

                if (needsHighlight !== isCurrentlyHighlighted) {
                    endTimeCell.style.fontWeight = needsHighlight ? '700' : '';
                    endTimeCell.style.color = needsHighlight ? '#c2a94e' : '';
                }
            }
        }, 100);
    }

    // Use more specific mutation observer configuration
    observer = new MutationObserver((mutations) => {
        const tbody = appointmentsTable.querySelector('tbody');
        if (tbody && mutations.some(mutation =>
            mutation.type === 'childList' ||
            (mutation.type === 'characterData' && mutation.target.parentNode?.closest('td')?.cellIndex === 5)
        )) {
            updateHighlights(tbody);
        }
    });

    observer.observe(appointmentsTable, {
        childList: true,
        subtree: true,
        characterData: true
    });

    const tbody = appointmentsTable.querySelector('tbody');
    if (tbody) {
        updateHighlights(tbody);
    }

    setInterval(() => {
        const tbody = appointmentsTable.querySelector('tbody');
        if (tbody) {
            updateHighlights(tbody);
        }
    }, 60000);
}