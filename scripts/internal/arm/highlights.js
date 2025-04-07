class HighlightManager {
  constructor() {
    this.colors = {};
    this.isInitialized = false;
    this.processedElements = new Set();
    this.serviceStatusRegex = /(Услуга в (Domru|Домru) \w+)/;
  }

  async init() {
    try {
      this.colors = await this.getHighlightColors();
      this.settings = await browser.storage.sync.get("ARM_removeUselessAppealsColumns");
      this.isInitialized = true;
    } catch (error) {
      error("[Хелпер] - [Подсветка] Ошибка инициализации:", error);
    }
  }

  async getHighlightColors() {
    try {
      const settings = await browser.storage.sync.get([
        "HIGHLIGHTER_CS",
        "HIGHLIGHTER_EMAIL",
        "HIGHLIGHTER_OCTP",
        "HIGHLIGHTER_COMPENSATION"
      ]);

      return {
        "Контакт сорвался": settings.HIGHLIGHTER_CS || "#ff0000",
        "Обращение из Email": settings.HIGHLIGHTER_EMAIL || "#006400",
        "ОЦТП - Входящая связь": settings.HIGHLIGHTER_OCTP || "#008080",
        "Компенсация за аварию": settings.HIGHLIGHTER_COMPENSATION || "#66CDAA"
      };
    } catch (error) {
      error("[Хелпер] - [Подсветка] Ошибка при получении цветов:", error);
      return {};
    }
  }

  highlightWarrantyDate(text) {
    const warrantyMatch = text.match(/гарантийный срок до (\d{2}\.\d{2}\.\d{4})/);
    if (!warrantyMatch) return text;

    const date = new Date(warrantyMatch[1].split(".").reverse().join("-"));
    const color = date > new Date() ? "green" : "red";
    return text.replace(
      warrantyMatch[1],
      `<span style="color: ${color}; font-weight: bold;">${warrantyMatch[1]}</span>`
    );
  }

  highlightKeywords(text) {
    let result = text;
    for (const [keyword, color] of Object.entries(this.colors)) {
      if (text.includes(keyword)) {
        result = text.replace(
          new RegExp(keyword, "g"),
          `<span style="color: ${color}; font-weight: bold;">${keyword}</span>`
        );
      }
    }
    return result;
  }

  processTableCell(cell) {
    if (!cell || cell.classList.contains("helper-highlighted")) return;

    const text = cell.textContent.trim();
    let newHTML = this.highlightWarrantyDate(text);
    if (newHTML === text) {
      newHTML = this.highlightKeywords(text);
    }

    if (newHTML !== text) {
      cell.innerHTML = newHTML;
      cell.classList.add("helper-highlighted");
    }
  }

  processServiceStatus(container) {
    if (!container || 
        container.hasAttribute('data-helper-processed') || 
        !container.textContent) {
      return;
    }

    const statusText = container.textContent.trim();
    if (!statusText.includes('Услуга в')) {
      container.setAttribute('data-helper-processed', 'true');
      return;
    }

    // Preserve success message
    const successPart = container.querySelector('font')?.outerHTML || '';
    const textParts = container.innerHTML.split('<br>');
    
    if (textParts.length < 2) {
      container.setAttribute('data-helper-processed', 'true');
      return;
    }

    const statusPart = textParts[1];
    const color = statusPart.includes("закрыта") ? "red" : "green";
    
    container.innerHTML = `${successPart}<br><span style="color: ${color}; font-weight: bold;">Услуга в Домru ${statusPart.includes("закрыта") ? "закрыта" : "активна"}</span>. Проверка у поставщика не требуется.`;
    container.setAttribute('data-helper-processed', 'true');
  }

  highlightServiceStatus() {
    const serviceStatuses = document.querySelectorAll('[id^="check_stat_"]:not([data-helper-processed])');
    for (const container of serviceStatuses) {
      try {
        this.processServiceStatus(container);
      } catch (error) {
        error('[Хелпер] Ошибка подсветки статуса:', error);
        container.setAttribute('data-helper-processed', 'true');
      }
    }
  }

  processTable() {
    if (!this.isInitialized) return;
    
    const appealsContainer = document.getElementById("lazy_content_2448");
    if (!appealsContainer?.textContent) return;

    const removeColumns = this.settings.ARM_removeUselessAppealsColumns;
    appealsContainer.querySelectorAll("table").forEach(table => {
      table.querySelectorAll("tr").forEach(row => {
        if (row.hasAttribute("data-highlighted")) return;

        const cells = row.querySelectorAll("td");
        if (cells.length < (removeColumns ? 9 : 10)) return;

        this.processTableCell(cells[2]); // Stage cell
        this.processTableCell(cells[5]); // Warranty cell
        this.processTableCell(cells[removeColumns ? 9 : 10]); // Problem cell

        row.setAttribute("data-highlighted", "true");
      });
    });
  }

  processWarrantyTable() {
    const warrantyContainer = document.getElementById("lazy_content_801");
    if (!warrantyContainer?.textContent) return;

    warrantyContainer.querySelectorAll("table tr").forEach(row => {
      if (row.hasAttribute("data-warranty-highlighted")) return;

      const cells = row.querySelectorAll("td");
      if (cells.length > 0) {
        cells.forEach(cell => {
          const text = cell.textContent.trim();
          const newHTML = this.highlightWarrantyDate(text);
          if (newHTML !== text) {
            cell.innerHTML = newHTML;
          }
        });
        row.setAttribute("data-warranty-highlighted", "true");
      }
    });
  }

  highlightRequests() {
    const block = document.querySelector(".col-sm-9");
    if (block && this.colors["Контакт сорвался"]) {
      block.innerHTML = block.innerHTML.replaceAll(
        "Контакт сорвался",
        `<span style='color: ${this.colors["Контакт сорвался"]}; font-weight:bold'>Контакт сорвался</span>`
      );
    }
  }

  highlightCompensation() {
    document.querySelectorAll("th").forEach(cell => {
      if (cell.innerHTML.includes("Компенсация за аварию")) { // Используем includes()
        [cell, cell.parentElement?.querySelector("td")].forEach(element => {
          if (element) {
            element.style.color = "black";
            element.style.backgroundColor = "white";
          }
        });
      }
    });
  }
}

// Initialize and start highlighting
const highlighter = new HighlightManager();

async function initHighlighting() {
  await highlighter.init();

  let isProcessing = false;
  let timeout;

  const observerCallback = () => {
    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(() => {
      if (isProcessing) return;
      
      isProcessing = true;
      try {
        highlighter.processTable();
        highlighter.highlightServiceStatus();
        highlighter.processWarrantyTable();
      } finally {
        isProcessing = false;
      }
    }, 150); // Increased throttle time
  };

  // Create separate observers for different containers
  const mainObserver = new MutationObserver(observerCallback);
  const warrantyObserver = new MutationObserver(observerCallback);

  // Observe main content
  mainObserver.observe(document.body, { 
    childList: true, 
    subtree: true, 
    characterData: true 
  });

  // Observe warranty container specifically
  const warrantyContainer = document.getElementById("lazy_content_801");
  if (warrantyContainer) {
    warrantyObserver.observe(warrantyContainer, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }
  
  // Initial processing
  highlighter.processTable();
  highlighter.highlightServiceStatus();
  highlighter.processWarrantyTable();

  // Page-specific highlights
  if (document.URL.includes("wcc_request_appl_support.change_request_appl")) {
    highlighter.highlightRequests();
  }
  if (document.URL.includes("db.ertelecom.ru/cgi-bin/ppo/excells/adv_act_retention")) {
    highlighter.highlightCompensation();
  }
}

initHighlighting();
