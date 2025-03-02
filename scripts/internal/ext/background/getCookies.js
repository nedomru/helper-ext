if (document.URL.indexOf("okc.ertelecom.ru") !== -1) {
  function getCookie(cname) {
    /**
     * Get cookie from browser storage
     */
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
  browser.storage.sync.set({ okc_phpSessionId: PHPSESSID }, function () {
    console.info(
      `[Хелпер] - [Настройки] - Обновлен актуальный PHPSESSID :`,
      PHPSESSID,
    );
  });
}

async function getOKCSessionId() {
  /**
   * Get okc_phpSessionId from browser storage if it exists, otherwise try to get from current browser cookies
   */
  try {
    // First try to get from storage
    const result = await browser.storage.sync.get("okc_phpSessionId");
    if (result.okc_phpSessionId) {
      console.info(
        "[Хелпер] - [Настройки] - Получен PHPSESSID из storage:",
        result.okc_phpSessionId,
      );
      return result.okc_phpSessionId;
    }

    // If not in storage, try to get from cookies
    const cookies = await browser.cookies.get({
      url: "https://okc.ertelecom.ru",
      name: "PHPSESSID",
    });

    if (cookies) {
      const PHPSESSID = cookies.value;
      // Save to storage for future use
      await browser.storage.sync.set({ okc_phpSessionId: PHPSESSID });
      console.info(
        "[Хелпер] - [Настройки] - Получен и сохранен PHPSESSID из cookies:",
        PHPSESSID,
      );
      return PHPSESSID;
    }

    console.warn(
      "[Хелпер] - [Настройки] - PHPSESSID не найден ни в storage, ни в cookies",
    );
    return null;
  } catch (error) {
    console.error(
      "[Хелпер] - [Настройки] - Ошибка при получении PHPSESSID:",
      error,
    );
    return null;
  }
}
