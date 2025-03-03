// Поиск по обращениям
async function searchByAppeal() {
  new MutationObserver((mutations) => {
    const container = document.getElementById("lazy_content_2448");
    if (!container?.textContent) return;

    try {
      if (!document.getElementById("appealsSearchField")) {
        const searchWrapper = document.createElement("div");
        searchWrapper.style.cssText =
          "margin-bottom: 10px; display: flex; align-items: center; gap: 10px;";

        const searchField = document.createElement("input");
        searchField.id = "appealsSearchField";
        searchField.type = "text";
        searchField.placeholder = "Поиск...";
        searchField.className = "form-control";
        searchField.style.cssText =
          "width: 15%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;";

        searchWrapper.appendChild(searchField);

        const tabContent = container.querySelector(".tab-content");
        if (tabContent) {
          tabContent.parentNode.insertBefore(searchWrapper, tabContent);
        }

        searchField.addEventListener("input", function (e) {
          const searchValue = e.target.value.toLowerCase();
          const tables = container.querySelectorAll(".tab-pane table");

          tables.forEach((table) => {
            const rows = table.getElementsByTagName("tr");
            const toggleRows = table.querySelectorAll(
              'tr[style*="background-color: rgb(229, 225, 218)"]',
            );
            table.querySelectorAll('[appeal-step="intermediate"]');
            toggleRows.forEach((row) => {
              row.style.display = searchValue ? "none" : "table-row";
            });

            // Скипаем хедер таблицы
            for (let i = 1; i < rows.length; i++) {
              const row = rows[i];

              // Скипаем строку категорий таблицы
              if (
                row.cells.length === 1 ||
                row.style.backgroundColor === "rgb(229, 225, 218)"
              )
                continue;

              const cells = row.getElementsByTagName("td");
              let rowText = "";

              for (let j = 0; j < cells.length; j++) {
                rowText += cells[j].textContent.toLowerCase() + " ";
              }

              if (searchValue) {
                row.style.display = rowText.includes(searchValue)
                  ? "table-row"
                  : "none";
              } else {
                if (row.getAttribute("appeal-step") === "intermediate") {
                  const globalToggleBtn = document.getElementById(
                    "helper-toggle-appeals",
                  );
                  const globalState =
                    globalToggleBtn?.getAttribute("data-state") || "hidden";
                  row.style.display =
                    globalState === "hidden" ? "none" : "table-row";
                } else {
                  row.style.display = "table-row";
                }
              }
            }
          });

          const globalToggleBtn = document.getElementById(
            "helper-toggle-appeals",
          );
          const statusText = globalToggleBtn?.nextElementSibling;

          if (globalToggleBtn) {
            globalToggleBtn.style.display = searchValue ? "none" : "";
            if (statusText) {
              statusText.style.display = searchValue ? "none" : "";
            }
          }
        });
      }
    } catch (error) {
      console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
    }
  }).observe(document.getElementById("lazy_content_2448") || document.body, {
    childList: true,
    subtree: true,
  });
}

// Поиск по логам
async function searchByLog() {
  new MutationObserver((mutations) => {
    const container = document.getElementById("clientlog");
    if (!container?.textContent) return;

    try {
      if (!document.getElementById("logSearchField")) {
        const searchField = document.createElement("input");
        searchField.id = "logSearchField";
        searchField.type = "text";
        searchField.placeholder = "Поиск...";
        searchField.className = "form-control";
        searchField.style.cssText =
          "margin: 10px 0; width: 15%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;";

        container.parentNode.insertBefore(searchField, container);

        searchField.addEventListener("input", function (e) {
          const searchValue = e.target.value.toLowerCase();
          const table = container.querySelector("table");
          const rows = table.getElementsByTagName("tr");

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName("td");
            let rowText = "";

            for (let j = 0; j < cells.length; j++) {
              rowText += cells[j].textContent.toLowerCase() + " ";
            }

            if (rowText.includes(searchValue)) {
              row.style.display = "";
            } else {
              row.style.display = "none";
            }
          }
        });
      }
    } catch (error) {
      console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// Поиск по свойствам
async function searchByFlag() {
  const observer = new MutationObserver((mutations) => {
    const container = document.getElementById("lazy_content_2416");
    const flagTable = container?.querySelector(".table-flag-agr");
    if (!flagTable) return;

    try {
      if (!document.getElementById("flagSearchField")) {
        const searchWrapper = document.createElement("div");
        searchWrapper.style.cssText =
          "margin: 10px 0; display: flex; align-items: center; gap: 10px;";

        const searchField = document.createElement("input");
        searchField.id = "flagSearchField";
        searchField.type = "text";
        searchField.placeholder = "Поиск...";
        searchField.className = "form-control";
        searchField.style.cssText =
          "width: 15%; padding: 6px; border: 1px solid #ddd; border-radius: 4px;";

        searchWrapper.appendChild(searchField);

        const buttonContainer =
          container.querySelector(".dialog_agr_flag").parentNode;
        buttonContainer.appendChild(searchWrapper);

        searchField.addEventListener("input", function (e) {
          const searchValue = e.target.value.toLowerCase();
          const table = flagTable.querySelector("table");
          if (!table) return;

          const rows = table.getElementsByTagName("tr");

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName("td");
            let rowText = "";

            for (let j = 0; j < cells.length; j++) {
              rowText += cells[j].textContent.toLowerCase() + " ";
            }

            if (rowText.includes(searchValue)) {
              row.style.display = "";
            } else {
              row.style.display = "none";
            }
          }
        });

        observer.disconnect();
      }
    } catch (error) {
      console.error(`[Хелпер] - [АРМ] - [Признаки] Ошибка:`, error);
    }
  });

  observer.observe(
    document.getElementById("lazy_content_2416") || document.body,
    {
      childList: true,
      subtree: true,
    },
  );
}
