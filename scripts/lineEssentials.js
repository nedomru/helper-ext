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
    LINE_showFastButtons: fastButtons,
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

function fastButtons() {
  if (document.querySelector(".helper-specialist-button") != null) {
    return;
  }
  if (document.querySelector(".helper") != null) {
    return;
  }

  let buttonsDiv = document.createElement("div");
  buttonsDiv.style.display = "flex";
  buttonsDiv.style.flexWrap = "wrap"; // Позволяет кнопкам переноситься на новую строку
  buttonsDiv.style.marginLeft = "20px";
  buttonsDiv.style.gap = "10px"; // Расстояние между кнопками

  const buttonData = [
    { text: "Jira", link: "https://ticket.ertelecom.ru" },
    { text: "Почта", link: "https://mail.domru.ru" },
    { text: "БЗ", link: "https://clever.ertelecom.ru" },
    { text: "ОКЦ", link: "https://okc.ertelecom.ru/stats/#octpNck" },
    { text: "НТП2", link: "https://okc.ertelecom.ru/stats/line_ts/ntp2/index" },
    { text: "Обеды", link: "https://okc2.ertelecom.ru/wfm/vueapp/day" },
    {
      text: "АРМ",
      link: "https://perm.db.ertelecom.ru/cgi-bin/ppo/excells/wcc_main.entry_continue",
    },
  ];

  buttonData.forEach((item) => {
    const button = document.createElement("a");
    button.textContent = item.text;
    button.setAttribute("href", item.link);
    button.setAttribute("target", "_blank");
    button.setAttribute("class", "v-btn helper-specialist-button");
    button.style.display = "flex";
    button.style.justifyContent = "center";
    button.style.alignItems = "center"; // Центрирование содержимого
    button.style.width = "75px"; // Исходная ширина кнопки
    button.style.height = "28px";
    button.style.backgroundColor = "#403e3e";
    button.style.borderRadius = "16px";
    button.style.textDecoration = "none";
    button.style.color = "inherit";

    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = "#595757";
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = "#403e3e";
    });

    buttonsDiv.appendChild(button);
  });

  const observer = new MutationObserver((mutations) => {
    const lineHeader = document.querySelector(".duty-app-block");
    if (lineHeader && !document.querySelector(".helper-specialist-button")) {
      lineHeader.parentNode.insertBefore(buttonsDiv, lineHeader.nextSibling);
      observer.disconnect(); // Отключаем наблюдателя после добавления кнопок
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Быстрые кнопки] Начато отслеживание изменения DOM`
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
  if (appointmentsTable) {
    const interval = setInterval(() => {
      const theme = document
        .querySelectorAll(".v-application.v-application--is-ltr")[0]
        .classList.contains("theme--dark")
        ? "dark"
        : "light";
      const rows = appointmentsTable.querySelectorAll("table tr");

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
          if (theme === "dark") {
            row.style.backgroundColor = "#1e1e1e";
          } else {
            row.style.backgroundColor = "#FFFFFF";
          }
        }
      });
      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Подсветка операторов] Подсветка обновлена`
      );
    }, 5000);
  }
  return () => clearInterval(interval);
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

function countAppointments() {
  setInterval(() => {
    const theme = document
      .querySelectorAll(".v-application.v-application--is-ltr")[0]
      .classList.contains("theme--dark")
      ? "dark"
      : "light";

    const table = document.evaluate(
      "/html/body/div/div[1]/main/div/div[2]/div[13]/div[4]/div/div[1]/div/div/div/div/div/div/div",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    var total = 0;
    total = table.querySelectorAll("tr").length - 1;

    var on_rsg_operators = 0;
    var on_project_operators = 0;
    var on_learning_operators = 0;

    const child = table.querySelectorAll("td");
    child.forEach((el) => {
      if (
        el.innerText == "Отсутствие на линии: Задачи от руководителя группы"
      ) {
        on_rsg_operators += 1;
      }
      if (el.innerText == "Отсутствие на линии: Проектная деятельность") {
        on_project_operators += 1;
      }
      if (el.innerText == "Отсутствие на линии: Обучение") {
        on_learning_operators += 1;
      }
    });

    // Находим элемент по XPath
    const button = document.evaluate(
      "/html/body/div/div/main/div/div[2]/div[13]/div[4]/div/div[1]/div/div/button",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    // Находим элемент span внутри button
    const chipElement = button.querySelector("span.v-chip__content");

    // Заменяем текст
    var new_text = `Всего: ${total}
    ${on_rsg_operators > 0 ? `| РСГ: ${on_rsg_operators}` : ""}
    ${on_project_operators > 0 ? `| Проекты: ${on_project_operators}` : ""}
    ${on_learning_operators > 0 ? `| Обучения: ${on_learning_operators}` : ""}`;

    chipElement.textContent = new_text;
    if (theme === "dark") {
      chipElement.style.color = "white";
    } else {
      chipElement.style.color = "black";
    }
  }, 5000);
}

function updateNeededSL() {
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Линия] - [Прогноз SL] Загружен модуль прогнозирования SL`
  );
  const url = `https://okc.ertelecom.ru/stats/genesys-reports/ntp/get-sl-forecast-report`;
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB");

  const options = {
    timeZone: "Asia/Yekaterinburg",
    hour: "2-digit",
    minute: "2-digit",
  };

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
        browser.storage.local.set({ LINE_updateNeededSL: false });
      });
  }
  getSL();
  var interval = setInterval(() => {
    getSL();
  }, 10000);
}
