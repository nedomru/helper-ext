/*global browser*/

async function handleMacSubmit() {
    /**
     * Handle MAC-address submission.
     * Validates the MAC address format and fetches information from an API.
     * Uses API https://api.maclookup.app/v2/macs/{mac_address}
     * MAC regex: ^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$
     */
    document.getElementById("result-container").innerHTML = "";
    const loadingSpinner = document.getElementById("loadingResultsSpinner");

    const inputField = document.getElementById("input-mac");
    let mac_address = inputField.value.trim();
    const mac_regex = new RegExp("^([0-9A-Fa-f]{2}[:-]?){5}([0-9A-Fa-f]{2})$");

    if (mac_regex.test(mac_address) === false) {
        $.notify("MAC некорректный", "error");
        return;
    }

    loadingSpinner.style.display = "block";

    try {
        const response = await fetch(`https://api.maclookup.app/v2/macs/${mac_address}`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            },
        },);
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

        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);
        inputField.value = "";
    } catch (error) {
        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerText = "Не удалось проверить MAC-адрес";
        error("Ошибка:", error);
    }
}

async function handleIPSubmit() {
    /**
     * Handle IP-address submission.
     * Validates the IP address format and fetches information from an API.
     * Uses API https://api.ipquery.io/{ip_address}?format=yaml
     * IP regex: ^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
     */
    document.getElementById("result-container").innerHTML = "";
    const loadingSpinner = document.getElementById("loadingResultsSpinner");

    const inputField = document.getElementById("input-ip");
    let ip_address = inputField.value.trim();
    const ip_regex = new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",);

    if (ip_regex.test(ip_address) === false) {
        $.notify("IP некорректный", "error");
        return;
    }

    loadingSpinner.style.display = "block";

    try {
        const response = await fetch(`https://api.ipquery.io/${ip_address}?format=yaml`, {
            method: "GET", headers: {
                "Content-Type": "application/json",
            },
        },);
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

        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);
        inputField.value = "";
    } catch (error) {
        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerText = "Не удалось проверить Whois домена";
        error("Ошибка:", error);
    }
}

async function handleLinkSubmit() {
    /*
     * Shortening links with clck.ru API
     * Default use API https://clck.ru/--?url=
     */
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
        error("Fetch error:", error);
    }
}

