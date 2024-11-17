if (document.URL.indexOf("genesys-ntp") !== -1) {
  function getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
  }

  browser.storage.sync.set(
    { phpSessionId: getCookie("PHPSESSID") },
    function () {
      console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Генезис] - [Линия] - Сохранен текущий PHPSESSID`)
    }
  );

  const LINE_config = {
    LINE_showFB: fastButtons,
    LINE_highlightOperators: highlightOperators,
    LINE_dutyButtons: dutyButtons,
    LINE_updateNeededSL: updateNeededSL,
    LINE_countAppointments: countAppointments,
  };

  browser.storage.sync.get(Object.keys(LINE_config)).then((result) => {
    Object.keys(LINE_config).forEach((key) => {
      if (result[key]) {
        LINE_config[key]();
      }
    });
  });
}

// Добавление кнопок на линию
function dutyButtons() {
  if (document.querySelector(".helper-duty-button")) return;

  const linksData = [
    {
      id: "list-item-742",
      url: "http://46.146.231.248/linenck",
      icon: "mdi mdi-robot-outline",
      text: "Очередь вопросов",
    },
    {
      id: "list-item-742",
      url: "http://genesys-stat.cc1.ertelecom.ru:9090/gax/#/!/view:com.cm.details/101/CfgTransaction/CfgFolder:196/CfgTransaction:312/gax:options",
      icon: "mdi mdi-alert-octagon-outline",
      text: "Заглушки",
    },
    {
      id: "list-item-742",
      url: "https://okc2.ertelecom.ru/wfm/offers/duty/nsk_stp",
      icon: "mdi mdi-account-multiple-outline",
      text: "Предложка",
    },
    {
      id: "list-item-742",
      url: "https://okc.ertelecom.ru/stats/genesys-reports/ntp/sl-forecast",
      icon: "mdi mdi-chart-box-outline",
      text: "Прогноз SL",
    },
    {
      id: "list-item-742",
      url: "https://genesys.domru.ru/citystats/queue",
      icon: "mdi mdi-alien-outline",
      text: "ТС 2.0",
    },
    {
      id: "list-item-742",
      url: "http://genesys-stat.cc1.ertelecom.ru:9090/gax/?#/!/view:com.cm.home/101",
      icon: "mdi mdi-server-outline",
      text: "GAX",
    },
    {
      id: "list-item-742",
      url: "http://10.121.15.99/lenta",
      icon: "mdi mdi-chat-processing-outline",
      text: "Генератор ленты",
    },
  ];

  const buttons = linksData.map((linkData) =>
    createLinkTab(linkData.id, linkData.url, linkData.icon, linkData.text)
  );

  const observer = new MutationObserver(() => {
    const container = document.querySelector(
      ".v-menu__content.v-menu__content--fixed.menuable__content__active.elevation-3"
    );
    if (container) {
      const containerList = container.querySelector(
        ".v-list.v-sheet.v-list--dense"
      );
      if (containerList) {
        buttons.forEach((button) => {
          containerList.appendChild(button);
        });
        observer.disconnect(); // Отключаем наблюдатель после добавления кнопок

        console.log(
          `[${new Date().toLocaleTimeString()}] [Хелпер] - [Линия] - [Кнопки дежурных] Добавлены кнопки дежурного`
        );
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function fastButtons() {
  if (document.querySelector(".helper-specialist-button") != null) {
    return;
  }
  if (document.querySelector(".helper") != null) {
    return;
  }

  let buttonsDiv = document.createElement("div");
  buttonsDiv.style.display = "flex";
  buttonsDiv.style.marginLeft = "20px";

  const interval = setInterval(() => {
    let lineHeader = document.querySelector(".duty-app-block");
    if (lineHeader !== null) {
      lineHeader.parentNode.insertBefore(buttonsDiv, lineHeader.nextSibling);
      clearInterval(interval);
    }
  }, 1000);

  const settingsKeys = [
    "LINE_showFB_Mail",
    "LINE_showFB_Lunch",
    "LINE_showFB_OKC",
    "LINE_showFB_BZ",
    "LINE_showFB_ARM",
    "LINE_showFB_BreakNCK1",
    "LINE_showFB_BreakNCK2",
    "LINE_showFB_JIRA",
    "LINE_showFB_NTP1",
    "LINE_showFB_NTP2",
  ];

  // Получение значений всех настроек
  const settings = await Promise.all(
    settingsKeys.map((key) => browser.storage.sync.get(key))
  );

  const buttonData = [
    {
      text: "Почта",
      link: "https://mail.domru.ru",
      show: settings[0].LINE_showFB_Mail,
    },
    {
      text: "Обеды",
      link: "https://okc2.ertelecom.ru/wfm/vueapp/day",
      show: settings[1].LINE_showFB_Lunch,
    },
    {
      text: "ОКЦ",
      link: "https://okc.ertelecom.ru/stats/#octpNck",
      show: settings[2].LINE_showFB_OKC,
    },
    {
      text: "БЗ",
      link: "https://clever.ertelecom.ru",
      show: settings[3].LINE_showFB_BZ,
    },
    {
      text: "АРМ",
      link: "https://perm.db.ertelecom.ru/cgi-bin/ppo/excells/wcc_main.entry_continue",
      show: settings[4].LINE_showFB_ARM,
    },
    {
      text: "Перики",
      link: "https://okc.ertelecom.ru/stats/breaks/ntp-nck-one",
      show: settings[5].LINE_showFB_BreakNCK1,
    },
    {
      text: "Перики",
      link: "https://okc.ertelecom.ru/stats/breaks/ntp-nck-two",
      show: settings[6].LINE_showFB_BreakNCK2,
    },
    {
      text: "JIRA",
      link: "https://ticket.ertelecom.ru",
      show: settings[7].LINE_showFB_JIRA,
    },
    {
      text: "NTP1",
      link: "https://okc.ertelecom.ru/stats/line_ts/ntp1/index",
      show: settings[7].LINE_showFB_NTP1,
    },
    {
      text: "NTP2",
      link: "https://okc.ertelecom.ru/stats/line_ts/ntp2/index",
      show: settings[7].LINE_showFB_NTP2,
    },
  ];

  buttonData.forEach((item) => {
    if (item.show) {
      const button = document.createElement("a");
      button.textContent = item.text;
      button.setAttribute("href", item.link);
      button.setAttribute("target", "_blank");
      button.setAttribute("class", "v-btn helper-specialist-button");
      button.style.display = "flex";
      button.style.justifyContent = "center";
      button.style.alignItems = "center";
      button.style.width = "70px";
      button.style.height = "28px";
      button.style.backgroundColor = "#403e3e";
      button.style.borderRadius = "16px";
      button.style.marginRight = "8px";
      button.style.textDecoration = "none";
      button.style.color = "inherit";

      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "#595757";
      });
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "#403e3e";
      });

      buttonsDiv.appendChild(button);
    }
  });

  console.log(
    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Линия] - [Быстрые кнопки] Добавлены быстрые кнопки на линию`
  );
}

