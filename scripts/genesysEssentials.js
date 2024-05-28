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
  // Настройка роутеров
  const setupRouter = document.createElement("a");
  setupRouter.href =
    "https://interzet.dom.ru/service/knowledgebase/internet/kak-nastroit-router";
  setupRouter.target = "_blank";
  setupRouter.textContent = "Настройка роутеров";

  // Настройка роутеров, стили
  setupRouter.classList.add("ml-2", "d-inline-block", "align-middle");
  setupRouter.style.fontSize = "1rem";
  setupRouter.style.color = "white";
  setupRouter.style.lineHeight = "40px";
  setupRouter.style.marginRight = "10px";
  setupRouter.style.paddingRight = "10px";

  // ------------

  // Настройка ТВ
  const setupTV = document.createElement("a");
  setupTV.href =
    "https://oren.dom.ru/faq/televidenie/kak-nastroit-cifrovye-kanaly-na-televizore";
  setupTV.target = "_blank";
  setupTV.textContent = "Настройка ТВ";
  setupTV.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка ТВ, стили
  setupTV.style.fontSize = "1rem";
  setupTV.style.color = "white";
  setupTV.style.marginRight = "10px";
  setupTV.style.paddingRight = "10px";

  // ftpMobile
  const ftpMobile = document.createElement("a");
  ftpMobile.href =
    "http://octptest.corp.ertelecom.loc/diagnostic-results/mobile/";
  ftpMobile.target = "_blank";
  ftpMobile.textContent = "FTP/ Мобила";
  ftpMobile.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка ТВ, стили
  ftpMobile.style.fontSize = "1rem";
  ftpMobile.style.color = "white";
  ftpMobile.style.marginRight = "10px";
  ftpMobile.style.paddingRight = "10px";

  // ftpPC
  const ftpPC = document.createElement("a");
  ftpPC.href = "http://octptest.corp.ertelecom.loc/diagnostic-results/perm/";
  ftpPC.target = "_blank";
  ftpPC.textContent = "FTP/ ПК";
  ftpPC.classList.add("ml-2", "d-inline-block", "align-middle");

  // Настройка ТВ, стили
  ftpPC.style.fontSize = "1rem";
  ftpPC.style.color = "white";
  ftpPC.style.marginRight = "10px";
  ftpPC.style.paddingRight = "10px";

  const intervalId = setInterval(() => {
    const element = document.getElementById("break_window");
    if (element) {
      element.insertAdjacentElement("afterend", ftpMobile);
      element.insertAdjacentElement("afterend", ftpPC);
      element.insertAdjacentElement("afterend", setupTV);
      element.insertAdjacentElement("afterend", setupRouter);
      clearInterval(intervalId);
    }
  }, 100);
}
