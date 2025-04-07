// Отображения
async function countAppointments() {
  const APPOINTMENT_TYPES = {
    RSG: "Отсутствие на линии: Задачи от руководителя группы",
    PROJECT: "Отсутствие на линии: Проектная деятельность",
    LEARNING: "Отсутствие на линии: Обучение",
    MENTORING: "Отсутствие на линии: Наставничество",
    OTHER: "Отсутствие на линии: Прочее",
  };

  const appointmentsTable = document.getElementsByClassName("bottom-row")[0];
  if (!appointmentsTable) {
    error("[Хелпер] - [Линия] Таблица не найдена");
    return;
  }

  let updateTimeout = null;

  const updateCounts = (tbody) => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    updateTimeout = setTimeout(() => {
      const counts = {
        total: tbody.querySelectorAll("tr").length - 1, // Subtract header row
        rsg: 0,
        project: 0,
        learning: 0,
        mentoring: 0,
        other: 0,
      };

      const cells = tbody.querySelectorAll("td");
      cells.forEach((cell) => {
        const text = cell.innerText;
        if (text === APPOINTMENT_TYPES.RSG) counts.rsg++;
        if (text === APPOINTMENT_TYPES.PROJECT) counts.project++;
        if (text === APPOINTMENT_TYPES.LEARNING) counts.learning++;
        if (text === APPOINTMENT_TYPES.MENTORING) counts.mentoring++;
        if (text === APPOINTMENT_TYPES.OTHER) counts.other++;
      });

      const button = document.evaluate(
        "/html/body/div/div/main/div/div[2]/div[13]/div[4]/div/div[1]/div/div/button",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;

      if (!button) {
        error(
          "[Хелпер] - [Линия] Кнопка для отображения счетчиков не найдена",
        );
        return;
      }

      const chipElement = button.querySelector("span.v-chip__content");
      if (chipElement) {
        chipElement.textContent = [
          `Всего: ${counts.total + 1} `,
          counts.rsg > 0 ? `| РСГ: ${counts.rsg}` : "",
          counts.project > 0 ? `| Проекты: ${counts.project}` : "",
          counts.learning > 0 ? `| Обучения: ${counts.learning}` : "",
          counts.mentoring > 0 ? `| Наставники: ${counts.mentoring}` : "",
          counts.other > 0 ? `| Прочее: ${counts.other}` : "",
        ]
          .filter(Boolean)
          .join(" ");
      }
    }, 100); // Debounce time
  };

  const observer = new MutationObserver((mutations) => {
    const tbody = appointmentsTable.querySelector("tbody");
    if (tbody) {
      updateCounts(tbody);
    }
  });

  // Start observing
  observer.observe(appointmentsTable, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Initial count
  const tbody = appointmentsTable.querySelector("tbody");
  if (tbody) {
    updateCounts(tbody);
  }

  return observer;
}
