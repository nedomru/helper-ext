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
            `a[aria-label="Facebook In Progress"]`
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
                `[Хелпер] - [Генезис] - [Бесполезные кнопки] Все бесполезные кнопки удалены`
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
        browser.storage.sync.get([
            "GENESYS_chatColors_agentPromptColor",
            "GENESYS_chatColors_agentTextColor",
            "GENESYS_chatColors_clientPromptColor",
            "GENESYS_chatColors_clientTextColor",
        ], function (result) {
            const agentNameColor = result.GENESYS_chatColors_agentPromptColor;
            const agentTextColor = result.GENESYS_chatColors_agentTextColor;
            const clientNameColor = result.GENESYS_chatColors_clientPromptColor;
            const clientTextColor = result.GENESYS_chatColors_clientTextColor;

            const colorScript = document.createElement('script');
            colorScript.type = 'text/javascript';
            let code = `
window.genesys.wwe.configuration.set("chat.agent.prompt-color", "${agentNameColor}");
window.genesys.wwe.configuration.set("chat.agent.text-color", "${agentTextColor}");
window.genesys.wwe.configuration.set("chat.client.prompt-color", "${clientNameColor}");
window.genesys.wwe.configuration.set("chat.client.text-color", "${clientTextColor}");
      `
            colorScript.appendChild(document.createTextNode(code));

            document.body.appendChild(colorScript)

            $.notify("Загружены кастомные цвета чата", "success")
            console.info(`[Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные цвета чата`)
        });
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
        characterData: true
    });

    checkForGenesys();
}

// Изменение звуков нового чата и сообщения
async function setupGenesysChatSound() {
    const baseURL = 'http://genesys-srv.cc3.ertelecom.ru/sounds/';
    function convertPath(path) {
        const fileName = path.split('/').pop(); // Получаем имя файла
        return `${baseURL}${fileName}|-1|0`; // Формируем новый URL с добавлением |-1|0
    }

    function applySound() {
        browser.storage.sync.get([
            "GENESYS_chatSound_newChatSound",
            "GENESYS_chatSound_newMessageSound",
        ], function (result) {
            const newChatSound = convertPath(result.GENESYS_chatSound_newChatSound);
            const newMessageSound = convertPath(result.GENESYS_chatSound_newMessageSound);

            const soundScript = document.createElement('script');
            soundScript.type = 'text/javascript';
            let code = `
window.genesys.wwe.configuration.set("chat.ringing-bell", "${newChatSound}")
window.genesys.wwe.configuration.set("chat.new-message-bell", "${newMessageSound}")
      `
            soundScript.appendChild(document.createTextNode(code));

            document.body.appendChild(soundScript)

            $.notify("Загружены кастомные звуки чата", "success")
            console.info(`[Хелпер] - [Генезис] - [Цвета чата] - Применены кастомные звуки чата`)
        });
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
        characterData: true
    });

    checkForGenesys();
}

