if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
  copyAddress();
}

function copyTextToClipboard(text) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
  } catch (err) {
    console.error("Oops, unable to copy", err);
  }
  document.body.removeChild(textarea);
}

function copyAddress() {
  var address_text = document.getElementById("dr").textContent;
  if (!address_text) {
    address_text = document.getElementById("#dr").textContent;
  }

  // Проверка наличия индекса
  const postcode_regex = /\d{6}/;
  const match = address_text.match(postcode_regex);
  if (match) {
    const postalCode = match[0] + ", ";
    address_text = address_text.replace(postalCode, "");
  }

  // Поиск клетки Адрес для добавления кнопки
  const address = document.querySelector("#dr").previousElementSibling;
  var lineBreak = document.createElement("br");

  // Обманка АРМа, чтобы не думал, что это кнопка
  var copyButton = document.createElement("button");
  copyButton.textContent = "Копировать";
  copyButton.classList.add("btn", "btn-primary", "btn-sm"); // Добавляем классы для стилизации

  // Отслеживание кликов на кнопку для копирования текста
  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    address.removeChild(copyButton);
    copyTextToClipboard(address_text);
    $.notify("Адрес скопирован", "success");
    address.appendChild(copyButton);
  });

  address.appendChild(lineBreak);
  address.appendChild(copyButton);
}
