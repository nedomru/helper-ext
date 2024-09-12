if (document.URL.indexOf("genesys-app1") != -1) {
  const GENESYS_config = {
    GENESYS_hideUselessButtons: hideUselessButtons,
    GENESYS_showFastButtons: genesysButtons,
    GENESYS_showOCTPLineStatus: otpcLineStatus,
    GENESYS_hideChatHeader: hideHeader,
    GENESYS_showClientChannelOnCard: showClientChannelOnCard,
  };

  browser.storage.sync
    .get(Object.keys(GENESYS_config))
    .then((result) => {
      Object.keys(GENESYS_config).forEach((key) => {
        if (result[key]) {
          GENESYS_config[key]();
        }
      });
    })
    .catch((error) => {
      console.error("Ошибка при получении настроек:", error);
    });
}

function hideHeader() {
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Скрытие заголовка чата] Загружен модуль скрытия заголовков`
  );
  const observer = new MutationObserver(() => {
    const chatHeader = document.querySelector(".wwe-case-information-header");

    if (chatHeader) {
      if (!chatHeader.classList.contains("was-hidden-by-helper")) {
        if (chatHeader.getAttribute("aria-expanded") == "true") {
          chatHeader.click();
          chatHeader.classList.add("was-hidden-by-helper");
          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Скрытие заголовка чата] Хедер чата: скрыт`
          );
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function showClientChannelOnCard() {
  const observer = new MutationObserver(() => {
    const chatHeader = document.querySelector(".wwe-case-information-header");

    if (chatHeader) {
      if (!chatHeader.classList.contains("was-checked-by-helper")) {
        chatHeader.classList.add("was-checked-by-helper");

        const clientCardOSVersion = document.querySelector(
          "#wweCaseData1PhoneModelValue .wwe-data-text-value"
        );

        if (clientCardOSVersion) {
          chatHeader.innerText = `Информация о чате | Канал ${clientChannel.textContent}`;
        } else {
          const clientCardChannel = document.querySelector(
            "#wweCaseData1mediachannelValue .wwe-data-text-value"
          );
          if (clientCardChannel) {
            chatHeader.innerText = `Информация о чате | Канал ${clientCardChannel.textContent}`;
          } else chatHeader.innerText = `Информация о чате | Канал неизвестен`;
        }

        document.querySelector(
          ".wwe .wwe-case-information .wwe-case-information-header"
        ).style.color = "white";
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function hideUselessButtons() {
  const buttonsToRemove = [
    "Facebook In Progress",
    "Facebook Draft",
    "Twitter In Progress",
    "Twitter Draft",
  ];

  const observerOther = new MutationObserver(() => {
    const facebookButton = document.querySelector(
      `a[aria-label="Facebook In Progress"]`
    );

    if (facebookButton) {
      buttonsToRemove.forEach((button) => {
        const btn = document.querySelector(`a[aria-label="${button}"]`);
        if (btn) {
          btn.remove();
          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - ${button} удалена`
          );
        }
      });
      document.querySelector(".dropdown.account-help").remove();
      document.querySelector(".genesys-logo").remove();

      observerOther.disconnect();
      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Бесполезные кнопки] Все бесполезные кнопки удалены`
      );
    }
  });
}

function createGenesysLink(url, text) {
  const link = document.createElement("a");
  link.href = url;
  link.textContent = text;
  link.target = "_blank";
  link.className = "v-btn helper-specialist-button";
  link.style.cssText =
    "margin: 0 5px; padding: 5px 10px; border-radius: 4px; background-color: #403e3e; color: #fff; text-decoration: none;";

  link.addEventListener("mouseenter", () => {
    link.style.backgroundColor = "#595757"; // Темнее при наведении
  });
  link.addEventListener("mouseleave", () => {
    link.style.backgroundColor = "#403e3e"; // Возвращаем цвет при уходе
  });

  return link;
}

async function genesysButtons() {
  if (document.querySelector(".helper")) return;

  // Удаляем !important у border-radius для кнопок
  Array.from(document.styleSheets).forEach((styleSheet) => {
    const rules = styleSheet.cssRules || styleSheet.rules;
    if (!rules) return;

    Array.from(rules).forEach((rule) => {
      if (
        rule.selectorText ===
        ".wwe input, .wwe select, .wwe button, .wwe textarea"
      ) {
        rule.style.setProperty("border-radius", "0px", "");
      }
    });
  });

  const buttonsDiv = document.createElement("div");
  buttonsDiv.style.cssText =
    "display: flex; justify-content: center; align-items: center; height: 100%; margin-left: 15px;";

  const linksData = [
    {
      url: "http://cm.roool.ru",
      text: "ЧМ",
      key: "GENESYS_showFB_chatMaster",
    },
    {
      url: "https://dom.ru/service/knowledgebase/internet/kak-nastroit-router",
      text: "Роутеры",
      key: "GENESYS_showFB_setupRouter",
    },
    {
      url: "https://dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore",
      text: "ТВ",
      key: "GENESYS_showFB_setupTV",
    },
    {
      url: "https://dom.ru/service/knowledgebase/domru-tv/nastrojka-tv-pristavok",
      text: "Декодеры",
      key: "GENESYS_showFB_setupDecoder",
    },
    {
      url: "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/?C=M;O=D",
      text: "FTP ПК",
      key: "GENESYS_showFB_ftpPC",
    },
    {
      url: "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/?C=M;O=D",
      text: "FTP Моб",
      key: "GENESYS_showFB_ftpAndroid",
    },
    {
      url: "https://mh-dashboard-erth.proptech.ru/web",
      text: "Dashboard",
      key: "GENESYS_showFB_dashboard",
    },
    {
      url: "https://provisioning.ertelecom.ru/devices",
      text: "Провиж",
      key: "GENESYS_showFB_provisioning",
    },
  ];

  // Получение значений всех настроек
  const settingsKeys = linksData.map((link) => link.key);
  const settings = await Promise.all(
    settingsKeys.map((key) => browser.storage.sync.get(key))
  );

  linksData.forEach((linkData, index) => {
    if (settings[index][linkData.key]) {
      buttonsDiv.appendChild(createGenesysLink(linkData.url, linkData.text));
    }
  });

  const observer = new MutationObserver(() => {
    const lineHeader = document.getElementById("break_window");
    if (lineHeader) {
      lineHeader.parentNode.insertBefore(buttonsDiv, lineHeader.nextSibling);
      observer.disconnect(); // Отключаем наблюдателя после добавления кнопок

      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Быстрые кнопки] Добавлены быстрые кнопки`
      );
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function createGenesysLink(href, textContent, additionalStyles = {}) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.textContent = textContent;
  link.setAttribute("class", "helper");

  // Применение общих стилей
  Object.assign(link.style, {
    fontSize: "1rem",
    fontFamily: "Roboto, Tahoma, Verdana",
    textAlign: "center",
    color: "white",
    marginRight: "8px",
    cursor: "pointer",
    height: "28px",
    width: "100px",
    display: "flex", // Используем Flexbox для центрирования
    justifyContent: "center",
    alignItems: "center",
    lineHeight: "auto",
    backgroundColor: "#4c5961",
    border: "none", // Убираем границы, так как это ссылка
    borderRadius: "18px",
    textDecoration: "none", // Убираем подчеркивание
  });

  // Применение дополнительных стилей
  Object.assign(link.style, additionalStyles);

  link.addEventListener("mouseenter", () => {
    link.style.backgroundColor = "#63737d";
  });
  link.addEventListener("mouseleave", () => {
    link.style.backgroundColor = "#4c5961";
  });

  return link;
}

function otpcLineStatus() {
  const token = "7320250134:AAH1AMMMgO1oJxYBXJeXQu50cS9pROwTE2I";

  function getLineUpdate() {
    const genesysTitle = document.querySelector(".title");
    if (!genesysTitle) return;

    genesysTitle.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";

    fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=-1`)
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((jsonData) => {
        const result = jsonData.result;
        if (result.length > 0) {
          const currentStatus =
            result[0].channel_post.caption || result[0].channel_post.text;
          genesysTitle.textContent = `НЦК2: ${currentStatus}`;

          const isActive =
            currentStatus.includes("вкл") || currentStatus.includes("он");
          genesysTitle.style.color = isActive ? "#FF0000" : "#00FF00";

          const timeOfChange = new Date(result[0].channel_post.date * 1000);
          const formattedTime = timeOfChange.toTimeString().slice(0, 5);
          const titleForStatus = `${
            isActive ? "2+2 / 3+1\n" : "5+5 / 6+4\n"
          }Время изменения: ${formattedTime}`;
          genesysTitle.setAttribute("title", titleForStatus);
        } else {
          genesysTitle.textContent = "НЦК2: нет апдейтов";
          console.log(
            `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Аварийность] Изменений аварийности не найдено`
          );
        }
      })
      .catch((error) => {
        console.error(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Аварийность] Ошибка:`,
          error
        );
      });
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector(".title")) {
      getLineUpdate();
      observer.disconnect(); // Отключаем наблюдателя после первого срабатывания
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(getLineUpdate, 5000);

  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Аварийность] Загружена аварийность НЦК2`
  );
}
