document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");
  form.addEventListener("submit", handleFormSubmit);
});

async function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const inputField = formData.get("inputField");

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
    console.log(result);

    // Assuming the API returns an array of objects and you want the company name from the first object
    const companyName = result[0]?.company;

    if (companyName) {
      document.getElementById("inputField").value = companyName;
    } else {
      console.error("Company name not found in the response");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}
