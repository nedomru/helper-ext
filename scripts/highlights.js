let dataToHighlight = {};

// Функция для получения значения цвета из color picker
function getHighlightColors(callback) {
  browser.storage.sync
    .get([
      "HIGHLIGHTER_CS",
      "HIGHLIGHTER_EMAIL",
      "HIGHLIGHTER_OCTP",
      "HIGHLIGHTER_COMPENSATION",
    ])
    .then((settings) => {
      dataToHighlight = {
        "Контакт сорвался": settings.HIGHLIGHTER_CS || "#ff0000",
        "Обращение из Email": settings.HIGHLIGHTER_EMAIL || "#006400",
        "ОЦТП - Входящая связь": settings.HIGHLIGHTER_OCTP || "#008080",
        "Компенсация за аварию": settings.HIGHLIGHTER_COMPENSATION || "#008080",
      };
      console.log(dataToHighlight);
      if (callback) callback(); // вызываем callback после загрузки данных
    })
    .catch((error) => {
      console.error("Ошибка при получении цветов:", error);
    });
}

function highlightText(element) {
  let text = element.innerText;

  Object.entries(dataToHighlight).forEach(([textToFind, color]) => {
    if (text.includes(textToFind)) {
      const span = document.createElement("span");
      span.style.color = color;
      span.style.fontWeight = "bold";
      span.textContent = textToFind;
      element.innerHTML = text.replace(textToFind, span.outerHTML);
    }
  });

  let dateRegex = /\d{2}\.\d{2}\.\d{4}/;
  let match = text.match(dateRegex);
  if (text.includes("гарантийный срок до") && match) {
    let date = new Date(match[0].split(".").reverse().join("-"));
    let currentDate = new Date();

    let span = document.createElement("span");
    span.style.color = date > currentDate ? "green" : "red";
    span.style.fontWeight = "bold";
    span.textContent = match[0];
    element.innerHTML = text.replace(match[0], span.outerHTML);
  }
}

function highlightCells() {
  const frameSrc = "wcc2_main.frame_left_reasons";
  if (
    document.URL.includes("db.ertelecom.ru/cgi-bin") &&
    !document.URL.includes("wcc_request_appl_support.change_request_appl") &&
    !document.URL.includes(frameSrc)
  ) {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      highlightText(cell);
    });
  }
}

let intervalId = setInterval(highlightCells, 1000);

// Дополнительная функция для обработки других страниц
function handleOtherPages() {
  if (document.URL.includes("wcc_request_appl_support.change_request_appl")) {
    const block = document.querySelector(".col-sm-9");
    if (block) {
      block.innerHTML = block.innerHTML.replaceAll(
        "Контакт сорвался",
        "<font style='color: red; font-weight:bold'>Контакт сорвался</font>"
      );
    }
  } else if (
    document.URL.includes(
      "db.ertelecom.ru/cgi-bin/ppo/excells/adv_act_retention"
    )
  ) {
    const cells = document.querySelectorAll("th");
    cells.forEach((cell) => {
      if (cell.innerText === "Компенсация за аварию") {
        cell.style.color = "black";
        cell.style.backgroundColor = "white";
        const tdCell = cell.parentElement.querySelector("td");
        tdCell.style.color = "black";
        tdCell.style.backgroundColor = "white";
      }
    });
  }
}

// Вызов функции и передача коллбэка
getHighlightColors(() => {
  // Запуск обработки после получения цветов
  highlightCells(); // это можно вызывать один раз вместо intervalId
  setInterval(highlightCells, 1000); // если необходимо продолжать
});

// Вызываем обработчик для других страниц сразу
handleOtherPages();
