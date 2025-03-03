// Разрешение копирования любого текста
async function allowCopy() {
  setTimeout(async () => {
    const waiter = document.getElementById("waiter");
    if (!waiter) return;

    const { parentNode: parent } = waiter;
    parent.style = "";
    parent.onselectstart = "";

    const formform = document.getElementById("formform");
    if (!formform) return;

    [waiter, formform].forEach((el) => {
      el.onmousedown = el.onselectstart = (event) => event.stopPropagation();
    });
  }, 2000);
}

// Отображение договора клиента при изменении обращения
async function showClientAgreementOnChangeRequest() {
  let headerText = document.querySelector(".text-primary");
  headerText.innerText = `Обращение по договору №${
    document.querySelector('input[name="agr_num"]').value
  }`;
}

// Замена предвосхищения Хелпером
async function setHelperAnticipation() {
  const button = document.querySelector(".top_3_butt");
  if (!button) return;
  if (button.textContent.includes("Хелпер")) return;
  button.textContent = "Хелпер";

  const observerSPAS = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForSPAS);
      }
    }
  });

  const observerAccess = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForAccess);
      }
    }
  });

  const observerAccident = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForAccident);
      }
    }
  });

  const observerPPR = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForPPR);
      }
    }
  });

  const observerSpecial = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach(checkForSpecial);
      }
    }
  });

  let problems = 0;

  // СПАС
  let spas = document.querySelector(".spas_body");
  if (spas) {
    button.innerHTML += " | СПАС";
    button.style.backgroundColor = "#cc3300";
    problems++;

    console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Найден СПАС`);
  } else {
    function checkForSPAS(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("spas_body")
      ) {
        button.innerHTML += " | СПАС";
        button.style.backgroundColor = "#cc3300";
        problems++;
        observerSPAS.disconnect();
        clearTimeout(timeout);

        console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Найден СПАС`);
      }
    }

    observerSPAS.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerSPAS.disconnect();
    }, 3000);
  }

  // Закрытый доступ
  let access = document.querySelectorAll(".bl_antic_head_w");
  if (access) {
    access.forEach((element) => {
      if (element.textContent.trim() === "Доступ отсутствует") {
        button.innerHTML += " | Доступ";
        button.style.backgroundColor = "#cc3300";
        problems++;

        console.info(
          `[Хелпер] - [АРМ] - [Предвосхищение] Найден закрытый доступ`,
        );
      }
    });
  } else {
    function checkForAccess(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "Доступ отсутствует") {
          button.innerHTML += " | Доступ";
          button.style.backgroundColor = "#cc3300";
          problems++;
          observerAccess.disconnect();
          clearTimeout(timeout);

          console.info(
            `[Хелпер] - [АРМ] - [Предвосхищение] Найден закрытый доступ`,
          );
        }
      }
    }

    observerAccess.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerAccess.disconnect();
    }, 3000);
  }

  // Авария
  let accident = document.querySelectorAll(".bl_antic_head_w");
  if (accident) {
    accident.forEach((element) => {
      if (element.textContent.trim() === "Аварии на адресе") {
        button.innerHTML += " | Авария";
        button.style.backgroundColor = "#cc3300";
        problems++;

        console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Найдена авария`);
      }
    });
  } else {
    function checkForAccident(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "Аварии на адресе") {
          button.innerHTML += " | Авария";
          button.style.backgroundColor = "#cc3300";
          problems++;
          observerAccess.disconnect();
          clearTimeout(timeout);

          console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Найдена авария`);
        }
      }
    }

    observerAccident.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerAccident.disconnect();
    }, 3000);
  }

  // ППР
  let ppr = document.querySelectorAll(".bl_antic_head_w");
  if (ppr) {
    ppr.forEach((element) => {
      if (element.textContent.trim() === "ППР на адресе") {
        button.innerHTML += " | ППР";
        button.style.backgroundColor = "#cc3300";
        problems++;

        console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Найден ППР`);
      }
    });
  } else {
    function checkForPPR(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "ППР на адресе") {
          button.innerHTML += " | ППР";
          button.style.backgroundColor = "#cc3300";
          problems++;
          observerPPR.disconnect();
          clearTimeout(timeout);

          console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Найден ППР`);
        }
      }
    }

    observerPPR.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerPPR.disconnect();
    }, 3000);
  }

  // Особый клиент
  let special = document.querySelectorAll(".bl_antic_head_w");
  if (special) {
    special.forEach((element) => {
      if (element.textContent.trim() === "Особый Клиент") {
        button.innerHTML += " | Особый";
        button.style.backgroundColor = "#cc3300";
        problems++;

        console.info(
          `[Хелпер] - [АРМ] - [Предвосхищение] Найден особый клиент`,
        );
      }
    });
  } else {
    function checkForSpecial(node) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.classList.contains("bl_antic_head_w")
      ) {
        if (node.textContent.trim() === "Особый Клиент") {
          button.innerHTML += " | Особый";
          button.style.backgroundColor = "#cc3300";
          problems++;

          observerSpecial.disconnect();
          clearTimeout(timeout);

          console.info(
            `[Хелпер] - [АРМ] - [Предвосхищение] Найден особый клиент`,
          );
        }
      }
    }

    observerSpecial.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => {
      observerSpecial.disconnect();
    }, 3000);
  }

  if (problems === 0) {
    button.style.backgroundColor = "#008000";
  }
  console.info(`[Хелпер] - [АРМ] - [Предвосхищение] Предвосхищение загружено`);
}

