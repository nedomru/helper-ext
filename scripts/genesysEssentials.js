if (document.URL.indexOf("genesys-app1") != -1) {
  const GENESYS_config = {
    GENESYS_hideUselessButtons: hideUselessButtons,
    GENESYS_showFastButtons: genesysButtons,
    GENESYS_showOCTPLineStatus: otpcLineStatus,
    GENESYS_hideChatHeader: hideHeader,
  };
  //showClientInfoOnCard();

  browser.storage.local.get(Object.keys(GENESYS_config)).then((result) => {
    Object.keys(GENESYS_config).forEach((key) => {
      if (result[key]) {
        GENESYS_config[key]();
      }
    });
  });
}

function hideHeader() {
  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Скрытие заголовка чата] Загружен модуль скрытия заголовков`
  );
  setInterval(() => {
    var chatHeader = document.querySelector(".wwe-case-information-header");
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
  }, 1000);
}

// function showClientInfoOnCard() {
//   var interval = setInterval(() => {
//     var chatHeader = document.querySelector(".wwe-case-information-header");
//     if (chatHeader) {
//       if (!chatHeader.classList.contains("was-checked-by-helper")) {
//         chatHeader.classList.add("was-hidden-by-helper");
//         var clientChannel = document.querySelector(
//           "#wweCaseData1OSVersionValue .wwe-data-text-value"
//         ).textContent;
//         chatHeader.innerText = `Информация о чате | ${clientChannel}`;
//         document.querySelector(
//           ".wwe .wwe-case-information .wwe-case-information-header"
//         ).style.color = "white";
//         clearInterval(interval);
//       }
//     }
//   }, 1000);
// }

function hideUselessButtons() {
  const buttonsToRemove = [
    "Facebook In Progress",
    "Facebook Draft",
    "Twitter In Progress",
    "Twitter Draft",
  ];

  setTimeout(() => {
    const interval = setInterval(() => {
      try {
        buttonsToRemove.forEach((button) => {
          document
            .querySelector(`a[title=""][aria-label="${button}"]`)
            .remove();
        });
        document.querySelector(".dropdown.account-help").remove();
        document.querySelector(".genesys-logo").remove();
        document.querySelector(".wwe-dialer-view").remove();
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Бесполезные кнопки] Все бесполезные кнопки удалены`
        );
        clearInterval(interval);
      } catch (e) {
        console.log(
          `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Бесполезные кнопки] Не удалось удалить кнопку: ${e}`
        );
        clearInterval(interval);
      }
    }, 1000);
  }, 10000);
}

function genesysButtons() {
  if (document.querySelector(".helper") != null) {
    return;
  }
  // Удаляем !important у border-radius для округления кнопок
  var styleSheets = document.styleSheets;
  for (var i = 0; i < styleSheets.length; i++) {
    var rules = styleSheets[i].cssRules || styleSheets[i].rules;
    if (!rules) continue;

    for (var j = 0; j < rules.length; j++) {
      if (
        rules[j].selectorText ===
        ".wwe input, .wwe select, .wwe button, .wwe textarea"
      ) {
        // Убираем !important из стиля
        rules[j].style.borderRadius = "0px";
        rules[j].style.setProperty("border-radius", "0px", "");
      }
    }
  }

  let buttonsDiv = document.createElement("div");
  buttonsDiv.style.display = "flex";
  buttonsDiv.style.justifyContent = "center";
  buttonsDiv.style.alignItems = "center";
  buttonsDiv.style.height = "100%";
  buttonsDiv.style.marginLeft = "15px";

  const chatMaster = createGenesysLink("http://cm.roool.ru/", "ЧМ");

  const setupRouter = createGenesysLink(
    "https://dom.ru/service/knowledgebase/internet/kak-nastroit-router",
    "Роутеры"
  );

  const setupTV = createGenesysLink(
    "https://dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore",
    "ТВ"
  );

  const setupDecoder = createGenesysLink(
    "https://dom.ru/service/knowledgebase/domru-tv/nastrojka-tv-pristavok",
    "Декодеры"
  );

  const ftpPC = createGenesysLink(
    "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/?C=M;O=D",
    "FTP ПК"
  );

  const ftpMobile = createGenesysLink(
    "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/?C=M;O=D",
    "FTP Моб"
  );

  const intervalId = setInterval(() => {
    let lineHeader = document.getElementById("break_window");

    if (lineHeader) {
      lineHeader.parentNode.insertBefore(buttonsDiv, lineHeader.nextSibling);
      buttonsDiv.appendChild(chatMaster);
      buttonsDiv.appendChild(setupRouter);
      buttonsDiv.appendChild(setupDecoder);
      buttonsDiv.appendChild(setupTV);
      buttonsDiv.appendChild(ftpPC);
      buttonsDiv.appendChild(ftpMobile);
      clearInterval(intervalId);

      console.log(
        `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Быстрые кнопки] Добавлены быстрые кнопки`
      );
    }
  }, 3000);
}

function createGenesysLink(href, textContent, additionalStyles = {}) {
  const button = document.createElement("button");
  button.href = href;
  button.target = "_blank";
  button.textContent = textContent;
  button.setAttribute("class", "helper");

  // Применение общих стилей
  Object.assign(button.style, {
    fontSize: "1rem",
    fontFamily: "Roboto, Tahoma, Verdana",
    textAlign: "center",
    color: "white",
    marginRight: "8px",
    cursor: "pointer",
    height: "28px",
    width: "100px",
    lineHeight: "auto",
    backgroundColor: "#4c5961",
    border: "none",
    borderRadius: "18px",
    lineHeight: "20px",
    borderRadius: "18px",
    additionalStyles,
  });

  button.addEventListener("mouseenter", () => {
    button.style.backgroundColor = "#63737d";
  });
  button.addEventListener("mouseleave", () => {
    button.style.backgroundColor = "#4c5961";
  });
  button.addEventListener("click", function () {
    window.open(href, "_blank");
  });

  return button;
}

function otpcLineStatus() {
  const token = "7320250134:AAH1AMMMgO1oJxYBXJeXQu50cS9pROwTE2I";

  function getLineUpdate() {
    var genesysTitle = document.querySelector(".title");
    if (genesysTitle === null) {
      return;
    }
    genesysTitle.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.5)";
    fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=-1`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((jsonData) => {
        const result = jsonData.result;
        if (result.length > 0) {
          var current_status = result[0].channel_post.caption;
          if (current_status === undefined) {
            var current_status = result[0].channel_post.text;
          }

          var titleForStatus = "";
          genesysTitle.textContent = "НЦК2: " + current_status;
          if (current_status.includes("вкл") || current_status.includes("он")) {
            genesysTitle.style.color = "#FF0000";
            titleForStatus = "2+2 / 3+1\n";
          } else {
            genesysTitle.style.color = "#00FF00";
            titleForStatus = "5+5 / 6+4\n";
          }

          var time_of_change = new Date(result[0].channel_post.date * 1000);
          var hours = time_of_change.getHours();
          var minutes = time_of_change.getMinutes();

          if (hours < 10) {
            hours = "0" + hours;
          }

          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          titleForStatus += "Время изменения: " + hours + ":" + minutes;
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
  getLineUpdate();

  setInterval(() => {
    getLineUpdate();
  }, 5000);

  console.log(
    `[${new Date().toLocaleTimeString()}] [Помощник] - [Генезис] - [Аварийность] Загружена аварийность НЦК2`
  );
}
