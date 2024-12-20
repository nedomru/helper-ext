if (document.URL.indexOf("okc.ertelecom.ru") !== -1) {
    function getCookie(cname) {
        const name = cname + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1);
            if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    const PHPSESSID = getCookie("PHPSESSID");
    browser.storage.sync.set(
        {okc_phpSessionId: PHPSESSID},
        function () {
            console.info(`[Хелпер] - [Настройки] - Обновлен актуальный PHPSESSID :`, PHPSESSID)
        }
    );
}