if (
    document.URL.indexOf("ertelecom.ru/cgi-bin/ppo/excells") !== -1) {
    const config = {
        ARM_allowCopy: allowCopy
    };

    browser.storage.sync.get(Object.keys(config)).then((result) => {
        Object.keys(config).forEach((key) => {
            if (result[key]) {
                config[key]();
            }
        });
    });
}

async function allowCopy() {
    setTimeout(async () => {
        const waiter = document.getElementById("waiter");
        if (!waiter) return;

        const {parentNode: parent} = waiter;
        parent.style = "";
        parent.onselectstart = "";

        const formform = document.getElementById("formform");
        if (!formform) return;

        [waiter, formform].forEach((el) => {
            el.onmousedown = el.onselectstart = (event) => event.stopPropagation();
        });
    }, 2000);
}

