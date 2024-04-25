/* Подсветка Контакт сорвался, Обращение из Email*/
var textToFind_cs = "Контакт сорвался";
var textToFind_email = "Обращение из Email";

if (
  document.URL.indexOf("wcc_request_appl_support.change_request_appl") != -1
) {
  let block = document.getElementsByClassName("col-sm-9");
  block[0].innerHTML = block[0].innerHTML.replace(
    eval("/" + textToFind_cs + "/gi"),
    "<font style='color:rgb(255, 0, 0); font-weight:bold'>" +
      textToFind_cs +
      "</font>"
  );
}

setInterval(function () {
  if (
    document.URL.indexOf("db.ertelecom.ru/cgi-bin") != -1 &&
    document.URL.indexOf("wcc_request_appl_support.change_request_appl") == -1
  ) {
    const child = document.querySelectorAll("td");
    child.forEach((el) => {
      if (
        el.innerText.indexOf(textToFind_cs) != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          textToFind_cs,
          "<span style='color: red; font-weight:bold'>Контакт сорвался</span>"
        );
      }
      if (
        el.innerText.indexOf(textToFind_email) != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          textToFind_email,
          "<span style='color: red; font-weight:bold'>Обращение из Email</span>"
        );
      }
    });
  }
}, 1000);
