document.addEventListener("DOMContentLoaded", function () {
  const form_mac = document.getElementById("form-mac");
  const form_link = document.getElementById("form-link");
  const form_ip = document.getElementById("form-ip");
  const search_provider = document.getElementById("searchProvider");
  form_mac.addEventListener("submit", handleFormSubmitMac);
  form_link.addEventListener("submit", handleFormSubmitLink);
  form_ip.addEventListener("submit", handleFormSubmitIP);
  search_provider.addEventListener("input", searchProvider);
});

async function handleFormSubmitMac(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const inputField = formData.get("input-mac");

  try {
    const response = await fetch(
      `https://www.macvendorlookup.com/api/v2/${inputField}`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Network response was not ok", response.status);
      return;
    }

    const result = await response.json();

    // Assuming the API returns an array of objects and you want the company name from the first object
    const companyName = result[0]?.company;

    if (companyName) {
      document.getElementById("input-mac").value = companyName;
    } else {
      document.getElementById("input-mac").value = "Не найдено";
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

async function handleFormSubmitLink(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const inputField = formData.get("input-link");

  try {
    const response = await fetch(`https://clck.ru/--?url=${inputField}`, {
      method: "GET",
    });
    if (!response.ok) {
      console.error("Network response was not ok", response.status);
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

async function handleFormSubmitIP(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const inputField = formData.get("input-ip");

  try {
    const response = await fetch(
      `http://ip-api.com/json/${inputField}?fields=country,regionName,city,org&lang=ru`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.error("Network response was not ok", response.status);
      return;
    }

    const result = await response.json();

    if (result) {
      $.notify(
        `Страна: ${result["country"]}\nГород: ${result["city"]}\nОрганизация: ${result["org"]}`,
        "info"
      );
      document.getElementById("input-ip").value = "";
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
