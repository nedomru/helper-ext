if (document.URL.indexOf("genesys-ntp") != -1) {
  const duty = [
    { name: "Хохлов Сергей Евгеньевич", link: "https://t.me/viijko" },
    { name: "Захарова Дарья Игоревна", link: "https://t.me/zakharovadi2" },
    { name: "Шуваева Мария Сергеевна", link: "https://t.me/mariahajime" },
    {
      name: "Мерионкова Екатерина Сергеевна",
      link: "https://t.me/ktmrnkv",
    },
    { name: "Чурсанова Дарья Алексеевна", link: "https://t.me/UtyugBB" },
    {
      name: "Беседнова Виктория Валерьевна",
      link: "https://t.me/vikabesednova",
    },
    {
      name: "Омельченко Артур Андреевич",
      link: "https://t.me/ArthurOmelchenko",
    },
  ];
  dutyButtons();
  lineButtons();
  highlightOperators();
  countAppointments();
}

// Добавление кнопок на линию
function dutyButtons() {
  const botLink = createLinkTab(
    "list-item-742",
    "http://46.146.231.248/linenck",
    "mdi mdi-robot-outline",
    "Очередь вопросов"
  );

  const stubLink = createLinkTab(
    "list-item-742",
    "http://genesys-stat.cc1.ertelecom.ru:9090/gax/#/!/view:com.cm.details/101/CfgTransaction/CfgFolder:196/CfgTransaction:312/gax:options",
    "mdi mdi-alert-octagon-outline",
    "Заглушки"
  );

  const appointmentLink = createLinkTab(
    "list-item-742",
    "https://okc2.ertelecom.ru/wfm/offers/duty/nsk_stp",
    "mdi mdi-account-multiple-outline",
    "Предложка"
  );

  const slForecastLink = createLinkTab(
    "list-item-742",
    "https://okc.ertelecom.ru/stats/genesys-reports/ntp/sl-forecast",
    "mdi mdi-chart-line",
    "Прогноз SL"
  );

  const intervalId = setInterval(() => {
    var container = document.querySelector(
      ".v-menu__content.v-menu__content--fixed.menuable__content__active.elevation-3"
    );
    container_list = container.querySelector(".v-list.v-sheet.v-list--dense");

    if (container_list) {
      container_list.appendChild(slForecastLink);
      container_list.appendChild(botLink);
      container_list.appendChild(stubLink);
      container_list.appendChild(appointmentLink);
      clearInterval(intervalId);
    }
  }, 1000);
}

