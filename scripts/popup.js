document.addEventListener("DOMContentLoaded", function () {
  const form_mac = document.getElementById("form-mac");
  const form_link = document.getElementById("form-link");
  const form_ip = document.getElementById("form-ip");
  const search_provider = document.getElementById("searchProvider");
  const search_router = document.getElementById("searchRouter");
  form_mac.addEventListener("submit", handleFormSubmitMac);
  form_link.addEventListener("submit", handleFormSubmitLink);
  form_ip.addEventListener("submit", handleFormSubmitIP);
  search_provider.addEventListener("input", searchProvider);
  search_router.addEventListener("input", searchRouter);
  document
    .getElementById("openSettings")
    .addEventListener("click", function () {
      browser.runtime.openOptionsPage();
    });
  document
    .getElementById("openTelegram")
    .addEventListener("click", function () {
      window.open("https://t.me/nedomru", "_blank");
    });
});

async function handleFormSubmitMac(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const inputField = formData.get("input-mac").trim();
  const mac_regex = new RegExp("^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$");

  // Проверка корректности ввода MAC адреса
  if (mac_regex.test(inputField) == false) {
    $.notify("Это не MAC", "error");
    return;
  }

  $.notify("Проверяю", "info");
  try {
    const response = await fetch(
      `https://api.maclookup.app/v2/macs/${inputField}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status != 200) {
      $.notify("Не удалось найти", "error");
      return;
    }

    const result = await response.json();
    console.log(result);

    // Assuming the API returns an array of objects and you want the company name from the first object
    const companyName = result.company;

    if (companyName) {
      $.notify(companyName, "success");
      document.getElementById("input-mac").value = "";
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function handleFormSubmitIP(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const inputField = formData.get("input-ip").trim();
  const ip_regex = new RegExp(
    "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
  );

  // Проверка корректности ввода IP
  if (ip_regex.test(inputField) == false) {
    $.notify("IP некорректный", "error");
    return;
  }

  $.notify("Проверяю", "info");
  try {
    const response = await fetch(
      `http://ip-api.com/json/${inputField}?fields=country,regionName,city,org&lang=ru`,
      {
        method: "GET",
      }
    );

    if (response.status != 200) {
      $.notify("Ошибка", "error");
      return;
    }

    const result = await response.json();

    if (result) {
      $.notify(
        `Страна: ${result["country"]}\nГород: ${result["city"]}\nОрганизация: ${result["org"]}`,
        "success"
      );
      document.getElementById("input-ip").value = "";
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function handleFormSubmitLink(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const inputField = formData.get("input-link");

  $.notify("Сокращаю", "info");
  try {
    const response = await fetch(`https://clck.ru/--?url=${inputField}`, {
      method: "GET",
    });
    if (response.status != 200) {
      $.notify("Ошибка", "error");
      return;
    }

    const result = await response.text();

    if (result) {
      await navigator.clipboard.writeText(result);
      $.notify("Скопировано", "success");
      document.getElementById("input-link").value = result;
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function searchProvider() {
  // Объявить переменные
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchProvider");
  filter = input.value.toUpperCase();
  table = document.getElementById("providersTable");
  tr = table.getElementsByTagName("tr");

  // Перебирайте все строки таблицы и скрывайте тех, кто не соответствует поисковому запросу
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function searchRouter() {
  // Объявить переменные
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchRouter");
  filter = input.value.toUpperCase();
  table = document.getElementById("routersTable");
  tr = table.getElementsByTagName("tr");

  // Перебирайте все строки таблицы и скрывайте тех, кто не соответствует поисковому запросу
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