async function handleSpecialistSubmit() {
    /**
     * Specialist check from Dossier API
     * Uses API https://okc2.ertelecom.ru/yii/dossier/api/get-dossier
     */
    const inputField = document.getElementById("input-specialist");
    const resultsDiv = document.getElementById("specialist-results");
    const loadingSpinner = document.getElementById("loadingResultsSpinner");
    const searchTerm = inputField.value.trim().toLowerCase();

    document.getElementById("result-container").innerHTML = "";
    resultsDiv.innerHTML = "";
    loadingSpinner.style.display = "block";

    if (!searchTerm) return;

    try {
        let employees_data = await getFromStorage("employeesData");

        if (employees_data) {
            info(`[Хелпер] - [Общее] - [Специалисты] Список специалистов загружен из кеша`,);
            resultsDiv.style.display = "block";
            await updateEmployees();
        } else {
            employees_data = await updateEmployees();
        }

        // Filter employees based on search term
        const filteredEmployees = employees_data.filter((emp) => emp.name.toLowerCase().includes(searchTerm),);

        if (filteredEmployees.length === 0) {
            $.notify("Сотрудник не найден", "warning");
            resultsDiv.style.display = "none";
            loadingSpinner.style.display = "none";
            return;
        }

        if (filteredEmployees.length === 1) {
            const requestBody = {
                employee: filteredEmployees[0].id,
            };


            const employee_data = await fetch(`https://okc2.ertelecom.ru/yii/dossier/api/get-dossier`, {
                method: "POST", credentials: "include", headers: {
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                }, referrerPolicy: "strict-origin-when-cross-origin", body: JSON.stringify(requestBody), mode: "cors",
            },);

            if (employee_data.status !== 200) {
                $.notify("Ошибка", "error");
                return;
            }

            const employee = await employee_data.json();

            loadingSpinner.style.display = "none";

            const fillPostsHistory = (postsHistory) => {
                return postsHistory
                    .map((post) => `
    <tr>
      <th>${post.TRANSFER_DATE}</th>
      <td class="align-middle">${post.POST_NAME}</td>
    </tr>
  `,)
                    .join("");
            };

            const tableHTML = `
            <hr class="hr" />
            <h5>Результаты проверки специалиста</h5>
            <table class="table table-hover table-bordered table-responsive table-sm">
                <tbody class="table-group-divider">
                    <tr>
                        <th>ФИО</th>
                        <td class="align-middle">${employee.employeeInfo.FIO}</td>
                    </tr>
                    <tr>
                        <th>Должность</th>
                        <td class="align-middle">${employee.employeeInfo.POST_NAME}</td>
                    </tr>
                    <tr>
                        <th>Направление</th>
                        <td class="align-middle">${employee.employeeInfo.SUBDIVISION_NAME}</td>
                    </tr>
                    <tr>
                        <th>Руководитель</th>
                        <td class="align-middle">${employee.employeeInfo.HEAD_NAME}</td>
                    </tr>
                    <tr>
                        <th>Трудоустроен</th>
                        <td class="align-middle">${employee.employeeInfo.EMPLOYMENT_DATE}</td>
                    </tr>
                    <tr>
                        <th>День рождения</th>
                        <td class="align-middle">${employee.employeeInfo.BIRTHDAY}</td>
                    </tr>
                    <tr>
                        <th>Город</th>
                        <td class="align-middle">${employee.employeeInfo.CITY_NAME}</td>
                    </tr>

                </tbody>
            </table>
            <h5>История должностей</h5>
            <table class="table table-hover table-bordered table-responsive table-sm">
                <tbody class="table-group-divider">
                    ${fillPostsHistory(employee.postsHistory)}
                </tbody>
            </table>
        `;
            document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);
            inputField.value = "";
            return;
        }

        // If multiple employees found, show selection UI
        resultsDiv.innerHTML = `
            <div class="list-group">
                ${filteredEmployees
            .map((emp) => `
                    <button type="button"
        class="list-group-item list-group-item-action"
        data-employee-id="${emp.id}">
    ${emp.name}
</button>
                `,)
            .join("")}
            </div>
        `;

        resultsDiv.style.display = "block";
        loadingSpinner.style.display = "none";

        document.querySelectorAll(".list-group-item").forEach((button) => {
            button.addEventListener("click", (e) => {
                const employeeId = e.currentTarget.dataset.employeeId;
                selectEmployee(employeeId);
            });
        });
    } catch (error) {
        $.notify("Произошла ошибка", "error");
        console.error(error);
    }
}

async function updateEmployees() {
    /**
     * Updates the list of employees and saves them to local browser storage
     */
    const employees_response = await fetch(`https://okc2.ertelecom.ru/yii/dossier/api/get-employees`, {
        method: "POST", credentials: "include", headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        }, referrerPolicy: "strict-origin-when-cross-origin", mode: "cors",
    },);

    if (employees_response.status !== 200) {
        $.notify("Ошибка", "error");
        return;
    }

    const employees = await employees_response.json();
    await saveToStorage("employeesData", employees);
    return employees
}

