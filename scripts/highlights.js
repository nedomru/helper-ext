const dataToHighlight = {
  "Контакт сорвался": "red",
  "Обращение из Email": "darkgreen",
  "ОЦТП - Входящая связь": "teal",
  "Компенсация за аварию": "teal",
};

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
  if (
    document.URL.includes("db.ertelecom.ru/cgi-bin") &&
    !document.URL.includes("wcc_request_appl_support.change_request_appl")
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

handleOtherPages();