function lineButtons() {
  let buttonsDiv = document.createElement("div");
  let lineHeader = document.querySelector(".v-toolbar__title");

  lineHeader.parentNode.insertBefore(buttonsDiv, lineHeader.nextSibling);

  // Задачи
  const jira = document.createElement("button");
  jira.textContent = "Jira";
  jira.type = "button";
  jira.classList.add("v-btn");
  jira.addEventListener("click", function () {
    window.open("https://ticket.ertelecom.ru/", "_blank");
  });
  jira.addEventListener("mouseenter", () => {
    jira.style.backgroundColor = "#595757";
  });
  jira.addEventListener("mouseleave", () => {
    jira.style.backgroundColor = "#403e3e";
  });

  // Почта
  const mail = document.createElement("button");
  mail.textContent = "Почта";
  mail.type = "button";
  mail.classList.add("v-btn");
  mail.addEventListener("click", function () {
    window.open("https://mail.domru.ru/", "_blank");
  });
  mail.addEventListener("mouseenter", () => {
    mail.style.backgroundColor = "#595757";
  });
  mail.addEventListener("mouseleave", () => {
    mail.style.backgroundColor = "#403e3e";
  });

  // Клевер
  const clever = document.createElement("button");
  clever.textContent = "БЗ";
  clever.type = "button";
  clever.classList.add("v-btn");
  clever.addEventListener("click", function () {
    window.open("https://clever.ertelecom.ru/", "_blank");
  });
  clever.addEventListener("mouseenter", () => {
    clever.style.backgroundColor = "#595757";
  });
  clever.addEventListener("mouseleave", () => {
    clever.style.backgroundColor = "#403e3e";
  });

  // ОКЦ
  const okc = document.createElement("button");
  okc.textContent = "ОКЦ";
  okc.type = "button";
  okc.classList.add("v-btn");
  okc.addEventListener("click", function () {
    window.open("https://okc.ertelecom.ru/stats/#octpNck", "_blank");
  });
  okc.addEventListener("mouseenter", () => {
    okc.style.backgroundColor = "#595757";
  });
  okc.addEventListener("mouseleave", () => {
    okc.style.backgroundColor = "#403e3e";
  });

  // НТП2
  const ntp = document.createElement("button");
  ntp.textContent = "НТП2";
  ntp.type = "button";
  ntp.classList.add("v-btn");
  ntp.addEventListener("click", function () {
    window.open("https://okc.ertelecom.ru/stats/line_ts/ntp2/index", "_blank");
  });
  ntp.addEventListener("mouseenter", () => {
    ntp.style.backgroundColor = "#595757";
  });
  ntp.addEventListener("mouseleave", () => {
    ntp.style.backgroundColor = "#403e3e";
  });

  // Обеды
  const wfm = document.createElement("button");
  wfm.textContent = "Обеды";
  wfm.type = "button";
  wfm.classList.add("v-btn");
  wfm.addEventListener("click", function () {
    window.open("https://okc2.ertelecom.ru/wfm/vueapp/day", "_blank");
  });
  wfm.addEventListener("mouseenter", () => {
    wfm.style.backgroundColor = "#595757";
  });
  wfm.addEventListener("mouseleave", () => {
    wfm.style.backgroundColor = "#403e3e";
  });

  // ARM
  const arm = document.createElement("button");
  arm.textContent = "АРМ";
  arm.type = "button";
  arm.classList.add("v-btn");
  arm.addEventListener("click", function () {
    window.open(
      "https://perm.db.ertelecom.ru/cgi-bin/ppo/excells/wcc_main.entry_continue",
      "_blank"
    );
  });
  arm.addEventListener("mouseenter", () => {
    arm.style.backgroundColor = "#595757";
  });
  arm.addEventListener("mouseleave", () => {
    arm.style.backgroundColor = "#403e3e";
  });

  buttonsDiv.style.marginLeft = "20px";

  jira.style.width = "75px";
  jira.style.height = "28px";
  jira.style.backgroundColor = "#403e3e";
  jira.style.marginRight = "8px";
  jira.style.borderRadius = "16px";

  mail.style.width = "75px";
  mail.style.height = "28px";
  mail.style.backgroundColor = "#403e3e";
  mail.style.marginRight = "8px";
  mail.style.borderRadius = "16px";

  wfm.style.width = "75px";
  wfm.style.height = "28px";
  wfm.style.backgroundColor = "#403e3e";
  wfm.style.marginRight = "8px";
  wfm.style.borderRadius = "16px";

  okc.style.width = "75px";
  okc.style.height = "28px";
  okc.style.backgroundColor = "#403e3e";
  okc.style.marginRight = "8px";
  okc.style.borderRadius = "16px";

  ntp.style.width = "75px";
  ntp.style.height = "28px";
  ntp.style.backgroundColor = "#403e3e";
  ntp.style.marginRight = "8px";
  ntp.style.borderRadius = "16px";

  arm.style.width = "75px";
  arm.style.height = "28px";
  arm.style.backgroundColor = "#403e3e";
  arm.style.borderRadius = "16px";
  arm.style.marginRight = "8px";

  clever.style.width = "75px";
  clever.style.height = "28px";
  clever.style.backgroundColor = "#403e3e";
  clever.style.marginRight = "8px";
  clever.style.borderRadius = "16px";

  buttonsDiv.appendChild(jira);
  buttonsDiv.appendChild(mail);
  buttonsDiv.appendChild(okc);
  buttonsDiv.appendChild(ntp);
  buttonsDiv.appendChild(wfm);
  buttonsDiv.appendChild(arm);
  buttonsDiv.appendChild(clever);
}

// Подсветка операторов с определенными классами на линии
function highlightOperators() {
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
  icon.color = theme === "dark" ? "white" : "black";
  icon.className = `v-icon notranslate ${iconClass}`;
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