async function selectEmployee(employeeId) {
    /**
     * Get data about selected employee with its ID
     * @param {number} employeeId - ID of the employee to get data about
     */
    const loadingSpinner = document.getElementById("loadingResultsSpinner");
    loadingSpinner.style.display = "block";

    const inputField = document.getElementById("input-specialist");
    document.getElementById("specialist-results").style.display = "none";

    const requestBody = {
        employee: employeeId,
    };

    const employee_data = await fetch(`https://okc2.ertelecom.ru/yii/dossier/api/get-dossier`, {
        method: "POST", credentials: "include", headers: {
            accept: "application/json, text/plain, */*",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        }, referrerPolicy: "strict-origin-when-cross-origin", body: JSON.stringify(requestBody), mode: "cors",
    },);

    if (employee_data.status !== 200) {
        $.notify("Ошибка", "error");
        return;
    }

    const fillPostsHistory = (postsHistory) => {
        return postsHistory
            .map((post) => `
    <tr>
      <th>${post.TRANSFER_DATE}</th>
      <td class="align-middle">${post.POST_NAME}</td>
    </tr>
  `,)
            .join("");
    };

    const employee = await employee_data.json();
    const tableHTML = `
            <hr class="hr" />
            <h5>Результаты проверки специалиста</h5>
            <table class="table table-hover table-bordered table-responsive table-sm">
                <tbody class="table-group-divider">
                    <tr>
                        <th>ФИО</th>
                        <td class="align-middle">${employee.employeeInfo.FIO}</td>
                    </tr>
                    <tr>
                        <th>Должность</th>
                        <td class="align-middle">${employee.employeeInfo.POST_NAME}</td>
                    </tr>
                    <tr>
                        <th>Направление</th>
                        <td class="align-middle">${employee.employeeInfo.SUBDIVISION_NAME}</td>
                    </tr>
                    <tr>
                        <th>Руководитель</th>
                        <td class="align-middle">${employee.employeeInfo.HEAD_NAME}</td>
                    </tr>
                    <tr>
                        <th>Трудоустроен</th>
                        <td class="align-middle">${employee.employeeInfo.EMPLOYMENT_DATE}</td>
                    </tr>
                    <tr>
                        <th>День рождения</th>
                        <td class="align-middle">${employee.employeeInfo.BIRTHDAY}</td>
                    </tr>
                    <tr>
                        <th>Город</th>
                        <td class="align-middle">${employee.employeeInfo.CITY_NAME}</td>
                    </tr>

                </tbody>
            </table>
            <h5>История должностей</h5>
            <table class="table table-hover table-bordered table-responsive table-sm">
                <tbody class="table-group-divider">
                    ${fillPostsHistory(employee.postsHistory)}
                </tbody>
            </table>
        `;
    document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);
    inputField.value = "";
    loadingSpinner.style.display = "none";
}

