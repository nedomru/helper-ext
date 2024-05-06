/* Подсветка Контакт сорвался, Обращение из Email и ОЦТП - Входящая связь*/
var textToFind_cs = "Контакт сорвался";
var textToFind_email = "Обращение из Email";
var textToFind_octp = "ОЦТП - Входящая связь";

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
      // Контакт сорвался
      if (
        el.innerText.indexOf(textToFind_cs) != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          textToFind_cs,
          "<span style='color: red; font-weight:bold'>Контакт сорвался</span>"
        );
      }
      // Обращение из Email
      if (
        el.innerText.indexOf(textToFind_email) != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          textToFind_email,
          "<span style='color: darkgreen; font-weight:bold'>Обращение из Email</span>"
        );
      }
      // ОЦТП - Входящая связь
      if (
        el.innerText.indexOf(textToFind_octp) != -1 &&
        el.querySelector("span") == null
      ) {
        el.innerHTML = el.innerHTML.replace(
          textToFind_octp,
          "<span style='color: teal; font-weight:bold'>ОЦТП - Входящая связь</span>"
        );
      }
    });
  }
}, 1000);