// Подсветка операторов с определенными классами на линии
function highlightOperators() {
  console.log(
      `[${new Date().toLocaleTimeString()}] [Хелпер] - [Линия] - [Подсветка операторов] Активирован модуль подсветки`
  );

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

    }, 100); // Debounce time
  };

  const observer = new MutationObserver((mutations) => {
    const tbody = appointmentsTable.querySelector("tbody");
    if (tbody) {
      highlightRows(tbody);
    }
  });

  // Start observing
  observer.observe(appointmentsTable, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Initial highlight
  const tbody = appointmentsTable.querySelector("tbody");
  if (tbody) {
    highlightRows(tbody);
  }

  return observer;
}

function createLinkTab(id, href, iconClass, textContent) {
  const link = document.createElement("a");
  const theme = document
    .querySelectorAll(".v-application.v-application--is-ltr")[0]
    .classList.contains("theme--dark")
    ? "dark"
    : "light";

  link.tabIndex = "0";
  link.href = href;
  link.target = "_blank";
  link.role = "menuitem";
  link.id = id;
  link.className =
    theme === "dark"
      ? "v-list-item v-list-item--link theme--dark"
      : "v-list-item v-list-item--link theme--light";

  const iconDiv = document.createElement("div");
  iconDiv.className = "v-list-item__icon";
  const icon = document.createElement("i");
  icon.setAttribute("aria-hidden", "true");
  // icon.color = theme === "dark" ? "white" : "black";
  icon.className = `v-icon helper-duty-button notranslate ${iconClass} ${
    theme === "dark" ? "theme--dark" : "theme--light"
  }`;
  iconDiv.appendChild(icon);

  const titleDiv = document.createElement("div");
  titleDiv.className = "v-list-item__title";
  titleDiv.textContent = textContent;

  link.appendChild(iconDiv);
  link.appendChild(titleDiv);

  return link;
}

