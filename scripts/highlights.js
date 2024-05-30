// Классы для поиска
const textToFind_cs = "Контакт сорвался";
const textToFind_email = "Обращение из Email";
const textToFind_octp = "ОЦТП - Входящая связь";

// Цвета для подсветки
const colors = {
  cs: "red",
  email: "darkgreen",
  octp: "teal",
};

// Функция для подсветки текста
function highlightText(element, searchText, color, text) {
  if (
    element.innerText.includes(searchText) &&
    !element.querySelector("span")
  ) {
    element.innerHTML = element.innerHTML.replace(
      searchText,
      `<span style='color: ${color}; font-weight: bold'>${text}</span>`
    );
  }
}

// Проверка и подсветка на другой странице
if (document.URL.includes("wcc_request_appl_support.change_request_appl")) {
  const block = document.getElementsByClassName("col-sm-9");
  if (block.length > 0) {
    block[0].innerHTML = block[0].innerHTML.replace(
      new RegExp(textToFind_cs, "gi"),
      `<font style='color:rgb(255, 0, 0); font-weight:bold'>${textToFind_cs}</font>`
    );
  }
}

// Интервал для регулярной проверки и подсветки текста
setInterval(function () {
  if (
    document.URL.includes("db.ertelecom.ru/cgi-bin") &&
    !document.URL.includes("wcc_request_appl_support.change_request_appl")
  ) {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      highlightText(cell, textToFind_cs, colors.cs, textToFind_cs);
      highlightText(cell, textToFind_email, colors.email, textToFind_email);
      highlightText(cell, textToFind_octp, colors.octp, textToFind_octp);
    });
  }
}, 1000);
