// Функция для подсветки текста
function highlightText(element) {
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

  let text = element.innerText;

  // Проверка наличия текста "гарантийный срок до" и даты
  let dateRegex = /\d{2}\.\d{2}\.\d{4}/; // Регулярное выражение для поиска даты в формате dd.mm.yyyy
  let match = text.match(dateRegex);
  if (text.includes("гарантийный срок до") && match) {
    let date = new Date(match[0].split(".").reverse().join("-")); // Преобразование даты в формат 'yyyy-mm-dd'
    let currentDate = new Date();
    if (date > currentDate) {
      element.innerHTML = text.replace(
        match[0],
        `<span style='color: green; font-weight: bold'>${match[0]}</span>`
      );
    } else {
      element.innerHTML = text.replace(
        match[0],
        `<span style='color: red; font-weight: bold'>${match[0]}</span>`
      );
    }
  }

  // Проверка других условий выделения текста
  if (text.includes(textToFind_cs)) {
    element.innerHTML = text.replace(
      textToFind_cs,
      `<span style='color: ${colors.cs}; font-weight: bold'>${textToFind_cs}</span>`
    );
  }

  if (text.includes(textToFind_email)) {
    element.innerHTML = text.replace(
      textToFind_email,
      `<span style='color: ${colors.email}; font-weight: bold'>${textToFind_email}</span>`
    );
  }

  if (text.includes(textToFind_octp)) {
    element.innerHTML = text.replace(
      textToFind_octp,
      `<span style='color: ${colors.octp}; font-weight: bold'>${textToFind_octp}</span>`
    );
  }
}

// Проверка и подсветка на другой странице
if (document.URL.includes("wcc_request_appl_support.change_request_appl")) {
  const block = document.getElementsByClassName("col-sm-9");
  if (block.length > 0) {
    block[0].innerHTML = block[0].innerHTML.replace(
      new RegExp(textToFind_cs, "gi"),
      `<font style='color: ${colors.cs}; font-weight:bold'>${textToFind_cs}</font>`
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
      highlightText(cell);
    });
  }
}, 1000);
