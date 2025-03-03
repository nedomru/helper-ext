// Удаление бесполезных кнопок
async function hideUselessButtons() {
  const buttonsToRemove = [
    "Facebook In Progress",
    "Facebook Draft",
    "Twitter In Progress",
    "Twitter Draft",
  ];

  const observerOther = new MutationObserver(() => {
    const facebookButton = document.querySelector(
      `a[aria-label="Facebook In Progress"]`,
    );

    if (facebookButton) {
      buttonsToRemove.forEach((button) => {
        const btn = document.querySelector(`a[aria-label="${button}"]`);
        if (btn) {
          btn.remove();
        }
      });
      document.querySelector(".dropdown.account-help").remove();
      document.querySelector(".rebranding-logo").remove();

      observerOther.disconnect();
      console.info(
        `[Хелпер] - [Генезис] - [Бесполезные кнопки] Все бесполезные кнопки удалены`,
      );
    }
  });

  observerOther.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Изменение цветов клиента и оператора в чате
async function setupGenesysChatColors() {
  function applyColors() {
    browser.storage.sync.get(
      [
        "GENESYS_chatColors_agentPromptColor",
        "GENESYS_chatColors_agentTextColor",
        "GENESYS_chatColors_clientPromptColor",
        "GENESYS_chatColors_clientTextColor",
      ],
      function (result) {
        const agentNameColor = result.GENESYS_chatColors_agentPromptColor;
        const agentTextColor = result.GENESYS_chatColors_agentTextColor;
        const clientNameColor = result.GENESYS_chatColors_clientPromptColor;
        const clientTextColor = result.GENESYS_chatColors_clientTextColor;

        const colorScript = document.createElement("script");
        colorScript.type = "text/javascript";
        let code = `
window.genesys.wwe.configuration.set("chat.agent.prompt-color", "${agentNameColor}");
window.genesys.wwe.configuration.set("chat.agent.text-color", "${agentTextColor}");
window.genesys.wwe.configuration.set("chat.client.prompt-color", "${clientNameColor}");
window.genesys.wwe.configuration.set("chat.client.text-color", "${clientTextColor}");
      `;
        colorScript.appendChild(document.createTextNode(code));

        document.body.appendChild(colorScript);

        $.notify("Загружены кастомные цвета чата", "success");
        console.info(
          `[Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные цвета чата`,
        );
      },
    );
  }

  function checkForGenesys() {
    if (document.querySelector(".wwe-account-state")) {
      observer.disconnect();
      applyColors();
    }
  }

  const observer = new MutationObserver(() => {
    checkForGenesys();
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  checkForGenesys();
}

// Изменение звуков нового чата и сообщения
async function setupGenesysChatSound() {
  const baseURL = "http://genesys-srv.cc3.ertelecom.ru/sounds/";
  function convertPath(path) {
    const fileName = path.split("/").pop(); // Получаем имя файла
    return `${baseURL}${fileName}|-1|0`; // Формируем новый URL с добавлением |-1|0
  }

  function applySound() {
    browser.storage.sync.get(
      ["GENESYS_chatSound_newChatSound", "GENESYS_chatSound_newMessageSound"],
      function (result) {
        const newChatSound = convertPath(result.GENESYS_chatSound_newChatSound);
        const newMessageSound = convertPath(
          result.GENESYS_chatSound_newMessageSound,
        );

        const soundScript = document.createElement("script");
        soundScript.type = "text/javascript";
        let code = `
window.genesys.wwe.configuration.set("chat.ringing-bell", "${newChatSound}")
window.genesys.wwe.configuration.set("chat.new-message-bell", "${newMessageSound}")
      `;
        soundScript.appendChild(document.createTextNode(code));

        document.body.appendChild(soundScript);

        $.notify("Загружены кастомные звуки чата", "success");
        console.info(
          `[Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные звуки чата`,
        );
      },
    );
  }

  function checkForGenesys() {
    if (document.querySelector(".wwe-account-state")) {
      observer.disconnect();
      applySound();
    }
  }

  const observer = new MutationObserver(() => {
    checkForGenesys();
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  checkForGenesys();
}

// Изменение области ввода сообщения
async function messageAreaResize() {
  // Create and inject required styles
  const styles = document.createElement("style");
  styles.textContent = `
        .wwe-textarea-wrapper {
            position: relative;
            min-height: 100px;
            border: 1px solid #ccc;
            border-radius: 4px;
            margin-bottom: 10px;
            box-sizing: border-box;
        }

        .wwe-textarea {
            width: 100%;
            min-height: 100px;
            border: none;
            outline: none;
            resize: none;
            padding: 8px;
            padding-bottom: 20px;
            box-sizing: border-box;
            font-family: inherit;
            font-size: inherit;
            line-height: 1.5;
            overflow-y: hidden;
        }

        .resize-handle {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            cursor: se-resize;
            opacity: 0.6;
            transition: opacity 0.2s ease;
            z-index: 10;
        }

        .resize-handle::after {
            content: '';
            position: absolute;
            right: 0;
            bottom: 0;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 0 12px 12px;
            border-color: transparent transparent #666 transparent;
        }

        .resize-handle:hover {
            opacity: 1;
        }
    `;
  document.head.appendChild(styles);

  function getMaxHeight() {
    const windowHeight = window.innerHeight;
    const wrapperRect = document
      .querySelector(".wwe-message-box")
      .getBoundingClientRect();
    const topOffset = wrapperRect.top;
    const bottomButtons = document.querySelector(".wwe-buttons").offsetHeight;
    const bottomPadding = 20;

    // Calculate max height considering window size and other elements
    return windowHeight - topOffset - bottomButtons - bottomPadding;
  }

  function setupResize(wrapper) {
    if (!wrapper || wrapper.getAttribute("data-resize-initialized")) return;

    const textarea = wrapper.querySelector(".wwe-textarea");
    if (!textarea) return;

    wrapper.setAttribute("data-resize-initialized", "true");

    // Add resize handle
    const handle = document.createElement("div");
    handle.className = "resize-handle";
    wrapper.appendChild(handle);

    let isResizing = false;
    let startY;
    let startHeight;

    function adjustHeight() {
      // Get max available height
      const maxHeight = getMaxHeight();

      // If not manually resized, adjust to content
      if (!userSetHeight) {
        textarea.style.height = "auto";
        wrapper.style.height = "auto";

        const desiredHeight = Math.max(100, textarea.scrollHeight + 20);
        const finalHeight = Math.min(desiredHeight, maxHeight);

        wrapper.style.height = `${finalHeight}px`;
        textarea.style.height = "100%";
      } else {
        // Use user height but don't exceed max
        const finalHeight = Math.min(userSetHeight, maxHeight);
        wrapper.style.height = `${finalHeight}px`;
        textarea.style.height = "100%";
      }
    }

    let userSetHeight = null;

    function handleMouseMove(e) {
      if (!isResizing) return;

      const deltaY = e.clientY - startY;
      const newHeight = Math.max(100, startHeight + deltaY);
      const maxHeight = getMaxHeight();

      // Don't exceed max height
      const finalHeight = Math.min(newHeight, maxHeight);

      userSetHeight = finalHeight;
      wrapper.style.height = `${finalHeight}px`;
      textarea.style.height = "100%";
    }

    function handleMouseUp() {
      isResizing = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    }

    handle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startY = e.clientY;
      startHeight = wrapper.offsetHeight;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "se-resize";

      e.preventDefault();
    });

    // Reset user height on double click
    handle.addEventListener("dblclick", () => {
      userSetHeight = null;
      adjustHeight();
    });

    // Handle window resize
    const debouncedResize = debounce(() => {
      // Always adjust to max height constraints on window resize
      adjustHeight();
    }, 100);

    window.addEventListener("resize", debouncedResize);

    // Handle textarea input
    textarea.addEventListener("input", adjustHeight);

    // Initial adjustment
    adjustHeight();

    wrapper.cleanup = () => {
      handle.remove();
      window.removeEventListener("resize", debouncedResize);
      textarea.removeEventListener("input", adjustHeight);
      wrapper.removeAttribute("data-resize-initialized");
    };
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Create observer
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList.contains("wwe-textarea-wrapper")) {
            setupResize(node);
          }
          const wrappers = node.getElementsByClassName("wwe-textarea-wrapper");
          Array.from(wrappers).forEach((wrapper) => setupResize(wrapper));
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initialize existing elements
  document
    .querySelectorAll(".wwe-textarea-wrapper")
    .forEach((wrapper) => setupResize(wrapper));

  return () => {
    observer.disconnect();
    document.querySelectorAll(".wwe-textarea-wrapper").forEach((wrapper) => {
      if (wrapper.cleanup) wrapper.cleanup();
    });
  };
}

// Загрузка файла в чат из буфера
async function allowImagePaste() {
  function ensurePreviewExists() {
    if ($(".preview-container").length === 0) {
      const previewHTML = `
                <div class="preview-container" style="
                    display: none;
                    margin-top: 10px;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    background-color: #ffffff;
                ">
                    <div class="preview-header" style="
                        cursor: pointer;
                        padding: 8px 12px;
                        background-color: #f7f7f7;
                        border-bottom: 1px solid #e0e0e0;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        border-top-left-radius: 4px;
                        border-top-right-radius: 4px;
                    ">
                        <div class="preview-title" style="
                            font-weight: 600;
                            color: #333;
                            display: flex;
                            align-items: center;
                        ">
                            <span class="preview-toggle" style="
                                margin-right: 10px;
                                width: 20px;
                                text-align: center;
                                color: #666;
                            ">▶</span>
                            <span>Превью картинки</span>
                        </div>
                        <button class="preview-close" style="
                            background: none;
                            border: none;
                            color: #888;
                            font-size: 16px;
                            cursor: pointer;
                            padding: 0;
                            line-height: 1;
                        ">×</button>
                    </div>
                    <div class="preview-content" style="
                        display: none;
                        padding: 12px;
                        max-height: 400px;
                        overflow: auto;
                    ">
                        <img class="preview-image" style="
                            max-width: 100%;
                            max-height: 350px;
                            object-fit: contain;
                            border-radius: 4px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        "/>
                    </div>
                </div>
            `;
      $(".wwe-message-editor").after(previewHTML);
    }
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        ensurePreviewExists();
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
  ensurePreviewExists();

  // Toggle preview content
  $(document).on("click", ".preview-header", function () {
    const content = $(".preview-content");
    const toggle = $(".preview-toggle");
    if (content.is(":visible")) {
      content.hide();
      toggle.text("▶");
    } else {
      content.show();
      toggle.text("▼");
    }
  });

  // Close preview
  $(document).on("click", ".preview-close", function (e) {
    e.stopPropagation();
    removePreview();
  });

  function removePreview() {
    $(".preview-container").remove();
  }

  // Remove preview on send or clear
  $(document).on(
    "click",
    ".wwe-button-send-file, .wwe-button-clear-file",
    function () {
      removePreview();
    },
  );

  // Paste event handler
  $(document).on("paste", async function (e) {
    const fileInput = $(".wwe-file")[0];
    const fileLabel = $(".file-label");
    const clearButton = $(".wwe-button-clear-file");
    const sendButton = $(".wwe-button-send-file");
    const previewContainer = $(".preview-container");
    const previewImage = $(".preview-image");

    if (!fileInput || !fileLabel.length) return;

    const event = e.originalEvent;
    if (!event.clipboardData || !event.clipboardData.items) return;

    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();

        try {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInput.files = dataTransfer.files;
          fileLabel.text(file.name);

          ensurePreviewExists();
          const reader = new FileReader();
          reader.onload = function (e) {
            previewImage.attr("src", e.target.result);
            previewContainer.show();
            $(".preview-content").hide(); // Start collapsed
            $(".preview-toggle").text("▶");
          };
          reader.readAsDataURL(file);

          clearButton.prop("disabled", false);
          sendButton.prop("disabled", false);

          $(".wwe-send-file-wrapper").css("display", "block");
          $(".wwe-textarea-wrapper").addClass("wwe-textarea-with-push-url");

          $(".wwe-button-send-file-show").css("display", "none");
          $(".wwe-button-send-file-hide").css("display", "inline-block");
        } catch (error) {
          console.error("[Хелпер] - Ошибка вставки картинки из буфера:", error);
        }
        break;
      }
    }
  });

  // File input change handler
  $(document).on("change", ".wwe-file", async function (e) {
    const file = this.files[0];

    if (file) {
      $(".file-label").text(file.name);
      $(".wwe-button-clear-file, .wwe-button-send-file").prop(
        "disabled",
        false,
      );

      if (file.type.startsWith("image/")) {
        ensurePreviewExists();
        const reader = new FileReader();
        reader.onload = function (e) {
          $(".preview-image").attr("src", e.target.result);
          $(".preview-container").show();
          $(".preview-content").hide(); // Start collapsed
          $(".preview-toggle").text("▶");
        };
        reader.readAsDataURL(file);
      } else {
        removePreview();
      }

      $(".wwe-send-file-wrapper").css("display", "block");
      $(".wwe-textarea-wrapper").addClass("wwe-textarea-with-push-url");

      $(".wwe-button-send-file-show").css("display", "none");
      $(".wwe-button-send-file-hide").css("display", "inline-block");
    } else {
      $(".file-label").text("Выбери файл");
      $(".wwe-button-clear-file, .wwe-button-send-file").prop("disabled", true);
      removePreview();

      $(".wwe-send-file-wrapper").css("display", "none");
      $(".wwe-textarea-wrapper").removeClass("wwe-textarea-with-push-url");

      $(".wwe-button-send-file-show").css("display", "block");
      $(".wwe-button-send-file-hide").css("display", "none");
    }
  });
}

// Кнопка открытия Фломастера в iFrame Генезиса
async function showFlomaster() {
  // Create FM button with isolated functionality
  const createFMButton = (containerId) => {
    const button = document.createElement("button");
    button.className = "wwe-side-button wwe-split-row-item";
    button.title = "ФМ";
    button.setAttribute("aria-label", "ФМ скрыто");
    button.setAttribute("role", "tab");

    // Use container ID to create unique button and panel IDs
    const buttonId = `CaseRightTabs${containerId}Item6`;
    const panelId = `CaseRightPanels${containerId}Item6`;

    button.id = buttonId;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("tabindex", "-1");
    button.setAttribute("aria-controls", panelId);
    button.setAttribute("data-container-id", containerId);

    button.innerHTML = `
            <span class="wwe-side-button-icon">
                <span class="wwe-sprite-book-open-details"></span>
            </span>
            <span class="wwe-side-button-label">
                <span class="wwe-side-button-title">Фломастер</span>
            </span>
        `;

    button.addEventListener("click", handleFMButtonClick);
    return button;
  };

  // Updated button click handler with container-specific handling
  const handleFMButtonClick = (e) => {
    const button = e.currentTarget;
    const containerId = button.getAttribute("data-container-id");
    const buttonContainer = button.closest(".wwe-case-side-buttons");

    if (buttonContainer) {
      const allButtons = buttonContainer.querySelectorAll(".wwe-side-button");
      allButtons.forEach((btn) => {
        if (btn !== button) {
          btn.classList.remove("wwe-side-button-activated");
          btn.setAttribute("aria-expanded", "false");
          btn.setAttribute("tabindex", "-1");

          const panelId = btn.getAttribute("aria-controls");
          const panel = document.getElementById(panelId);
          if (panel) {
            panel.style.display = "none";
          }
        }
      });
    }

    const isActivated = button.classList.contains("wwe-side-button-activated");
    button.classList.toggle("wwe-side-button-activated");
    button.setAttribute("aria-expanded", (!isActivated).toString());
    button.setAttribute("tabindex", isActivated ? "-1" : "0");

    const fmPanel = document.getElementById(
      `CaseRightPanels${containerId}Item6`,
    );
    if (fmPanel) {
      fmPanel.style.display = isActivated ? "none" : "block";
      const fmIframe = fmPanel.querySelector(`#FMFrame_${containerId}`);
      if (fmIframe) {
        fmIframe.style.display = isActivated ? "none" : "block";
      }
    }
  };

  // Create FM panel with container-specific IDs
  const createFMPanel = (containerId, rightPanel) => {
    const panelId = `CaseRightPanels${containerId}Item6`;
    let panel = document.getElementById(panelId);

    if (!panel) {
      panel = document.createElement("div");
      panel.id = panelId;
      panel.className = "wwe-web-extension-container";
      panel.style.display = "none";
      panel.innerHTML = `
                <div class="wwe-web-extension-container">
                    <iframe id="FMFrame_${containerId}"
                            src="https://flomaster.chrsnv.ru/phrases"
                            width="100%"
                            height="100%"
                            allow="clipboard-read; clipboard-write">
                    </iframe>
                </div>
            `;

      if (rightPanel) {
        rightPanel.appendChild(panel);
      }
    }
    return panel;
  };

  // Function to generate unique container ID
  const getContainerId = (container) => {
    if (!container.getAttribute("data-fm-container-id")) {
      const containers = Array.from(
        document.querySelectorAll(".wwe-case-side-buttons"),
      );
      const index = containers.indexOf(container) + 1;
      container.setAttribute("data-fm-container-id", index.toString());
    }
    return container.getAttribute("data-fm-container-id");
  };

  // Function to add FM button to container
  const addFMButton = (container) => {
    if (!container) return;

    const containerId = getContainerId(container);
    const buttonId = `CaseRightTabs${containerId}Item6`;

    // Check if button already exists in this container
    if (!container.querySelector(`#${buttonId}`)) {
      const fmButton = createFMButton(containerId);
      const personalRMButton = container.querySelector(
        'button[title="Личные РМ"]',
      );

      if (personalRMButton && personalRMButton.nextSibling) {
        container.insertBefore(fmButton, personalRMButton.nextSibling);
      } else {
        container.appendChild(fmButton);
      }

      // Find corresponding right panel
      const rightPanel = container
        .closest(".wwe-case")
        ?.querySelector(".wwe-case-right");
      if (rightPanel) {
        createFMPanel(containerId, rightPanel);
      }
    }
  };

  // Initial setup for all existing containers
  document.querySelectorAll(".wwe-case-side-buttons").forEach(addFMButton);

  // Create an observer instance to watch for new containers
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // Check for new button containers
        const addedNodes = Array.from(mutation.addedNodes);
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is a container
            if (node.matches(".wwe-case-side-buttons")) {
              addFMButton(node);
            }
            // Check for containers within added nodes
            node
              .querySelectorAll(".wwe-case-side-buttons")
              .forEach(addFMButton);
          }
        });
      }
    });
  });

  // Start observing the document with configuration
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Удаление вкладки Ответы
async function hideAnswersTab() {
  // Function to remove the specific button from a container
  const removeAnswersButton = (container) => {
    if (!container) return;

    // Find the button with title "Ответы"
    const answersButton = container.querySelector('button[title="Ответы"]');
    if (answersButton) {
      answersButton.remove();
    }
  };

  // Initial removal for existing containers
  document
    .querySelectorAll(".wwe-case-side-buttons")
    .forEach(removeAnswersButton);

  // Create an observer instance to watch for new containers
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // Check added nodes
        const addedNodes = Array.from(mutation.addedNodes);
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is a container
            if (node.matches(".wwe-case-side-buttons")) {
              removeAnswersButton(node);
            }
            // Check for containers within added nodes
            node
              .querySelectorAll(".wwe-case-side-buttons")
              .forEach(removeAnswersButton);
          }
        });
      }
    });
  });

  // Start observing the document with configuration
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Удаление вкладки Личные РМы
async function hideMyRMs() {
  // Function to remove the specific button from a container
  const removeMyRMsButton = (container) => {
    if (!container) return;

    // Find the button with title "Ответы"
    const answersButton = container.querySelector('button[title="Личные РМ"]');
    if (answersButton) {
      answersButton.remove();
    }
  };

  // Initial removal for existing containers
  document
    .querySelectorAll(".wwe-case-side-buttons")
    .forEach(removeMyRMsButton);

  // Create an observer instance to watch for new containers
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // Check added nodes
        const addedNodes = Array.from(mutation.addedNodes);
        addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is a container
            if (node.matches(".wwe-case-side-buttons")) {
              removeMyRMsButton(node);
            }
            // Check for containers within added nodes
            node
              .querySelectorAll(".wwe-case-side-buttons")
              .forEach(removeMyRMsButton);
          }
        });
      }
    });
  });

  // Start observing the document with configuration
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Скрытие заголовков чата
async function hideChatHeader() {
  new MutationObserver((mutations) => {
    const headerDiv = document.querySelector(".wwe-case-information-header");
    if (!headerDiv) return;

    if (!headerDiv.classList.contains("hided-by-helper")) {
      headerDiv.click();
      headerDiv.setAttribute("aria-expanded", "false");
      headerDiv.classList.add("hided-by-helper");
    }
  }).observe(document.body, { childList: true, subtree: true });
}

