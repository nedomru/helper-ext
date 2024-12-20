/*global browser*/

// Проверка MAC-адреса
async function handleMacSubmit() {
    document.getElementById("result-container").innerHTML = "";
    const loadingSpinner = document.getElementById('loadingResultsSpinner');

    const inputField = document.getElementById("input-mac")
    let mac_address = inputField.value.trim();
    const mac_regex = new RegExp("^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$");

    if (mac_regex.test(mac_address) === false) {
        $.notify("MAC некорректный", "error");
        return;
    }

    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch(
            `https://api.maclookup.app/v2/macs/${mac_address}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.status !== 200) {
            $.notify("Не удалось найти", "error");
            return;
        }

        const result = await response.json();

        const tableHTML = `
            <hr class="hr" />
            <h5>Результаты проверки MAC-адреса</h5>
            <a href="https://api.maclookup.app/v2/macs/${mac_address}"><i>Полные результаты</i></a>
            <table class="table table-hover table-bordered table-responsive table-sm">
                <tbody class="table-group-divider">
                    <tr>
                        <th>MAC-адрес</th>
                        <td class="align-middle">${mac_address}</td>
                    </tr>
                    <tr>
                        <th>Компания</th>
                        <td class="align-middle">${result["company"]}</td>
                    </tr>
                    <tr>
                        <th>Страна</th>
                        <td class="align-middle">${result["country"]}</td>
                    </tr>
                    <tr>
                        <th>Дата обновления пула</th>
                        <td class="align-middle">${result["updated"]}</td>
                    </tr>
                </tbody>
            </table>
        `;

        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerHTML =
            DOMPurify.sanitize(tableHTML);
        inputField.value = "";
    } catch (error) {
        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerText =
            "Не удалось проверить MAC-адрес";
        console.error("Ошибка:", error);
    }
}

// Проверка IP-адреса
async function handleIPSubmit() {
    document.getElementById("result-container").innerHTML = "";
    const loadingSpinner = document.getElementById('loadingResultsSpinner');

    const inputField = document.getElementById("input-ip")
    let ip_address = inputField.value.trim();
    const ip_regex = new RegExp(
        "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
    );

    if (ip_regex.test(ip_address) === false) {
        $.notify("IP некорректный", "error");
        return;
    }

    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch(
            `https://api.ipquery.io/${ip_address}?format=yaml`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.status !== 200) {
            $.notify("Не удалось найти", "error");
            return;
        }

        const result = await response.json();

        const tableHTML = `
            <hr class="hr" />
            <h5>Результаты проверки IP</h5>
            <a href="https://api.ipquery.io/${ip_address}?format=yaml"><i>Полные результаты</i></a>
            <div class="table-responsive">
                <table class="table table-hover table-bordered">
                    <tbody>
                        <tr>
                            <th>IP</th>
                            <td>${ip_address}</td>
                        </tr>
                        <tr>
                            <th>Провайдер</th>
                            <td>${result["isp"]["org"]}</td>
                        </tr>
                        <tr>
                            <th>Страна</th>
                            <td>${result["location"]["country"]}</td>
                        </tr>
                        <tr>
                            <th>Город</th>
                            <td>${result["location"]["city"]}</td>
                        </tr>
                        <tr>
                            <th>Область/Штат</th>
                            <td>${result["location"]["state"]}</td>
                        </tr>
                        <tr>
                            <th>Часовой пояс</th>
                            <td>${result["location"]["timezone"]}</td>
                        </tr>
                        <tr>
                            <th>Мобильная сеть</th>
                            <td>${result["risk"]["is_mobile"] === true ? "Да" : "Нет"}</td>
                        </tr>
                        <tr>
                            <th>ВПН</th>
                            <td>${result["risk"]["is_vpn"] === true ? "Да" : "Нет"}</td>
                        </tr>
                        <tr>
                            <th>Тор</th>
                            <td>${result["risk"]["is_tor"] === true ? "Да" : "Нет"}</td>
                        </tr>
                        <tr>
                            <th>Прокси</th>
                            <td>${result["risk"]["is_proxy"] === true ? "Да" : "Нет"}</td>
                        </tr>
                        <tr>
                            <th>Датацентр</th>
                            <td>${result["risk"]["is_datacenter"] === true ? "Да" : "Нет"}</td>
                        </tr>
                    </tbody>
                </table>
</div>
        `;

        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerHTML =
            DOMPurify.sanitize(tableHTML);
        inputField.value = "";
    } catch (error) {
        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerText =
            "Не удалось проверить Whois домена";
        console.error("Ошибка:", error);
    }
}

