if (document.URL.indexOf("genesys-ntp") != -1) {
  const duty = [
    { name: "Хохлов Сергей Евгеньевич", link: "https://t.me/viijko" },
    { name: "Захарова Дарья Игоревна", link: "https://t.me/zakharovadi2" },
    { name: "Шуваева Мария Сергеевна", link: "https://t.me/mariahajime" },
    { name: "Мерионкова Екатерина Сергеевна", link: "https://t.me/ktmrnkv" },
    { name: "Чурсанова Дарья Алексеевна", link: "https://t.me/UtyugBB" },
    {
      name: "Беседнова Виктория Валерьевна",
      link: "https://t.me/vikabesednova",
    },
    {
      name: "Омельченко Артур Андреевич",
      link: "https://t.me/ArthurOmelchenko",
    },
    {
      name: "Мелехина Валерия Анатольевна",
      link: "https://t.me/leramegera",
    },
    {
      name: "Белявский Артем Игоревич",
      link: "https://t.me/artem_allo",
    },
  ];

  const LINE_config = {
    LINE_showFB: fastButtons,
    LINE_highlightOperators: highlightOperators,
    LINE_dutyButtons: dutyButtons,
    LINE_updateNeededSL: updateNeededSL,
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
          `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Кнопки дежурных] Добавлены кнопки дежурного`
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
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Быстрые кнопки] Добавлены быстрые кнопки на линию`
  );
}

// Подсветка операторов с определенными классами на линии
function highlightOperators() {
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Подсветка операторов] Активирован модуль подсветки`
  );

  const projects = "Проектная деятельность";
  const rsg = "Задачи от руководителя группы";
  const learning = "Обучение";
  const help = "Помощь смежному отделу";

  // Цвета для выделения
  const colorMap = {
    light: {
      [projects]: "#F7DCB9",
      [rsg]: "#B3C8CF",
      [learning]: "#DFCCFB",
      [help]: "#F3D0D7",
    },
    dark: {
      [projects]: "#5D6D7E",
      [rsg]: "#4C688B",
      [learning]: "#75608E",
      [help]: "#82494A",
    },
  };

  const appointmentsTable = document.getElementsByClassName("bottom-row")[0];

  if (!appointmentsTable) {
    console.error("Таблица не найдена.");
    return;
  }

  // Функция подсветки строк
  const highlightRows = (tbody) => {
    const theme = document
      .querySelector(".v-application.v-application--is-ltr")
      .classList.contains("theme--dark")
      ? "dark"
      : "light";
    const rows = tbody.querySelectorAll("tr");

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td, th");
      let isValueFound = false;

      for (const key in colorMap[theme]) {
        for (let i = 0; i < cells.length; i++) {
          if (cells[i].textContent.includes(key)) {
            row.style.backgroundColor = colorMap[theme][key];
            isValueFound = true;
            break;
          }
        }
        if (isValueFound) break;
      }

      if (!isValueFound) {
        row.style.backgroundColor = theme === "dark" ? "#1e1e1e" : "#FFFFFF";
      }
    });
    console.log(
      `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Подсветка операторов] Подсветка обновлена`
    );
  };

  // Создаем наблюдатель для отслеживания появления tbody
  const observer = new MutationObserver(() => {
    const tbody = appointmentsTable.querySelector("tbody");
    if (tbody) {
      // Останавливаем наблюдение, когда tbody найден
      observer.disconnect();

      // Начальная подсветка
      highlightRows(tbody);

      // Создаем новый наблюдатель для отслеживания изменений только в tbody
      const tbodyObserver = new MutationObserver(() => {
        highlightRows(tbody);
      });

      // Настраиваем наблюдение за дочерними элементами в tbody
      tbodyObserver.observe(tbody, { childList: true, subtree: true });
    }
  });

  // Настраиваем наблюдение за элементами внутри таблицы
  observer.observe(appointmentsTable, { childList: true, subtree: true });
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
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Прогноз SL] Загружен модуль прогнозирования SL`
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

  console.log(formattedDate);
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
        half_time_data = data.halfHourReport.data.find(
          (obj) => obj.HALF_HOUR_TEXT === roundedTime
        );
        const title_to_display = `Прогноз на ${half_time_data["HALF_HOUR_TEXT"]}

Прогнозный SL: ${data.daySl.SL}
Прогноз чатов: ${half_time_data["FORECAST_CHATS"]}
Разница людей: ${half_time_data["DIFF_USERS"]}
Нужно держать ${data.daySl.NeededSl} SL
Прогноз SL: ${half_time_data["FORECAST_SL"]}`;
        element.title = title_to_display;
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Прогноз SL] Обновлен прогноз SL`
        );
      })
      .catch((error) => {
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Прогноз SL] Ошибка: ${error}. Прогноз отключен.`
        );
        $.notify("Не удалось получить прогноз SL. Прогноз отключен.");
        clearInterval(interval);
        browser.storage.sync.set({ LINE_updateNeededSL: false });
      });
  }
  getSL();
  var interval = setInterval(() => {
    getSL();
  }, 10000);
}
