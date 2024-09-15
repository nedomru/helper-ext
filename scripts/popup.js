document.addEventListener("DOMContentLoaded", function () {
  browser.storage.sync.get("OTHER_DarkTheme").then(function (settings) {
    if (settings.OTHER_DarkTheme) {
      document.body.classList.add("dark-theme");
    }
  });

  const form_mac = document.getElementById("form-mac");
  const form_link = document.getElementById("form-link");
  const form_ip = document.getElementById("form-ip");
  const form_premium = document.getElementById("form-premium");
  const search_provider = document.getElementById("searchProvider");
  const search_router = document.getElementById("searchRouter");
  form_mac.addEventListener("submit", handleFormSubmitMac);
  form_link.addEventListener("submit", handleFormSubmitLink);
  form_ip.addEventListener("submit", handleFormSubmitIP);
  form_premium.addEventListener("submit", handleFormPremium);
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
      window.open("https://t.me/+jH1mblw0ytcwOWUy", "_blank");
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

async function handleFormPremium(event) {
  event.preventDefault(); // предотвращаем стандартное поведение формы
  const formData = new FormData(event.target);
  const inputField = formData.get("premium-select");

  inputField == "nck2"
    ? (url =
        "https://okc.ertelecom.ru/stats/premium/ntp-nck2/get-premium-spec-month")
    : (url =
        "https://okc.ertelecom.ru/stats/premium/ntp-nck1/get-premium-spec-month");

  const requestBody = new URLSearchParams();
  requestBody.append("period", "01.09.2024");
  requestBody.append("subdivisionId[]", "16231");

  try {
    const response = await fetch(url, {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: requestBody.toString(),
      method: "POST",
    });

    if (!response.ok) {
      const errorText = await response.text(); // или response.json() если ожидается JSON
      throw new Error(`Network response was not ok: ${errorText}`);
    }

    const data = await response.json();
    console.log(data);
    const result = data["result"][0];

    specialist_name = data["result"][0]["USER_FIO"];
    premium = data["result"][0]["TOTAL_PREMIUM"];
    chats_count = data["result"][0]["TOTAL_CHATS"];

    csi = data["result"][0]["CSI"];
    csi_normative = data["result"][0]["CSI_NORMATIVE"];
    csi_premium = data["result"][0]["PERC_CSI"];

    csi_response = data["result"][0]["CSI_RESPONSE"];
    csi_response_normative = data["result"][0]["CSI_RESPONSE"];

    flr = data["result"][0]["FLR"];
    flr_normative = data["result"][0]["FLR_NORMATIVE"];
    flr_premium = data["result"][0]["PERC_FLR"];

    gok = data["result"][0]["GOK"];
    gok_normative = data["result"][0]["GOK_NORMATIVE"];
    gok_premium = data["result"][0]["PERC_GOK"];

    pers = data["result"][0]["PERS_FACT"];
    pers_plan_1 = data["result"][0]["PERS_PLAN_1"];
    pers_plan_2 = data["result"][0]["PERS_PLAN_2"];
    pers_premium = data["result"][0]["PERS_PERCENT"];

    tests_premium = data["result"][0]["PERC_TESTING"];
    thanks_premium = data["result"][0]["PERC_THANKS"];

    const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Параметр</th>
                        <th>Факт</th>
                        <th>Норматив</th>
                        <th>Процент</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Специалист</td>
                        <td colspan="3">${result["USER_FIO"]}</td>
                    </tr>
                    <tr>
                        <td>Общая премия</td>
                        <td colspan="3">${result["TOTAL_PREMIUM"]}%</td>
                    </tr>
                    <tr>
                        <td>Кол-во чатов</td>
                        <td colspan="3">${result["TOTAL_CHATS"]}</td>
                    </tr>
                    <tr>
                        <td>Тесты</td>
                        <td colspan="3">${result["PERC_TESTING"]}%</td>
                    </tr>
                    <tr>
                        <td>Благодарности</td>
                        <td colspan="3">${result["PERC_THANKS"]}%</td>
                    </tr>
                    <tr>
                        <td>Оценка</td>
                        <td>${result["CSI"]}</td>
                        <td>${result["CSI_NORMATIVE"]}</td>
                        <td>${result["PERC_CSI"]}%</td>
                    </tr>
                    <tr>
                        <td>Отклик</td>
                        <td>${result["CSI_RESPONSE"]}</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>FLR</td>
                        <td>${result["FLR"]}</td>
                        <td>${result["FLR_NORMATIVE"]}</td>
                        <td>${result["PERC_FLR"]}%</td>
                    </tr>
                    <tr>
                        <td>ГОК</td>
                        <td>${result["GOK"]}</td>
                        <td>${result["GOK_NORMATIVE"]}</td>
                        <td>${result["PERC_GOK"]}%</td>
                    </tr>
                    <tr>
                        <td>АХТ</td>
                        <td>${result["PERS_FACT"]}</td>
                        <td>${result["PERS_PLAN_1"]} / ${result["PERS_PLAN_2"]}</td>
                        <td>${result["PERS_PERCENT"]}%</td>
                    </tr>
                </tbody>
            </table>
        `;
    console.log(data);
    document.getElementById("result-container").innerHTML = tableHTML;
  } catch (error) {
    document.getElementById("result-container").innerText =
      "Не удалось получить премию";
    console.error("Ошибка:", error);
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

async function fetchRouters() {
  try {
    const response = await fetch(
      "https://authfailed.github.io/domru-helper/api/routers.json"
    );
    const data = await response.json();

    // Проверяем, содержит ли объект ключ 'routers'
    if (data.routers && Array.isArray(data.routers)) {
      const tableBody = document.getElementById("routersBody");

      data.routers.forEach((router) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                            <td>${router.Name}</td>
                            <td><a href="${
                              router.PPPoE
                            }" target="_blank">PPPoE</a></td>
                            <td><a href="${
                              router.DHCP
                            }" target="_blank">DHCP</a></td>
                            <td><a href="${
                              router.IPoE
                            }" target="_blank">IPoE</a></td>
                            <td><a href="${
                              router.Channels
                            }" target="_blank">Каналы</a></td>
                            <td>${router.Settings}</td>
                            <td><a href="${
                              router.BZ
                            }" target="_blank">БЗ</a></td>
                            <td><a href="${
                              Array.isArray(router.Emulator)
                                ? router.Emulator.join(", ")
                                : router.Emulator
                            }" target="_blank">Эмулятор</a></td>
                        `;

        tableBody.appendChild(row);
      });
    } else {
      console.error('Ключ "routers" не найден или не является массивом:', data);
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

async function fetchMNA() {
  try {
    const response = await fetch(
      "https://authfailed.github.io/domru-helper/api/mna.json"
    );
    const data = await response.json();

    // Проверяем, содержит ли объект ключ 'mna'
    if (data.mna && Array.isArray(data.mna)) {
      const tableBody = document.getElementById("mnaBody");

      data.mna.forEach((provider) => {
        const row = document.createElement("tr");

        row.innerHTML = `
                            <td><a href="${provider.link}" target="_blank">${provider.name}</td>
                            <td>${provider.authorization}</td>
                            <td>${provider.connection}</td>
                        `;

        tableBody.appendChild(row);
      });
    } else {
      console.error('Ключ "mna" не найден или не является массивом:', data);
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

fetchMNA();
fetchRouters();