// Проверка WHOIS
async function handleWhoisSubmit() {
    document.getElementById("result-container").innerHTML = "";
    const loadingSpinner = document.getElementById('loadingResultsSpinner');

    const inputField = document.getElementById("input-whois")
    let whois_domain = inputField.value.trim();
    const domain_regex = new RegExp(
        "^(https?:\\/\\/)?([a-z0-9-]+\\.)*[a-z0-9-]+\\.[a-z]{2,}(:[0-9]+)?(\\/.*)?$"
    );

    if (domain_regex.test(whois_domain) === false) {
        $.notify("Домен некорректный", "error");
        return;
    }

    loadingSpinner.style.display = 'block';

    try {
        const response = await fetch(
            `https://who-dat.as93.net/${whois_domain}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if (response.status !== 200) {
            $.notify("Не удалось найти", "error");
            return;
        }

        const result = await response.json();

        const tableHTML = `
            <hr class="hr" />
            <h5>Результаты проверки Whois</h5>
            <a href="https://who-dat.as93.net/${whois_domain}"><i>Полные результаты</i></a>
            <table class="table table-hover table-bordered table-responsive table-sm">
                <tbody class="table-group-divider">
                    <tr>
                        <th>Домен</th>
                        <td class="align-middle">${whois_domain}</td>
                    </tr>
                    <tr>
                        <th>Статус</th>
                        <td class="align-middle">${result["domain"]["status"]}</td>
                    </tr>
                    <tr>
                        <th>DNS записи</th>
                        <td class="align-middle">${result["domain"]["name_servers"]}</td>
                    </tr>
                    <tr>
                        <th>Регистратор</th>
                        <td class="align-middle">${result["registrar"]["name"]}</td>
                    </tr>
                    <tr>
                        <th>Регистрант</th>
                        <td class="align-middle">${result["registrant"]["name"]}</td>
                    </tr>
                    <tr>
                        <th>Ответственный</th>
                        <td class="align-middle">${result["administrative"]["name"]}</td>
                    </tr>
                </tbody>
            </table>
        `;

        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerHTML =
            DOMPurify.sanitize(tableHTML);
        inputField.value = "";
    } catch (error) {
        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerText =
            "Не удалось проверить Whois домена";
        console.error("Ошибка:", error);
    }
}

// Сокращение ссылок
async function handleLinkSubmit() {
    const inputField = document.getElementById("input-link").value.trim();

    try {
        const response = await fetch(`https://clck.ru/--?url=${inputField}`, {
            method: "GET",
        });
        if (response.status !== 200) {
            $.notify("Ошибка", "error");
            return;
        }

        const result = await response.text();

        if (result) {
            await navigator.clipboard.writeText(result);
            $.notify("Скопировано", "success");
            document.getElementById("input-link").value = result;
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

// Проверка премии
async function handlePremiumSubmit() {
    document.getElementById("result-container").innerHTML = "";
    const loadingSpinner = document.getElementById('loadingResultsSpinner');
    loadingSpinner.style.display = 'block';

    const inputField = document.getElementById("premium-select").value;
    try {
        await browser.storage.sync.set({ POPUP_specialistLine: inputField });
        console.log(`[Хелпер] - [Проверка премии] Линия специалиста установлена: ${inputField}`);
    } catch (error) {
        console.error(`[Хелпер] - [Проверка премии] Ошибка при сохранении линии:`, error);
    }

    // Determine URL based on selection
    const url = inputField === "nck2"
        ? "https://okc.ertelecom.ru/stats/premium/ntp-nck2/get-premium-spec-month"
        : "https://okc.ertelecom.ru/stats/premium/ntp-nck1/get-premium-spec-month";

    // Format date for request
    const now = new Date();
    const formattedDate = `01.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;

    // Create request body
    const requestBody = {
        period: formattedDate,
        subdivisionId: [],
        headsId: [],
        employeesId: []
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            referrerPolicy: "strict-origin-when-cross-origin",
            body: JSON.stringify(requestBody),
            mode: "cors"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const result = data[0];

        const tableHTML = `
            <table class="table table-hover table-bordered table-responsive table-sm">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Факт</th>
                        <th scope="col">Норматив</th>
                        <th scope="col">Процент</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <th scope="row">Специалист</th>
                        <td colspan="3" class="align-middle">${result.USER_FIO}</td>
                    </tr>
                    <tr>
                        <th scope="row">Общая премия</th>
                        <td colspan="3" class="align-middle">${result.TOTAL_PREMIUM}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Кол-во чатов</th>
                        <td colspan="3" class="align-middle">${result.TOTAL_CHATS}</td>
                    </tr>
                    <tr>
                        <th scope="row">Тесты</th>
                        <td colspan="3" class="align-middle">${result.PERC_TESTING}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Благодарности</th>
                        <td colspan="3" class="align-middle">${result.PERC_THANKS}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Оценка</th>
                        <td class="align-middle">${result.CSI}</td>
                        <td class="align-middle">${result.CSI_NORMATIVE}</td>
                        <td class="align-middle">${result.PERC_CSI}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Отклик</th>
                        <td class="align-middle">${result.CSI_RESPONSE}</td>
                        <td class="align-middle">-</td>
                        <td class="align-middle">-</td>
                    </tr>
                    <tr>
                        <th scope="row">FLR</th>
                        <td class="align-middle">${result.FLR}</td>
                        <td class="align-middle">${result.FLR_NORMATIVE}</td>
                        <td class="align-middle">${result.PERC_FLR}%</td>
                    </tr>
                    <tr>
                        <th scope="row">ГОК</th>
                        <td class="align-middle">${result.GOK}</td>
                        <td class="align-middle">${result.GOK_NORMATIVE}</td>
                        <td class="align-middle">${result.PERC_GOK}%</td>
                    </tr>
                    <tr>
                        <th scope="row">СЦ</th>
                        <td class="align-middle">${result.PERS_FACT || '-'}</td>
                        <td class="align-middle">${result.PERS_PLAN_1 ? `${result.PERS_PLAN_1} / ${result.PERS_PLAN_2}` : '-'}</td>
                        <td class="align-middle">${result.PERS_PERCENT}%</td>
                    </tr>
                </tbody>
            </table>
        `;

        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);
    } catch (error) {
        loadingSpinner.style.display = 'none';
        document.getElementById("result-container").innerText =
            "Не удалось получить премию\nУбедись, что ты авторизован(а) на okc.ertelecom.ru";
        console.error("Ошибка:", error);
    }
}