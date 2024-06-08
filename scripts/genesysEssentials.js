if (document.URL.indexOf("genesys-app1") != -1) {
  genesysButtons();
  hideGenesysHelp();

  /* if (navigator.userAgent.includes("Chrome") == false) {
    browser.storage.local.get(["hideHeader"]).then((result) => {
      if (result.hideHeader == true) {
        hideHeader();
      }
    });
  } else {
    chrome.storage.local.get(["hideHeader"], function (result) {
      if (result.hideHeader == true) {
        hideHeader();
      }
    });
  } */
}

function hideHeader() {
  // TODO добавить выборочное скрытие заголовков
  // TODO добавить включение/отключение опции в настройках
  setInterval(() => {
    var chatHeader = document.querySelector(".wwe-case-information-header");
    if (chatHeader) {
      console.log("Хедер: найден");
      if (chatHeader.getAttribute("aria-expanded") == "true") {
        chatHeader.click();
        console.log("Хедер: скрыт");
      }
    } else {
      console.log("Хедер: не найден");
    }
  }, 1000);
}

function hideGenesysHelp() {
  const intervalId = setInterval(() => {
    const genesys_help = document.querySelector("li.dropdown.account-help");
    if (genesys_help) {
      genesys_help.remove();
      clearInterval(intervalId);
    }
  }, 1000);
}

function genesysButtons() {
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

    lineHeader.parentNode.insertBefore(buttonsDiv, lineHeader.nextSibling);
    if (lineHeader) {
      buttonsDiv.appendChild(chatMaster);
      buttonsDiv.appendChild(setupRouter);
      buttonsDiv.appendChild(setupDecoder);
      buttonsDiv.appendChild(setupTV);
      buttonsDiv.appendChild(ftpPC);
      buttonsDiv.appendChild(ftpMobile);
      clearInterval(intervalId);
    }
  }, 3000);
}

function createGenesysLink(href, textContent, additionalStyles = {}) {
  const button = document.createElement("button");
  button.href = href;
  button.target = "_blank";
  button.textContent = textContent;

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
