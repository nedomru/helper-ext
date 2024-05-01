if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
  const address = document.querySelector("#dr");
  var lineBreak = document.createElement("br");

  // Обманка АРМа, чтобы не думал, что это кнопка
  var copyButton = document.createElement("button");
  copyButton.textContent = "Копировать";
  copyButton.classList.add("btn", "btn-outline-warning", "btn-sm"); // Добавляем классы для стилизации

  copyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    address.removeChild(copyButton);
    var text_to_copy = address.textContent;
    text_to_copy = text_to_copy.slice(6);
    navigator.clipboard.writeText(text_to_copy.slice(2));
    address.appendChild(copyButton);
  });

  address.appendChild(lineBreak);
  address.appendChild(copyButton);
}