// Фильтр сессий клиента по типу разрывов
async function initFilterClientSessions() {
  const container = document.querySelector(".container");
  const targetNode = document.getElementById("js-res-app");
  let filterContainer, countDisplay;

  const createFilterAndCountElements = () => {
    filterContainer = document.createElement("div");
    filterContainer.innerHTML = `
            <label for="reason-filter">Фильтр по причине завершения:</label>
            <select id="reason-filter"></select>
            <div id="reason-count-display" style="max-width: 200px; margin-top: 10px;"></div>
        `;
    container.insertBefore(filterContainer, targetNode);

    const reasonFilter = filterContainer.querySelector("#reason-filter");
    reasonFilter.addEventListener("change", filterClientSessions);

    countDisplay = filterContainer.querySelector("#reason-count-display");
  };

  const updateFilterAndCount = () => {
    const { uniqueReasons, reasonCounts } = getUniqueReasonsAndCounts();
    updateFilter(uniqueReasons);
    updateCountDisplay(reasonCounts);
  };

  const updateFilter = (uniqueReasons) => {
    const reasonFilter = document.getElementById("reason-filter");
    reasonFilter.innerHTML = `<option value="all">Все</option>${uniqueReasons
      .map((reason) => `<option value="${reason}">${reason}</option>`)
      .join("")}`;
  };

  const updateCountDisplay = (reasonCounts) => {
    if (!countDisplay) return;

    // Сортируем по причине завершения сессии
    const sortedReasons = Object.entries(reasonCounts).sort(
      (a, b) => b[1] - a[1],
    );

    const totalCount = Object.values(reasonCounts).reduce(
      (sum, count) => sum + count,
      0,
    );

    countDisplay.innerHTML = `
        <table style="width:100%; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="border: 1px solid black; padding: 5px; text-align: center;">Разрыв</th>
                    <th style="border: 1px solid black; padding: 5px; text-align: center;">Кол-во</th>
                </tr>
            </thead>
            <tbody>
                ${sortedReasons
                  .map(
                    ([reason, count]) => `
                            <tr>
                                <td style="border: 1px solid black; padding: 5px;">${reason}</td>
                                <td style="border: 1px solid black; padding: 5px;">${count}</td>
                            </tr>
                        `,
                  )
                  .join("")}
                <tr>
                    <td style="border: 1px solid black; padding: 5px; font-weight: bold;">Всего разрывов</td>
                    <td style="border: 1px solid black; padding: 5px; font-weight: bold;">${totalCount}</td>
                </tr>
            </tbody>
        </table>
    `;
  };

  const filterClientSessions = () => {
    const filter = document.getElementById("reason-filter").value;
    const rows = document.querySelectorAll("#js-res-app table tbody tr");
    rows.forEach((row) => {
      const reasonCell = row.cells[6];
      if (reasonCell) {
        row.style.display =
          filter === "all" || reasonCell.textContent.includes(filter)
            ? ""
            : "none";
      }
    });
  };

  const getUniqueReasonsAndCounts = () => {
    const rows = document.querySelectorAll("#js-res-app table tbody tr");
    const reasonCounts = {};
    rows.forEach((row) => {
      const reason = row.cells[6]?.textContent.trim();
      if (reason) {
        reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
      }
    });
    return {
      uniqueReasons: Object.keys(reasonCounts),
      reasonCounts,
    };
  };

  const observerCallback = () => {
    if (document.querySelector("#js-res-app table tbody")) {
      if (!filterContainer) createFilterAndCountElements();
      updateFilterAndCount();
      filterClientSessions();
    }
  };

  if (targetNode) {
    const observer = new MutationObserver(observerCallback);
    observer.observe(targetNode, { childList: true, subtree: true });
  } else {
    observerCallback();
  }
}

