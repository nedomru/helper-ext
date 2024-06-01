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
  highlightOperators();
  // tgLinkToDuty();
  // countGoToLine();
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

  const intervalId = setInterval(() => {
    const container = document.querySelector(
      ".v-list.v-sheet.theme--light.v-list--dense"
    );
    if (container) {
      container.appendChild(botLink);
      container.appendChild(stubLink);
      container.appendChild(appointmentLink);
      clearInterval(intervalId);
    }
  }, 1000);
}

// Подсветка операторов с определенными классами на линии
function highlightOperators() {
  const projects = "Проектная деятельность";
  const rsg = "Задачи от руководителя группы";
  const learning = "Обучение";
  const help = "Помощь смежному отделу";

  // Цвета для выделения
  const colorMap = {
    [projects]: "#F7DCB9",
    [rsg]: "#B3C8CF",
    [learning]: "#DFCCFB",
    [help]: "#F3D0D7",
  };

  const appointmentsTable = document.getElementsByClassName("bottom-row")[0];
  if (appointmentsTable) {
    const interval = setInterval(() => {
      const rows = appointmentsTable.querySelectorAll("table tr");

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td, th");
        let isValueFound = false;

        for (const key in colorMap) {
          for (let i = 0; i < cells.length; i++) {
            if (cells[i].textContent.includes(key)) {
              row.style.backgroundColor = colorMap[key];
              isValueFound = true;
              break;
            }
          }
          if (isValueFound) break;
        }

        if (!isValueFound) {
          row.style.backgroundColor = "#FFFFFF";
        }
      });
    }, 5000);
  }

  return () => clearInterval(interval);
}

function createLinkTab(id, href, iconClass, textContent) {
  const link = document.createElement("a");
  link.tabIndex = "0";
  link.href = href;
  link.target = "_blank";
  link.role = "menuitem";
  link.id = id;
  link.className = "v-list-item v-list-item--link theme--light";

  const iconDiv = document.createElement("div");
  iconDiv.className = "v-list-item__icon";
  const icon = document.createElement("i");
  icon.setAttribute("aria-hidden", "true");
  icon.className = `v-icon notranslate ${iconClass} theme--light`;
  iconDiv.appendChild(icon);

  const titleDiv = document.createElement("div");
  titleDiv.className = "v-list-item__title";
  titleDiv.textContent = textContent;

  link.appendChild(iconDiv);
  link.appendChild(titleDiv);

  return link;
}

/* function countGoToLine() {
  setInterval(() => {
    var on_rsg_operators = 0;
    var on_project_operators = 0;
    var on_learning_operators = 0;
    const child = document.querySelectorAll("td");
    child.forEach((el) => {
      // Проектная деятельность
      if (el.innerText == "Отсутствие на линии: Проектная деятельность") {
        on_project_operators += 1;
      }
      if (
        el.innerText == "Отсутствие на линии: Задачи от руководителя группы"
      ) {
        on_rsg_operators += 1;
      }
      if (el.innerText == "Отсутствие на линии: Обучение") {
        on_learning_operators += 1;
      }
    });

    number_of_operators = document.querySelector(
      ".ml-1 my-0 v-chip v-chip--outlined theme--light v-size--small primary lighten-1 primary--text text--lighten-1"
    );
    var on_project_operators_text = document.createTextNode(on_project_operators);
    var newSpan = document.createElement("span");
    newSpan.appendChild(on_project_operators_text);
    number_of_operators.parentNode.insertBefore(
      newSpan,
      number_of_operators.nextSibling
    );
    console.log("операторов в проектах: " + on_project_operators);
  }, 1000);


  // Добавляем новый span после целевого элемента
  element.parentNode.insertBefore(newSpan, element.nextSibling);
}
 */
