/* global browser */

document.addEventListener("DOMContentLoaded", function () {
  browser.storage.sync.get("OTHER_DarkTheme").then(function (settings) {
    if (settings.OTHER_DarkTheme) {
      document.body.classList.add("dark-theme");
    }
  });

  const submitMac = document.getElementById("submit-mac");
  const submitIP = document.getElementById("submit-ip");
  const submitLink = document.getElementById("submit-link");
  const submitPremium = document.getElementById("submit-premium");
  submitMac.addEventListener("click", handleMacSubmit);
  submitIP.addEventListener("click", handleIPSubmit);
  submitLink.addEventListener("click", handleLinkSubmit);
  submitPremium.addEventListener("click", handlePremiumSubmit);
  document
    .getElementById("searchProvider")
    .addEventListener("input", () =>
      searchTable("searchProvider", "providersTable")
    );
  document
    .getElementById("searchRouter")
    .addEventListener("input", () =>
      searchTable("searchRouter", "routersTable")
    );
  document
    .getElementById("openSettings")
    .addEventListener("click", function () {
      browser.runtime.openOptionsPage();
    });
  // document
  //   .getElementById("openTelegram")
  //   .addEventListener("click", function () {
  //     window.open("https://t.me/+jH1mblw0ytcwOWUy", "_blank");
  //   });
});

async function handleMacSubmit() {
  const inputField = document.getElementById("input-mac");
  const macAddress = inputField.value.trim();
  const mac_regex = new RegExp("^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$");

  if (mac_regex.test(macAddress) === false) {
    $.notify("Это не MAC", "error");
    return;
  }

  $.notify("Проверяю", "info");
  try {
    const response = await fetch(
        `https://api.maclookup.app/v2/macs/${macAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
    );
    if (response.status !== 200) {
      $.notify("Не удалось найти", "error");
      return;
    }

    const result = await response.json();

    const companyName = result.company;

    if (companyName) {
      $.notify(companyName, "success");
      inputField.value = "";
    }
  } catch (error) {
    console.error("Fetch error:", error);
    $.notify("Произошла ошибка при проверке", "error");
  }
}

async function handleIPSubmit() {
  const inputField = document.getElementById("input-ip").value.trim();
  const ip_regex = new RegExp(
    "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
  );

  if (ip_regex.test(inputField) === false) {
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

    if (response.status !== 200) {
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

async function handleLinkSubmit() {
  const inputField = document.getElementById("input-link").value.trim();

  $.notify("Сокращаю", "info");
  try {
    const response = await fetch(`https://clck.ru/--?url=${inputField}`, {
      method: "GET",
    });
    if (response.status !== 200) {
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

async function handlePremiumSubmit() {
  const inputField = document.getElementById("premium-select").value;

  let url;
  inputField === "nck2"
      ? (url =
          "https://okc.ertelecom.ru/stats/premium/ntp-nck2/get-premium-spec-month")
      : (url =
          "https://okc.ertelecom.ru/stats/premium/ntp-nck1/get-premium-spec-month");

  const requestBody = new URLSearchParams();
  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const formattedDate =
      String(firstDayCurrentMonth.getDate()).padStart(2, "0") +
      "." +
      String(firstDayCurrentMonth.getMonth() + 1).padStart(2, "0") +
      "." +
      firstDayCurrentMonth.getFullYear();

  requestBody.append("period", formattedDate);
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
      const errorText = await response.text();
      console.log(`[${new Date().toLocaleTimeString()}] [Хелпер] - [Проверка премии] - Произошла ошибка: ${errorText}`)
    }

    const data = await response.json();
    const result = data["result"][0];

    const tableHTML = `
            <table class="table table-hover table-bordered table-responsive table-sm">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Факт</th>
                        <th scope="col">Норматив</th>
                        <th scope="col">Процент</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <th scope="row">Специалист</th>
                        <td colspan="3" class="align-middle">${result["USER_FIO"]}</td>
                    </tr>
                    <tr>
                        <th scope="row">Общая премия</th>
                        <td colspan="3" class="align-middle">${result["TOTAL_PREMIUM"]}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Кол-во чатов</th>
                        <td colspan="3" class="align-middle">${result["TOTAL_CHATS"]}</td>
                    </tr>
                    <tr>
                        <th scope="row">Тесты</th>
                        <td colspan="3" class="align-middle">${result["PERC_TESTING"]}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Благодарности</th>
                        <td colspan="3" class="align-middle">${result["PERC_THANKS"]}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Оценка</th>
                        <td class="align-middle">${result["CSI"]}</td>
                        <td class="align-middle">${result["CSI_NORMATIVE"]}</td>
                        <td class="align-middle">${result["PERC_CSI"]}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Отклик</th>
                        <td class="align-middle">${result["CSI_RESPONSE"]}</td>
                        <td class="align-middle">-</td>
                        <td class="align-middle">-</td>
                    </tr>
                    <tr>
                        <th scope="row">FLR</th>
                        <td class="align-middle">${result["FLR"]}</td>
                        <td class="align-middle">${result["FLR_NORMATIVE"]}</td>
                        <td class="align-middle">${result["PERC_FLR"]}%</td>
                    </tr>
                    <tr>
                        <th scope="row">ГОК</th>
                        <td class="align-middle">${result["GOK"]}</td>
                        <td class="align-middle">${result["GOK_NORMATIVE"]}</td>
                        <td class="align-middle">${result["PERC_GOK"]}%</td>
                    </tr>
                    <tr>
                        <th scope="row">АХТ</th>
                        <td class="align-middle">${result["PERS_FACT"]}</td>
                        <td class="align-middle">${result["PERS_PLAN_1"]} / ${result["PERS_PLAN_2"]}</td>
                        <td class="align-middle">${result["PERS_PERCENT"]}%</td>
                    </tr>
                </tbody>
            </table>
        `;

    document.getElementById("result-container").innerHTML =
        DOMPurify.sanitize(tableHTML);
  } catch (error) {
    document.getElementById("result-container").innerText =
        "Не удалось получить премию";
    console.error("Ошибка:", error);
  }
}