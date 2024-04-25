document.addEventListener("DOMContentLoaded", function () {
  const form_mac = document.getElementById("form-mac");
  const form_link = document.getElementById("form-link");
  form_mac.addEventListener("submit", handleFormSubmitMac);
  form_link.addEventListener("submit", handleFormSubmitLink);
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
