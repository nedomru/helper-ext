/**
 * Check for pay service checkbox, and make click to enable it
 */
async function paidHelpTrue() {
    const checkboxSelector = "#check_pay_service";
    const payServiceSelector = ".pay_service";

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "attributes") {
                const checkbox = document.querySelector(checkboxSelector);
                if (checkbox) {
                    const payServiceSpan = checkbox.closest(payServiceSelector);
                    if (payServiceSpan) {
                        if (isVisible(payServiceSpan) && !checkbox.checked) {
                            triggerPayServiceChange(checkbox);
                            observer.disconnect();
                        }
                    }
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "disabled"],
    });
}

/**
 * Make click and change event on pay service checkbox
 * @param checkbox
 */
function triggerPayServiceChange(checkbox) {
    const clickEvent = new MouseEvent("click", {
        bubbles: true, cancelable: true, view: window,
    });
    checkbox.dispatchEvent(clickEvent);

    const changeEvent = new Event("change", {
        bubbles: true, cancelable: true,
    });
    checkbox.dispatchEvent(changeEvent);

    checkbox.checked = true;

    const onclickStr = checkbox.getAttribute("onclick");
    if (onclickStr) {
        const match = onclickStr.match(/(\w+)\((\d+)\)/);
        if (match) {
            const [_, funcName, arg] = match;
            if (typeof window[funcName] === "function") {
                window[funcName](parseInt(arg));
            }
        }
    }
}

/**
 * Check if element is visible to user
 * @param element Element to check
 * @returns {boolean}
 */
function isVisible(element) {
    let style = window.getComputedStyle(element);
    while (element && element !== document.body) {
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return false;
        }
        element = element.parentElement;
        style = window.getComputedStyle(element);
    }
    return true;
}

/**
 * Automatic removing enabled checkbox from wrong transfer
 */
async function wrongTransferFalse() {
    const radioButton = document.querySelector('input[type="radio"][name="wrongTransfer"][value="0"]',);
    if (radioButton) {
        radioButton.removeAttribute("disabled");
        radioButton.click();

        console.info(`[Хелпер] - [АРМ] - [Обращения] Отмечено как не ошибочное`);
    }
}

/**
 * Automatic removing enabled checkbox from "Назначить на меня"
 */
async function removeSetForMe() {
    const checkbox = document.getElementById("chb_set_to_me");
    checkbox.removeAttribute("disabled");
    checkbox.checked = false;

    console.info(`[Хелпер] - [АРМ] - [Обращения] Убрано назначение обращения на себя`,);
}
