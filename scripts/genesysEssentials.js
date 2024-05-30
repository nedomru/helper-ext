if (document.URL.indexOf("genesys-app1") != -1) {
  genesysButtons();
  hideGenesysHelp();
  hideHeader();
}

function hideHeader() {
  // TODO добавить выборочное скрытие заголовков
  // TODO добавить включение/отключение опции в настройках
  setInterval(() => {
    var chatHeader = document.querySelector(".wwe-case-information-header");
    if (chatHeader.getAttribute("aria-expanded") == "true") {
      chatHeader.click();
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
  const chatMaster = createGenesysLink(
    "http://cm.roool.ru/",
    "ЧМ",
    { marginLeft: "20px" },
    true
  );

  const setupRouter = createGenesysLink(
    "https://interzet.dom.ru/service/knowledgebase/internet/kak-nastroit-router",
    "Роутеры"
  );

  const setupTV = createGenesysLink(
    "https://oren.dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore",
    "Телевизоры"
  );

  const setupDecoder = createGenesysLink(
    "https://perm.dom.ru/service/knowledgebase/domru-tv/nastrojka-tv-pristavok",
    "Приставки",
    {},
    true
  );

  const ftpPC = createGenesysLink(
    "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/",
    "FTP ПК"
  );

  const ftpMobile = createGenesysLink(
    "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/",
    "FTP Мобила"
  );

  const intervalId = setInterval(() => {
    const element = document.getElementById("break_window");
    if (element) {
      element.insertAdjacentElement("afterend", ftpMobile);
      element.insertAdjacentElement("afterend", ftpPC);
      element.insertAdjacentElement("afterend", setupDecoder);
      element.insertAdjacentElement("afterend", setupTV);
      element.insertAdjacentElement("afterend", setupRouter);
      element.insertAdjacentElement("afterend", chatMaster);
      clearInterval(intervalId);
    }
  }, 100);
}

function createGenesysLink(
  href,
  textContent,
  additionalStyles = {},
  borderRight = false
) {
  const link = document.createElement("a");
  link.href = href;
  link.target = "_blank";
  link.textContent = textContent;
  link.classList.add("ml-2", "d-inline-block", "align-middle");

  // Apply common styles
  Object.assign(link.style, {
    fontSize: "1rem",
    color: "white",
    lineHeight: "40px",
    marginRight: "10px",
    paddingRight: "10px",
    cursor: "pointer",
    additionalStyles,
  });

  if (borderRight) {
    link.style.borderRight = "1px solid white";
  }

  link.addEventListener("mouseenter", () => {
    link.style.color = "#ccc";
  });
  link.addEventListener("mouseleave", () => {
    link.style.color = "white";
  });

  return link;
}