function updateNeededSL() {
  const interval = setInterval(() => {
    getSL();
  }, 10000);
  console.log(
    `[${new Date().toLocaleTimeString()}] [Хелпер] - [Линия] - [Прогноз SL] Загружен модуль прогнозирования SL`
  );
  const url = `https://okc.ertelecom.ru/stats/genesys-reports/ntp/get-sl-forecast-report`;
  const now = new Date();

  const options = {
    timeZone: "Asia/Yekaterinburg",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const formattedDate = now
    .toLocaleDateString("en-GB", options)
    .replace(/\//g, ".");

  // Получаем текущее время
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Округляем время к ближайшим половинным часам
  if (minutes > 30) {
    hours++;
    minutes = "00";
  } else {
    minutes = "30";
  }

  // Форматируем числа, чтобы обеспечить двузначный формат времени
  hours = String(hours).padStart(2, "0");

  // Получаем округленное время в виде строки HH:30
  const roundedTime = hours + ":" + minutes;

  const element = document.querySelector(
    ".v-icon.header-stat-icon.mr-1.mdi.mdi-chart-line.grey--text.text--lighten-3"
  );

  function getSL() {
    fetch(url, {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `startDate=${formattedDate}`,
      method: "POST",
      mode: "cors",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        let half_time_data = data.halfHourReport.data.find(
            (obj) => obj.HALF_HOUR_TEXT === roundedTime
        );
        element.title = `Прогноз на ${half_time_data["HALF_HOUR_TEXT"]}

Прогнозный SL: ${data.daySl.SL}
Прогноз чатов: ${half_time_data["FORECAST_CHATS"]}
Разница людей: ${half_time_data["DIFF_USERS"]}
Нужно держать ${data.daySl.NeededSl} SL
Прогноз SL: ${half_time_data["FORECAST_SL"]}`;
        console.log(
          `[${new Date().toLocaleTimeString()}] [Хелпер] - [Линия] - [Прогноз SL] Обновлен прогноз SL`
        );
      })
      .catch((error) => {
        console.log(
          `[${new Date().toLocaleTimeString()}] [Хелпер] - [Линия] - [Прогноз SL] Ошибка: ${error}. Прогноз отключен.`
        );
        $.notify("Не удалось получить прогноз SL. Прогноз отключен.");
        clearInterval(interval);
        browser.storage.sync.set({ LINE_updateNeededSL: false });
      });
  }
  getSL();
}

function countAppointments() {
  console.log(
      `[${new Date().toLocaleTimeString()}] [Хелпер] - [Линия] - [Подсчет назначений] Активирован модуль подсчета`
  );

  const APPOINTMENT_TYPES = {
    RSG: "Отсутствие на линии: Задачи от руководителя группы",
    PROJECT: "Отсутствие на линии: Проектная деятельность",
    LEARNING: "Отсутствие на линии: Обучение",
    MENTORING: "Отсутствие на линии: Наставничество",
    OTHER: "Отсутствие на линии: Прочее"
  };

  const appointmentsTable = document.getElementsByClassName("bottom-row")[0];
  if (!appointmentsTable) {
    console.error("[Хелпер] - [Линия] Таблица не найдена");
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
        other: 0
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
          null
      ).singleNodeValue;

      if (!button) {
        console.error("[Хелпер] - [Линия] Кнопка для отображения счетчиков не найдена");
        return;
      }

      const chipElement = button.querySelector("span.v-chip__content");
      if (chipElement) {
        chipElement.textContent = [
          `Всего: ${counts.total}`,
          counts.rsg > 0 ? `| РСГ: ${counts.rsg}` : "",
          counts.project > 0 ? `| Проекты: ${counts.project}` : "",
          counts.learning > 0 ? `| Обучения: ${counts.learning}` : "",
          counts.mentoring > 0 ? `| Наставники: ${counts.mentoring}` : "",
          counts.other > 0 ? `| Прочее: ${counts.other}` : ""
        ].filter(Boolean).join(" ");
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
    characterData: true
  });

  // Initial count
  const tbody = appointmentsTable.querySelector("tbody");
  if (tbody) {
    updateCounts(tbody);
  }

  return observer;
}