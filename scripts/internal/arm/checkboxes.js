// Автоматическое проставление галочек платного сервиса в левом фрейме и изменении обращения
async function paidHelpTrue() {
    function triggerPayServiceChange(checkbox) {
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        checkbox.dispatchEvent(clickEvent);

        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        checkbox.dispatchEvent(changeEvent);

        checkbox.checked = true;

        const onclickStr = checkbox.getAttribute('onclick');
        if (onclickStr) {
            const match = onclickStr.match(/(\w+)\((\d+)\)/);
            if (match) {
                const [_, funcName, arg] = match;
                if (typeof window[funcName] === 'function') {
                    window[funcName](parseInt(arg));
                }
            }
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "attributes") {
                const checkbox = document.getElementById("check_pay_service");
                if (checkbox) {
                    const payServiceSpan = checkbox.closest('.pay_service');

                    if (payServiceSpan) {
                        let element = payServiceSpan;
                        let isVisible = true;

                        while (element && element !== document.body) {
                            const style = window.getComputedStyle(element);
                            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                                isVisible = false;
                                break;
                            }
                            element = element.parentElement;
                        }

                        if (isVisible && !checkbox.checked) {
                            triggerPayServiceChange(checkbox);
                            observer.disconnect();
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class', 'disabled']
    });
}

// Автоматическое удаление галочки некорректного перевода
async function wrongTransferFalse() {
    const radioButton = document.querySelector(
        'input[type="radio"][name="wrongTransfer"][value="0"]',
    );
    if (radioButton) {
        radioButton.removeAttribute("disabled");
        radioButton.click();

        console.info(
            `[Хелпер] - [АРМ] - [Обращения] Отмечено как не ошибочное`,
        );
    }
}

// Автоматическое удаление галочки назначения обращения на себя
async function removeSetForMe() {
    const checkbox = document.getElementById("chb_set_to_me");
    checkbox.removeAttribute("disabled");
    checkbox.checked = false;

    console.info(
        `[Хелпер] - [АРМ] - [Обращения] Убрано назначение обращения на себя`,
    );
}