// Изменение области ввода сообщения
async function messageAreaResize() {
    // Create and inject required styles
    const styles = document.createElement('style');
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
        const wrapperRect = document.querySelector('.wwe-message-box').getBoundingClientRect();
        const topOffset = wrapperRect.top;
        const bottomButtons = document.querySelector('.wwe-buttons').offsetHeight;
        const bottomPadding = 20;

        // Calculate max height considering window size and other elements
        return windowHeight - topOffset - bottomButtons - bottomPadding;
    }

    function setupResize(wrapper) {
        if (!wrapper || wrapper.getAttribute('data-resize-initialized')) return;

        const textarea = wrapper.querySelector('.wwe-textarea');
        if (!textarea) return;

        wrapper.setAttribute('data-resize-initialized', 'true');

        // Add resize handle
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        wrapper.appendChild(handle);

        let isResizing = false;
        let startY;
        let startHeight;

        function adjustHeight() {
            // Get max available height
            const maxHeight = getMaxHeight();

            // If not manually resized, adjust to content
            if (!userSetHeight) {
                textarea.style.height = 'auto';
                wrapper.style.height = 'auto';

                const desiredHeight = Math.max(100, textarea.scrollHeight + 20);
                const finalHeight = Math.min(desiredHeight, maxHeight);

                wrapper.style.height = `${finalHeight}px`;
                textarea.style.height = '100%';
            } else {
                // Use user height but don't exceed max
                const finalHeight = Math.min(userSetHeight, maxHeight);
                wrapper.style.height = `${finalHeight}px`;
                textarea.style.height = '100%';
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
            textarea.style.height = '100%';
        }

        function handleMouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
        }

        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.clientY;
            startHeight = wrapper.offsetHeight;

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'se-resize';

            e.preventDefault();
        });

        // Reset user height on double click
        handle.addEventListener('dblclick', () => {
            userSetHeight = null;
            adjustHeight();
        });

        // Handle window resize
        const debouncedResize = debounce(() => {
            // Always adjust to max height constraints on window resize
            adjustHeight();
        }, 100);

        window.addEventListener('resize', debouncedResize);

        // Handle textarea input
        textarea.addEventListener('input', adjustHeight);

        // Initial adjustment
        adjustHeight();

        wrapper.cleanup = () => {
            handle.remove();
            window.removeEventListener('resize', debouncedResize);
            textarea.removeEventListener('input', adjustHeight);
            wrapper.removeAttribute('data-resize-initialized');
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
                    if (node.classList.contains('wwe-textarea-wrapper')) {
                        setupResize(node);
                    }
                    const wrappers = node.getElementsByClassName('wwe-textarea-wrapper');
                    Array.from(wrappers).forEach(wrapper => setupResize(wrapper));
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialize existing elements
    document.querySelectorAll('.wwe-textarea-wrapper').forEach(wrapper => setupResize(wrapper));

    return () => {
        observer.disconnect();
        document.querySelectorAll('.wwe-textarea-wrapper').forEach(wrapper => {
            if (wrapper.cleanup) wrapper.cleanup();
        });
    };
}

// Загрузка файла в чат из буфера
async function initFileUpload() {
    function ensurePreviewExists() {
        if ($('.preview-container').length === 0) {
            const previewHTML = `
                <div class="preview-container" style="display:none; margin-top:5px;">
                    <div class="preview-header" style="cursor:pointer; padding:2px; background:#f5f5f5; border:1px solid #ddd; display:flex; align-items:center;">
                        <span class="preview-toggle" style="margin-right:5px;">▶</span>
                        <span>Превью загруженной картинки</span>
                    </div>
                    <div class="preview-content" style="display:none; padding:5px; border:1px solid #ddd; border-top:none;">
                        <img class="preview-image" style="object-fit:contain;" />
                    </div>
                </div>
            `;
            $('.wwe-message-editor').after(previewHTML);
        }
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                ensurePreviewExists();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    ensurePreviewExists();

    $(document).on('click', '.preview-header', function() {
        const content = $('.preview-content');
        const toggle = $('.preview-toggle');
        if (content.is(':visible')) {
            content.hide();
            toggle.text('▶');
        } else {
            content.show();
            toggle.text('▼');
        }
    });

    function removePreview() {
        $('.preview-container').remove();
    }

    $(document).on('click', '.wwe-button-send-file, .wwe-button-clear-file', function() {
        removePreview();
    });

    $(document).on('paste', async function(e) {
        const fileInput = $('.wwe-file')[0];
        const fileLabel = $('.file-label');
        const clearButton = $('.wwe-button-clear-file');
        const sendButton = $('.wwe-button-send-file');
        const previewContainer = $('.preview-container');
        const previewImage = $('.preview-image');

        if (!fileInput || !fileLabel.length) return;

        const event = e.originalEvent;
        if (!event.clipboardData || !event.clipboardData.items) return;

        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                e.preventDefault();
                const file = items[i].getAsFile();

                try {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    fileInput.files = dataTransfer.files;
                    fileLabel.text(file.name);

                    ensurePreviewExists();
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        previewImage.attr('src', e.target.result);
                        previewContainer.show();
                    };
                    reader.readAsDataURL(file);

                    clearButton.prop('disabled', false);
                    sendButton.prop('disabled', false);

                    $('.wwe-send-file-wrapper').css('display', 'block');
                    $('.wwe-textarea-wrapper').addClass('wwe-textarea-with-push-url');

                    $('.wwe-button-send-file-show').css('display', 'none');
                    $('.wwe-button-send-file-hide').css('display', 'inline-block');
                } catch (error) {
                    console.error('Error handling paste:', error);
                }
                break;
            }
        }
    });

    $(document).on('change', '.wwe-file', async function(e) {
        const file = this.files[0];

        if (file) {
            $('.file-label').text(file.name);
            $('.wwe-button-clear-file, .wwe-button-send-file').prop('disabled', false);

            if (file.type.startsWith('image/')) {
                ensurePreviewExists();
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('.preview-image').attr('src', e.target.result);
                    $('.preview-container').show();
                };
                reader.readAsDataURL(file);
            } else {
                removePreview();
            }

            $('.wwe-send-file-wrapper').css('display', 'block');
            $('.wwe-textarea-wrapper').addClass('wwe-textarea-with-push-url');

            $('.wwe-button-send-file-show').css('display', 'none');
            $('.wwe-button-send-file-hide').css('display', 'inline-block');
        } else {
            $('.file-label').text('Выберите файл');
            $('.wwe-button-clear-file, .wwe-button-send-file').prop('disabled', true);
            removePreview();

            $('.wwe-send-file-wrapper').css('display', 'none');
            $('.wwe-textarea-wrapper').removeClass('wwe-textarea-with-push-url');

            $('.wwe-button-send-file-show').css('display', 'block');
            $('.wwe-button-send-file-hide').css('display', 'none');
        }
    });
}

