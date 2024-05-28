if (document.URL.indexOf("genesys-app1") != -1) {
  genesysButtons();
  hideGenesysButtons();
  hideHeader();
}

function hideHeader() {
  // FIXME не скрывается заголовок чата, скрипт не видит .wwe-case-information-header
  setTimeout(() => {
    var chatHeader = document.querySelector(".wwe-case-information-header");
    console.log("пук" + chatHeader);
    chatHeader.click();
  }, 1000);
}

function hideGenesysButtons() {
  const intervalId = setInterval(() => {
    const genesys_help = document.querySelector("li.dropdown.account-help");
    if (genesys_help) {
      genesys_help.remove();
      clearInterval(intervalId);
    }
  }, 100);
}

function genesysButtons() {
  // ЧатМастер
  const chatMaster = document.createElement("a");
  chatMaster.href = "http://cm.roool.ru/";
  chatMaster.target = "_blank";
  chatMaster.textContent = "ЧМ";
  chatMaster.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка ТВ, стили
  chatMaster.style.borderRight = "1px solid white";
  chatMaster.style.fontSize = "1rem";
  chatMaster.style.color = "white";
  chatMaster.style.lineHeight = "40px";
  chatMaster.style.marginLeft = "20px";
  chatMaster.style.marginRight = "10px";
  chatMaster.style.paddingRight = "10px";
  chatMaster.style.cursor = "pointer";
  chatMaster.addEventListener("mouseenter", () => {
    chatMaster.style.color = "#ccc";
  });
  chatMaster.addEventListener("mouseleave", () => {
    chatMaster.style.color = "white";
  });

  // ------------

  // Настройка роутеров
  const setupRouter = document.createElement("a");
  setupRouter.href =
    "https://interzet.dom.ru/service/knowledgebase/internet/kak-nastroit-router";
  setupRouter.target = "_blank";
  setupRouter.textContent = "Роутеры";

  // Настройка роутеров, стили
  setupRouter.classList.add("ml-2", "d-inline-block", "align-middle");
  setupRouter.style.fontSize = "1rem";
  setupRouter.style.color = "white";
  setupRouter.style.marginRight = "10px";
  setupRouter.style.paddingRight = "10px";
  setupRouter.style.cursor = "pointer";
  setupRouter.addEventListener("mouseenter", () => {
    setupRouter.style.color = "#ccc";
  });
  setupRouter.addEventListener("mouseleave", () => {
    setupRouter.style.color = "white";
  });

  // ------------

  // Настройка ТВ
  const setupTV = document.createElement("a");
  setupTV.href =
    "https://oren.dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore";
  setupTV.target = "_blank";
  setupTV.textContent = "Телевизоры";
  setupTV.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка ТВ, стили
  setupTV.style.fontSize = "1rem";
  setupTV.style.color = "white";
  setupTV.style.marginRight = "10px";
  setupTV.style.paddingRight = "10px";
  setupTV.style.cursor = "pointer";
  setupTV.addEventListener("mouseenter", () => {
    setupTV.style.color = "#ccc";
  });
  setupTV.addEventListener("mouseleave", () => {
    setupTV.style.color = "white";
  });

  // ------------

  // Настройка приставок
  const setupDecoder = document.createElement("a");
  setupDecoder.href =
    "https://perm.dom.ru/service/knowledgebase/domru-tv/nastrojka-tv-pristavok";
  setupDecoder.target = "_blank";
  setupDecoder.textContent = "Приставки";
  setupDecoder.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка приставок, стили
  setupDecoder.style.borderRight = "1px solid white";
  setupDecoder.style.fontSize = "1rem";
  setupDecoder.style.color = "white";
  setupDecoder.style.marginRight = "10px";
  setupDecoder.style.paddingRight = "10px";
  setupDecoder.style.cursor = "pointer";
  setupDecoder.addEventListener("mouseenter", () => {
    setupDecoder.style.color = "#ccc";
  });
  setupDecoder.addEventListener("mouseleave", () => {
    setupDecoder.style.color = "white";
  });

  // ------------

  // ftpPC
  const ftpPC = document.createElement("a");
  ftpPC.href = "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/";
  ftpPC.target = "_blank";
  ftpPC.textContent = "FTP ПК";
  ftpPC.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка ТВ, стили
  ftpPC.style.fontSize = "1rem";
  ftpPC.style.color = "white";
  ftpPC.style.marginRight = "10px";
  ftpPC.style.paddingRight = "10px";
  ftpPC.style.cursor = "pointer";
  ftpPC.addEventListener("mouseenter", () => {
    ftpPC.style.color = "#ccc";
  });
  ftpPC.addEventListener("mouseleave", () => {
    ftpPC.style.color = "white";
  });

  // ------------

  // ftpMobile
  const ftpMobile = document.createElement("a");
  ftpMobile.href =
    "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/";
  ftpMobile.target = "_blank";
  ftpMobile.textContent = "FTP Мобила";
  ftpMobile.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка ТВ, стили
  ftpMobile.style.fontSize = "1rem";
  ftpMobile.style.color = "white";
  ftpMobile.style.marginRight = "10px";
  ftpMobile.style.paddingRight = "10px";
  ftpMobile.style.cursor = "pointer";
  ftpMobile.addEventListener("mouseenter", () => {
    ftpMobile.style.color = "#ccc";
  });
  ftpMobile.addEventListener("mouseleave", () => {
    ftpMobile.style.color = "white";
  });

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