async function handlePremiumSubmit() {
    /**
     * Handle premium submit
     * Uses premium-select value to get specialist line
     * Uses month and year values to get premium data from API
     * Uses API https://okc.ertelecom.ru/stats/premium/{specialistLine}/get-premium-{line}-month
     */
    document.getElementById("result-container").innerHTML = "";
    const monthSelector = document.getElementById("monthSelect");

    const monthValue = monthSelector.options[monthSelector.selectedIndex].value;
    const monthName = monthSelector.options[monthSelector.selectedIndex].text;
    const yearValue = document.getElementById("yearSelect").value;

    const month = parseInt(monthValue, 10);
    const year = parseInt(yearValue, 10);
    const loadingSpinner = document.getElementById("loadingResultsSpinner");
    loadingSpinner.style.display = "block";

    const inputField = document.getElementById("premium-select").value;
    try {
        await browser.storage.sync.set({POPUP_userLine: inputField});
        info(`[Хелпер] - [Проверка премии] Линия специалиста установлена: ${inputField}`,);
    } catch (error) {
        console.error(`[Хелпер] - [Проверка премии] Ошибка при сохранении линии:`, error,);
    }

    // Determine URL based on selection
    let url;
    switch (inputField) {
        case "specialist":
            url = "https://okc2.ertelecom.ru/yii/premium/ntp-nck/get-premium-spec-month";
            break;
        case "head":
            url = "https://okc2.ertelecom.ru/yii/premium/ntp-nck/get-premium-head-month";
            break;
        default:
            console.error(`[Хелпер] - [Проверка премии] Ошибка получения должности`);
    }

    const formattedDate = `01.${String(month).padStart(2, "0")}.${year}`;

    // Create request body
    const requestBody = {
        period: formattedDate, subdivisionId: [], headsId: [], employeesId: [],
    };

    try {
        const response = await fetch(url, {
            method: "POST", credentials: "include", headers: {
                accept: "application/json, text/plain, */*",
                "content-type": "application/json",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            }, referrerPolicy: "strict-origin-when-cross-origin", body: JSON.stringify(requestBody), mode: "cors",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        let tableHTML;
        if (inputField === "nck1") {
            const result = data[0];
            tableHTML = `
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
                        <th scope="row">Месяц</th>
                        <td colspan="3" class="align-middle">${monthName}, ${yearValue}</td>
                    </tr>
                    <tr>
                        <th scope="row">Общая премия</th>
                        <td colspan="3" class="align-middle">${result.TOTAL_PREMIUM ? result.TOTAL_PREMIUM : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Кол-во чатов</th>
                        <td colspan="3" class="align-middle">${result.TOTAL_CHATS ? result.TOTAL_CHATS : "-"}</td>
                    </tr>
                    <tr>
                        <th scope="row">Тесты</th>
                        <td colspan="3" class="align-middle" style="text-decoration: underline; cursor: pointer;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за тесты:<br>
                            Всё сдано = 5%<br>
                            < Всё сдано = 0%<br><br>

                            Кликни для открытия тестов"><a href="https://okc2.ertelecom.ru/yii/testing/lk/profile" target="_blank" style="text-decoration:none; color:inherit;">${result.PERC_TESTING ? result.PERC_TESTING : "-"}%</a></td>
                    </tr>
                    <tr>
                        <th scope="row">Благодарности</th>
                        <td colspan="3" class="align-middle" style="text-decoration: underline;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за благи:<br>
                            >= 2 благи = 6%<br>
                            1 блага = 3%<br>
                            < 1 благи = 0%"
                        >${result.PERC_THANKS ? result.PERC_THANKS : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Ручная правка</th>
                        <td colspan="3" class="align-middle">${result.HEAD_ADJUST ? result.HEAD_ADJUST : "-"}</td>
                    </tr>
                    <tr>
                        <th scope="row">Оценка</th>
                        <td class="align-middle">${result.CSI ? result.CSI : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за оценку:<br>
                            ${(result.CSI_NORMATIVE * 1.01).toFixed(2)} = 20%<br>
                            ${(result.CSI_NORMATIVE * 1.005).toFixed(2)} = 15%<br>
                            ${(result.CSI_NORMATIVE * 1).toFixed(2)} = 10%<br>
                            ${(result.CSI_NORMATIVE * 0.98).toFixed(2)} = 5%<br>
                            < ${(result.CSI_NORMATIVE * 0.98).toFixed(2)} = 0%<br><br>
                            Текущий % выполнения: ${result.NORM_CSI ? result.NORM_CSI : "-"}%"
                        >${result.CSI_NORMATIVE ? result.CSI_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_CSI ? result.PERC_CSI : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Отклик</th>
                        <td class="align-middle">${result.CSI_RESPONSE ? result.CSI_RESPONSE : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за оценку:<br>
                            ${result.CSI_RESPONSE_NORMATIVE} = Премия есть<br>
                            < ${result.CSI_RESPONSE_NORMATIVE} = Премии нет<br><br>
                            Текущий % выполнения: ${result.NORM_CSI_RESPONSE ? result.NORM_CSI_RESPONSE : "-"}%"
                        >${result.CSI_RESPONSE_NORMATIVE ? result.CSI_RESPONSE_NORMATIVE : "-"}</td>
                        <td class="align-middle">-</td>
                    </tr>
                    <tr>
                        <th scope="row">FLR</th>
                        <td class="align-middle">${result.FLR ? result.FLR : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за FLR:<br>
                            ${(result.FLR_NORMATIVE * 1.03).toFixed(2)} = 30%<br>
                            ${(result.FLR_NORMATIVE * 1.02).toFixed(2)} = 25%<br>
                            ${(result.FLR_NORMATIVE * 1.01).toFixed(2)} = 21%<br>
                            ${(result.FLR_NORMATIVE * 1).toFixed(2)} = 18%<br>
                            ${(result.FLR_NORMATIVE * 0.95).toFixed(2)} = 13%<br>
                            < ${(result.FLR_NORMATIVE * 0.95).toFixed(2)} = 8%<br><br>
                            Текущий % выполнения: ${result.NORM_FLR ? result.NORM_FLR : "-"}%"
                        >${result.FLR_NORMATIVE ? result.FLR_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_FLR ? result.PERC_FLR : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">ГОК</th>
                        <td class="align-middle">${result.GOK ? result.GOK : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за ГОК:<br>
                            >= ${(result.GOK_NORMATIVE * 1).toFixed(2)} = 17%<br>
                            ${(result.GOK_NORMATIVE * 0.95).toFixed(2)} = 15%<br>
                            ${(result.GOK_NORMATIVE * 0.9).toFixed(2)} = 12%<br>
                            ${(result.GOK_NORMATIVE * 0.85).toFixed(2)} = 9%<br>
                            ${(result.GOK_NORMATIVE * 0.8).toFixed(2)} = 5%<br>
                            < ${(result.GOK_NORMATIVE * 0.8).toFixed(2)} = 0%<br><br>
                            Текущий % выполнения: ${result.NORM_GOK ? result.NORM_GOK : "-"}%"
                        >${result.GOK_NORMATIVE ? result.GOK_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_GOK ? result.PERC_GOK : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">СЦ</th>
                        <td class="align-middle">${result.PERS_FACT ? result.PERS_FACT : "-"}</td>
                        <td class="align-middle">${result.PERS_PLAN_1 ? `${result.PERS_PLAN_1} / ${result.PERS_PLAN_2}` : "-"}</td>
                        <td class="align-middle">${result.PERS_PERCENT ? result.PERS_PERCENT : "-"}%</td>
                    </tr>
                </tbody>
            </table>
        `;
        } else if (inputField === "nck2") {
            const result = data[0];
            tableHTML = `
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
                        <th scope="row">Месяц</th>
                        <td colspan="3" class="align-middle">${monthName}, ${yearValue}</td>
                    </tr>
                    <tr>
                        <th scope="row">Общая премия</th>
                        <td colspan="3" class="align-middle">${result.TOTAL_PREMIUM ? result.TOTAL_PREMIUM : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Кол-во чатов</th>
                        <td colspan="3" class="align-middle">${result.TOTAL_CHATS ? result.TOTAL_CHATS : "-"}</td>
                    </tr>
                    <tr>
                        <th scope="row">Тесты</th>
                        <td colspan="3" class="align-middle" style="text-decoration: underline; cursor: pointer;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за тесты:<br>
                            Всё сдано = 5%<br>
                            < Всё сдано = 0%<br><br>

                            Кликни для открытия тестов"><a href="https://okc2.ertelecom.ru/yii/testing/lk/profile" target="_blank" style="text-decoration:none; color:inherit;">${result.PERC_TESTING ? result.PERC_TESTING : "-"}%</a></td>
                    </tr>
                    <tr>
                        <th scope="row">Благодарности</th>
                        <td colspan="3" class="align-middle" style="text-decoration: underline;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за благи:<br>
                            >= 2 благи = 6%<br>
                            1 блага = 3%<br>
                            < 1 благи = 0%"
                        >${result.PERC_THANKS ? result.PERC_THANKS : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Ручная правка</th>
                        <td colspan="3" class="align-middle">${result.HEAD_ADJUST ? result.HEAD_ADJUST : "-"}</td>
                    </tr>
                    <tr>
                        <th scope="row">Оценка</th>
                        <td class="align-middle">${result.CSI ? result.CSI : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за оценку:<br>
                            ${(result.CSI_NORMATIVE * 1.008).toFixed(2)} = 20%<br>
                            ${(result.CSI_NORMATIVE * 1.004).toFixed(2)} = 15%<br>
                            ${(result.CSI_NORMATIVE * 1).toFixed(2)} = 10%<br>
                            ${(result.CSI_NORMATIVE * 0.98).toFixed(2)} = 5%<br>
                            < ${(result.CSI_NORMATIVE * 0.98).toFixed(2)} = 0%<br><br>
                            Текущий % выполнения: ${result.NORM_CSI ? result.NORM_CSI : "-"}%"
                        >${result.CSI_NORMATIVE ? result.CSI_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_CSI ? result.PERC_CSI : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Отклик</th>
                        <td class="align-middle">${result.CSI_RESPONSE ? result.CSI_RESPONSE : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за оценку:<br>
                            ${result.CSI_RESPONSE_NORMATIVE} = Премия есть<br>
                            < ${result.CSI_RESPONSE_NORMATIVE} = Премии нет<br><br>
                            Текущий % выполнения: ${result.NORM_CSI_RESPONSE ? result.NORM_CSI_RESPONSE : "-"}%"
                        >${result.CSI_RESPONSE_NORMATIVE ? result.CSI_RESPONSE_NORMATIVE : "-"}</td>
                        <td class="align-middle">-</td>
                    </tr>
                    <tr>
                        <th scope="row">FLR</th>
                        <td class="align-middle">${result.FLR ? result.FLR : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за FLR:<br>
                            ${(result.FLR_NORMATIVE * 1.03).toFixed(2)} = 30%<br>
                            ${(result.FLR_NORMATIVE * 1.02).toFixed(2)} = 25%<br>
                            ${(result.FLR_NORMATIVE * 1.01).toFixed(2)} = 21%<br>
                            ${(result.FLR_NORMATIVE * 1).toFixed(2)} = 18%<br>
                            ${(result.FLR_NORMATIVE * 0.97).toFixed(2)} = 13%<br>
                            < ${(result.FLR_NORMATIVE * 0.97).toFixed(2)} = 8%<br><br>
                            Текущий % выполнения: ${result.NORM_FLR ? result.NORM_FLR : "-"}%"
                        >${result.FLR_NORMATIVE ? result.FLR_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_FLR ? result.PERC_FLR : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">ГОК</th>
                        <td class="align-middle">${result.GOK ? result.GOK : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за ГОК:<br>
                            >= ${(result.GOK_NORMATIVE * 1).toFixed(2)} = 17%<br>
                            ${(result.GOK_NORMATIVE * 0.98).toFixed(2)} = 15%<br>
                            ${(result.GOK_NORMATIVE * 0.94).toFixed(2)} = 12%<br>
                            ${(result.GOK_NORMATIVE * 0.82).toFixed(2)} = 9%<br>
                            ${(result.GOK_NORMATIVE * 0.76).toFixed(2)} = 5%<br>
                            < ${(result.GOK_NORMATIVE * 0.76).toFixed(2)} = 0%<br><br>
                            Текущий % выполнения: ${result.NORM_GOK ? result.NORM_GOK : "-"}%"
                        >${result.GOK_NORMATIVE ? result.GOK_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_GOK ? result.PERC_GOK : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">СЦ</th>
                        <td class="align-middle">${result.PERS_FACT ? result.PERS_FACT : "-"}</td>
                        <td class="align-middle">${result.PERS_PLAN_1 ? `${result.PERS_PLAN_1} / ${result.PERS_PLAN_2}` : "-"}</td>
                        <td class="align-middle">${result.PERS_PERCENT ? result.PERS_PERCENT : "-"}%</td>
                    </tr>
                </tbody>
            </table>
        `;
        } else {
            const result = data["premium"][0];
            tableHTML = `
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
                        <th scope="row">Руководитель</th>
                        <td colspan="3" class="align-middle">${result.USER_FIO}</td>
                    </tr>
                    <tr>
                        <th scope="row">Месяц</th>
                        <td colspan="3" class="align-middle">${monthName}, ${yearValue}</td>
                    </tr>
                    <tr>
                        <th scope="row">Общая премия</th>
                        <td colspan="3" class="align-middle">${result.TOTAL_PREMIUM ? result.TOTAL_PREMIUM : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">Ручная правка</th>
                        <td colspan="3" class="align-middle">${result.HEAD_ADJUST ? result.HEAD_ADJUST : "-"}</td>
                    </tr>
                    <tr>
                        <th scope="row">ГОК</th>
                        <td class="align-middle">${result.GOK ? result.GOK : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за качество обслуживания:<br>
                            ${(result.GOK_NORMATIVE * 1.04).toFixed(2)} = 20%<br>
                            ${(result.GOK_NORMATIVE * 1.02).toFixed(2)} = 18%<br>
                            ${(result.GOK_NORMATIVE * 1.0).toFixed(2)} = 16%<br>
                            ${(result.GOK_NORMATIVE * 0.96).toFixed(2)} = 14%<br>
                            ${(result.GOK_NORMATIVE * 0.91).toFixed(2)} = 12%<br>
                            ${(result.GOK_NORMATIVE * 0.8).toFixed(2)} = 10%<br>
                            < ${(result.GOK_NORMATIVE * 0.8).toFixed(2)} = 0%<br><br>
                            Текущий % выполнения: ${result.NORM_GOK ? result.NORM_GOK : "-"}%"
                        >${result.GOK_NORMATIVE ? result.GOK_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_GOK ? result.PERC_GOK : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">FLR</th>
                        <td class="align-middle">${result.FLR ? result.FLR : "-"}</td>
                        <td class="align-middle" style="text-decoration: underline;"
                            data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за FLR:<br>
                            ${(result.FLR_NORMATIVE * 1.2).toFixed(2)} = 25%<br>
                            ${(result.FLR_NORMATIVE * 1.14).toFixed(2)} = 23%<br>
                            ${(result.FLR_NORMATIVE * 1.07).toFixed(2)} = 18%<br>
                            ${(result.FLR_NORMATIVE * 1.0).toFixed(2)} = 16%<br>
                            ${(result.FLR_NORMATIVE * 0.96).toFixed(2)} = 14%<br>
                            < ${(result.FLR_NORMATIVE * 0.96).toFixed(2)} = 10%<br><br>
                            Текущий % выполнения: ${result.NORM_FLR ? result.NORM_FLR : "-"}%"
                        >${result.FLR_NORMATIVE ? result.FLR_NORMATIVE : "-"}</td>
                        <td class="align-middle">${result.PERC_FLR ? result.PERC_FLR : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">СЦ</th>
                        <td class="align-middle">${result.PERS_FACT ? result.PERS_FACT : "-"}</td>
                        <td style="text-decoration: underline;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за СЦ:<br>
                            2 норматива = 25%<br>
                            1 норматив = 16%<br>
                            < 1 норматива = 0%"
                        >${result.PERS_PLAN_1 ? result.PERS_PLAN_1 : "-"}/${result.PERS_PLAN_2 ? result.PERS_PLAN_2 : "-"}</td>
                        <td class="align-middle">${result.PERS_PERCENT ? result.PERS_PERCENT : "-"}%</td>
                    </tr>
                    <tr>
                        <th scope="row">SL</th>
                        <td class="align-middle">${result.SL_FACT ? result.SL_FACT : "-"}</td>
                        <td style="text-decoration: underline;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за SL:<br>
                            2 норматива = 10%<br>
                            1 норматив = 5%<br>
                            < 1 норматива = 0%"
                        >${result.SL_PLAN_1 ? result.SL_PLAN_1 : "-"}/${result.SL_PLAN_2 ? result.SL_PLAN_2 : "-"}</td>
                        <td class="align-middle">${result.SL_PERCENT ? result.SL_PERCENT : "-"}%</td>
                    </tr>
                </tbody>
            </table>
        `;
        }

        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);

        // Initialize tooltips
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]',);
        const tooltipList = [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl, {
            placement: "right",
        }),);
    } catch (error) {
        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerText = "Не удалось получить премию\nУбедись, что ты авторизован(а) на okc2.ertelecom.ru/yii";
        console.error("Ошибка:", error);
    }
}

