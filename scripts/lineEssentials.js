if (document.URL.indexOf("genesys-ntp") != -1) {
  dutyButtons();
  highlightOperators();
  getCurrentDuty();
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
  setInterval(function () {
    const child = document.querySelectorAll("td");
    child.forEach((el) => {
      // Проектная деятельность
      if (
        el.innerText.indexOf("Проектная деятельность") != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          "Проектная деятельность",
          "<span style='color: #7B68EE; font-weight:bold'>Проектная деятельность</span>"
        );
      }
      // Задачи от руководителя группы
      if (
        el.innerText.indexOf("Задачи от руководителя группы") != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          "Задачи от руководителя группы",
          "<span style='color: #228B22; font-weight:bold'>Задачи от руководителя группы</span>"
        );
      }
      // Обучение
      if (
        el.innerText.indexOf("Обучение") != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          "Обучение",
          "<span style='color: #66CDAA; font-weight:bold'>Обучение</span>"
        );
      }
    });
  });
}