// Перевод элементов чата
async function initTranslations() {
    // Function to translate elements
    const translateElements = (elements) => {
        elements.forEach(element => {
            if (element.classList.contains('wwe-button-clear-file')) {
                element.textContent = 'Очистить';
            }
            if (element.classList.contains('wwe-button-select-file')) {
                element.textContent = 'Выбрать';
                element.title = 'Выбрать';
            }
            if (element.classList.contains('wwe-button-send-file')) {
                element.textContent = 'Отправить';
                element.title = 'Отправить';
            }

            // Only apply styling to these buttons without translation
            if (element.classList.contains('wwe-button-send-file-show') ||
                element.classList.contains('wwe-button-send-file-hide') ||
                element.classList.contains('wwe-button-push-show')) {
                element.style.display = 'flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
            }
        });
    };

    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                const relevantElements = [];
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.classList && (
                            node.classList.contains('file-label') ||
                            node.classList.contains('wwe-button-clear-file') ||
                            node.classList.contains('wwe-button-select-file') ||
                            node.classList.contains('wwe-button-send-file') ||
                            node.classList.contains('wwe-button-send-file-show') ||
                            node.classList.contains('wwe-button-send-file-hide') ||
                            node.classList.contains('wwe-button-push-show')
                        )) {
                            relevantElements.push(node);
                        }
                        const childElements = node.querySelectorAll(
                            '.file-label, .wwe-button-clear-file, .wwe-button-select-file, ' +
                            '.wwe-button-send-file, .wwe-button-send-file-show, ' +
                            '.wwe-button-send-file-hide, .wwe-button-push-show'
                        );
                        childElements.forEach(el => relevantElements.push(el));
                    }
                });
                if (relevantElements.length) {
                    translateElements(relevantElements);
                }
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial translation
    translateElements(document.querySelectorAll(
        '.file-label, .wwe-button-clear-file, .wwe-button-select-file, ' +
        '.wwe-button-send-file, .wwe-button-send-file-show, ' +
        '.wwe-button-send-file-hide, .wwe-button-push-show'
    ));
}