async function handleGPTSubmit() {
    /**
     * Handle GPT request submit
     * Uses user input message and model to call our API
     */
    document.getElementById("result-container").innerHTML = ""; // Clear previous results
    const modelSelector = document.getElementById("model-select"); // Get selected model
    const message = document.getElementById("gpt-text").value; // Get user message input

    const loadingSpinner = document.getElementById("loadingResultsSpinner");
    loadingSpinner.style.display = "block"; // Show loading spinner

    // Get the model chosen by the user
    const model = modelSelector.value;

    // Ensure we have a valid message and model
    if (!message || !model) {
        alert("Please provide both a message and select a model.");
        loadingSpinner.style.display = "none"; // Hide loading spinner
        return;
    }

    let modelToUse;
    switch (model) {
        case "quasar-alpha":
            modelToUse = "quasar-alpha"
            break
        case "gemini-2.5-pro":
            modelToUse = "google/gemini-2.5-pro-exp-03-25:free"
            break
        case "deepseek-v3":
            modelToUse = "deepseek/deepseek-chat:free"
            break
        case "deepseek-r1":
            modelToUse = "deepseek/deepseek-r1:free"
            break
        case "gemini-2.0-flash":
            modelToUse = "google/gemini-2.0-flash-exp:free"
            break
    }

    // Create the request body for our API
    const requestBody = {
        message: message, model: modelToUse,
    };

    const url = "https://helper.chrsnv.ru/api/gpt.json";

    try {
        // Send the request to the API
        const response = await fetch(url, {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(requestBody),
        });

        // Check for a successful response
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response data
        const data = await response.json();
        await info(data)

        // Extract the answer text from the response
        const answerText = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || "-";

        // Function to copy the answer text to clipboard and highlight it
        function copyToClipboard(button) {
            const textElement = button.previousElementSibling; // Get the text element (td with the answer)
            const originalColor = textElement.style.backgroundColor;

            navigator.clipboard.writeText(answerText).then(() => {
                textElement.style.backgroundColor = "#fffae6"; // Highlight color (light yellow)
                textElement.classList.add("highlight-animation"); // Trigger the animation class
                setTimeout(() => {
                    textElement.style.backgroundColor = originalColor; // Reset background color
                    textElement.classList.remove("highlight-animation"); // Remove animation class after 1 second
                }, 1000);
            }).catch(err => {
                console.error('Error copying text: ', err);
            });
        }

        // Process and display the data in a table
        let tableHTML = `
            <table class="table table-hover table-bordered table-responsive table-sm">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Значение</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <th scope="row">Модель</th>
                        <td class="align-middle">${data.model || "-"}</td>
                    </tr>
                    <tr>
                        <th scope="row">Запрос</th>
                        <td class="align-middle">${message}</td>
                    </tr>
                    <tr>
                        <th scope="row">Ответ</th>
                        <td class="align-middle">
                            ${answerText}
                        </td>
                    </tr>
                </tbody>
            </table>
        `;

        // Hide loading spinner and update the result container with the new table
        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);

    } catch (error) {
        // Handle any errors (e.g., network or API errors)
        console.error("Error:", error);
        loadingSpinner.style.display = "none"; // Hide the loading spinner
        alert("An error occurred while fetching data. Please try again.");
    }
}


function populatePremiumDropdown() {
    /**
     * Sets available data values in premium dropdown
     */
    const yearSelect = document.getElementById("yearSelect");
    const monthSelect = document.getElementById("monthSelect");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11

    // Clear any existing options
    yearSelect.innerHTML = "";

    // Populate the dropdown with the current year and the last five years
    for (let year = currentYear; year >= currentYear - 5; year--) {
        // From current year to 5 years ago
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Set the default values to the current year and month
    yearSelect.value = currentYear;
    monthSelect.selectedIndex = currentMonth;
}
