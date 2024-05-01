if (
  document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
) {
  const address = document.querySelector("#dr");

  const copyButton = document.createElement("button");
  copyButton.textContent = "Копировать";
  copyButton.style.marginLeft = "5px"; // Add some margin to the button for spacing

  copyButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    // Create a temporary textarea to copy the text
    console.log(address.textContent);
    const text_to_copy = address.textContent;
    navigator.clipboard.writeText(text_to_copy);
  });
  address.appendChild(copyButton);
}
