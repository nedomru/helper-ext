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
  // Очередь бота вопросов
  const botLink = document.createElement("a");
  botLink.tabIndex = "0";
  botLink.href = "http://46.146.231.248/linenck";
  botLink.target = "_blank";
  botLink.role = "menuitem";
  botLink.id = "list-item-742";
  botLink.className = "v-list-item v-list-item--link theme--light";

  // Создаем иконку для бота вопросов
  const iconBotDiv = document.createElement("div");
  iconBotDiv.className = "v-list-item__icon";
  const iconBot = document.createElement("i");
  iconBot.setAttribute("aria-hidden", "true");
  iconBot.className = "v-icon notranslate mdi mdi-robot-outline theme--light";
  iconBotDiv.appendChild(iconBot);

  // Создаем текст для бота вопросов
  const titleBotDiv = document.createElement("div");
  titleBotDiv.className = "v-list-item__title";
  titleBotDiv.textContent = "Очередь вопросов";

  // Вставляем иконку и текст в новый <a>
  botLink.appendChild(iconBotDiv);
  botLink.appendChild(titleBotDiv);

  // Заглушки
  const stubLink = document.createElement("a");
  stubLink.tabIndex = "0";
  stubLink.href =
    "http://genesys-stat.cc1.ertelecom.ru:9090/gax/#/!/view:com.cm.details/101/CfgTransaction/CfgFolder:196/CfgTransaction:312/gax:options";
  stubLink.target = "_blank";
  stubLink.role = "menuitem";
  stubLink.id = "list-item-742";
  stubLink.className = "v-list-item v-list-item--link theme--light";

  // Создаем иконку для бота вопросов
  const iconStubDiv = document.createElement("div");
  iconStubDiv.className = "v-list-item__icon";
  const iconStub = document.createElement("i");
  iconStub.setAttribute("aria-hidden", "true");
  iconStub.className =
    "v-icon notranslate mdi mdi-alert-octagon-outline theme--light";
  iconStubDiv.appendChild(iconStub);

  // Создаем текст для бота вопросов
  const titleStubDiv = document.createElement("div");
  titleStubDiv.className = "v-list-item__title";
  titleStubDiv.textContent = "Заглушки";

  // Вставляем иконку и текст в новый <a>
  stubLink.appendChild(iconStubDiv);
  stubLink.appendChild(titleStubDiv);

  // Подтверждение назначений
  const appointmentLink = document.createElement("a");
  appointmentLink.tabIndex = "0";
  appointmentLink.href = "https://okc2.ertelecom.ru/wfm/offers/duty/nsk_stp";
  appointmentLink.target = "_blank";
  appointmentLink.role = "menuitem";
  appointmentLink.id = "list-item-742";
  appointmentLink.className = "v-list-item v-list-item--link theme--light";

  // Создаем иконку для бота вопросов
  const iconappointmentDiv = document.createElement("div");
  iconappointmentDiv.className = "v-list-item__icon";
  const iconappointment = document.createElement("i");
  iconappointment.setAttribute("aria-hidden", "true");
  iconappointment.className =
    "v-icon notranslate mdi mdi-account-multiple-outline theme--light";
  iconappointmentDiv.appendChild(iconappointment);

  // Создаем текст для бота вопросов
  const titleappointmentDiv = document.createElement("div");
  titleappointmentDiv.className = "v-list-item__title";
  titleappointmentDiv.textContent = "Назначения";

  // Вставляем иконку и текст в новый <a>
  appointmentLink.appendChild(iconappointmentDiv);
  appointmentLink.appendChild(titleappointmentDiv);

  // Создаем наблюдатель для изменений в DOM
  const observer = new MutationObserver((mutations, observer) => {
    // Пытаемся найти контейнер
    const container = document.querySelector(
      ".v-list.v-sheet.theme--light.v-list--dense"
    );

    // Если контейнер найден, выполняем действия и отключаем наблюдателя
    if (container) {
      container.appendChild(botLink);
      container.appendChild(stubLink);
      container.appendChild(appointmentLink);

      // Отключаем наблюдателя, так как нужный элемент уже найден
      observer.disconnect();
    }
  });

  // Настройки для наблюдателя: следить за всем деревом и за добавлением дочерних узлов
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function highlightOperators() {
  projects = "Проектная деятельность";
  rsg = "Задачи от руководителя группы";
  learning = "Обучение";
  help = "Помощь смежному отделу";

  setInterval(function () {
    const appointmentsTable = document.getElementsByClassName("bottom-row")[0];
    const rows = appointmentsTable.querySelectorAll("table tr");

    let isValueFound = false;
    rows.forEach((row) => {
      // Находим все ячейки в текущей строке
      const cells = row.querySelectorAll("td, th");
      // Подсветка кол-ва чатов у рсг+проектов+обучений
      try {
        cells.forEach((cell) => {
          // Проверяем, содержит ли ячейка нужный текст
          if (cell.innerText.includes(projects)) {
            row.style.backgroundColor = "#F7DCB9";
            isValueFound == true;
            throw new Error("Value found");
          } else if (cell.innerText.includes(rsg)) {
            row.style.backgroundColor = "#B3C8CF";
            isValueFound == true;
            throw new Error("Value found");
          } else if (cell.innerText.includes(learning)) {
            row.style.backgroundColor = "#EADBC8";
            isValueFound == true;
            throw new Error("Value found");
          } else if (cell.innerText.includes(help)) {
            row.style.backgroundColor = "#F3D0D7";
            isValueFound == true;
            throw new Error("Value found");
          } else {
            row.style.backgroundColor = "#FFFFFF";
          }
        });
      } catch (e) {
        if (e.message !== "Value found") {
          throw e;
        }
      }
      if (isValueFound) {
        return;
      }
    });
  });
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
