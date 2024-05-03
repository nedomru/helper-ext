if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1 &&
  document.URL.indexOf("genesys-app1") == -1
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
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.error("Oops, unable to copy", err);
  }
  document.body.removeChild(textarea);
}

function copyAddress() {
  const address_text = document.querySelector("#dr");
  const address = document.querySelector("#dr").previousElementSibling;
  var lineBreak = document.createElement("br");

  // Обманка АРМа, чтобы не думал, что это кнопка
  var copyButton = document.createElement("button");
  copyButton.textContent = "Копировать";
  copyButton.classList.add("btn", "btn-primary", "btn-sm"); // Добавляем классы для стилизации

  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    address.removeChild(copyButton);
    var text_to_copy = address_text.textContent;
    text_to_copy = text_to_copy.slice(6);
    copyTextToClipboard(text_to_copy.slice(2));
    $.notify("Адрес скопирован", "success");
    address.appendChild(copyButton);
  });

  address.appendChild(lineBreak);
  address.appendChild(copyButton);
}