// Отображение устройства клиента в заголовке чата
async function handleChatHeaders() {
  new MutationObserver((mutations) => {
    const headerDiv = document.querySelector(".wwe-case-information-header");
    if (!headerDiv) return;

    // Handle header hiding
    if (!headerDiv.classList.contains("device-by-helper")) {
      headerDiv.click();
      headerDiv.setAttribute("aria-expanded", "false");
      headerDiv.classList.add("device-by-helper");

      // Get device info
      const osElement = document.querySelector(
        "#wweCaseData1OSVersionValue .wwe-data-text-value",
      );

      if (deviceElement && osElement) {
        const os = osElement.getAttribute("title") || osElement.textContent;

        // Create device info element
        const deviceInfo = document.createElement("div");
        deviceInfo.className = "wwe-device-info";

        // Include both device name and OS type
        deviceInfo.textContent = ` | Устройство: ${os.includes("Android") ? "Android" : "iOS"}`;
        deviceInfo.style.cssText =
          "color: white; font-size: 12px; margin-top: 4px; padding: 0 8px;";

        // Insert after the header label but before the header tool
        const headerTool = headerDiv.querySelector(".wwe-header-tool");
        if (headerTool) {
          headerDiv.insertBefore(deviceInfo, headerTool);
        }
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
}