// Удаление вкладок с договора клиента
async function deleteTabs(tabList) {
  const listItems = document.querySelectorAll(".tabs_new");

  const removePromises = Array.from(listItems).map(async (item) => {
    if (tabList.includes(item.textContent.trim())) {
      item.remove();
    }
  });

  await Promise.all(removePromises);
}

// Проверка и уведомление об особом клиенте
async function checkForSpecialClient() {
  const observerSpecial = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.classList.contains("bl_antic_head_w")
          ) {
            checkSpecialClient(node);
          }
        });
      }
    }
  });

  const checkSpecialClient = (element) => {
    if (element.textContent.trim() === "Особый Клиент") {
      alert("Внимание! Особый клиент!");
      console.info(`[Хелпер] - [АРМ] - [Особый клиент] Найден особый клиент`);
      observerSpecial.disconnect();
    }
  };

  const special = document.querySelectorAll(".bl_antic_head_w");
  if (special.length > 0) {
    special.forEach(checkSpecialClient);
  } else {
    observerSpecial.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observerSpecial.disconnect();
    }, 3000);
    // Подключение для вызывания для существующих дочерних элементов
    const existingNodes = document.body.querySelectorAll(".bl_antic_head_w");
    existingNodes.forEach(checkSpecialClient);
  }
}

// Автоматическое форматирование MAC-адресов в EQM
async function autoFormatEQMMacs() {
  new MutationObserver((mutations) => {
    const container = document.getElementById("lazy_content_2507");
    if (!container?.textContent) return;

    try {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return /[0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}[-:][0-9A-F]{2}/i.test(
              node.textContent,
            )
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP;
          },
        },
        false,
      );

      let currentNode;
      while ((currentNode = walker.nextNode())) {
        const originalText = currentNode.textContent;

        const newText = originalText.replace(
          /([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})[-:]([0-9A-F]{2})/gi,
          (match, p1, p2, p3, p4, p5, p6) => {
            return `${p1}:${p2}:${p3}:${p4}:${p5}:${p6}`;
          },
        );

        if (originalText !== newText) {
          currentNode.textContent = newText;
        }
      }

      const macInputs = container.querySelectorAll(
        'input[readonly][value*="-"]',
      );
      macInputs.forEach((input) => {
        const macValue = input.value;
        if (macValue.includes("-")) {
          input.value = macValue.replace(/-/g, ":");
        }
      });
    } catch (error) {
      console.error(`[Хелпер] - [АРМ] - [Обращения] Ошибка:`, error);
    }
  }).observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributeFilter: ["value"],
  });
}

// Автоматическое форматирование кнопок в компенсациях
async function autoFormatCompensateButtons() {
  const compensationLinks = document.querySelectorAll("a.compensation");

  compensationLinks.forEach((link) => {
    if (link.textContent.trim().toLowerCase() === "ok") {
      link.textContent = "Применить";
    }
  });
}

// Автоматическая смена продукта обращения на Интернет
async function changeAppealItemToInternet() {
  const changeEvent = new Event("change", {
    bubbles: true,
    cancelable: true,
  });

  const product = document.querySelector(".uni_reas_prod");
  const values = Array.from(product.options).map((option) => option.value);

  if (values.includes("70")) {
    product.value = "70";
    product.dispatchEvent(changeEvent);
  }
}
