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
     * Uses API https://api.ipquery.io/{ip_address}
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
        const response = await fetch(`https://api.ipquery.io/${ip_address}`, {
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
            <a href="https://api.ipquery.io/${ip_address}"><i>Полные результаты</i></a>
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
        document.getElementById("result-container").innerText = "Не удалось проверить IP адрес";
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

    // Get working hours from the input field
    const workingHours = parseInt(document.getElementById("workingHours").value, 10);
    const isValidHours = !isNaN(workingHours) && workingHours > 0;

    const month = parseInt(monthValue, 10);
    const year = parseInt(yearValue, 10);
    const loadingSpinner = document.getElementById("loadingResultsSpinner");
    loadingSpinner.style.display = "block";

    const inputField = document.getElementById("premium-select").value;
    try {
        await browser.storage.sync.set({POPUP_userLine: inputField});
        info(`[Хелпер] - [Проверка премии] Должность сотрудника установлена: ${inputField}`,);
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
        let hourlyRate
        if (inputField === "specialist") {
            // Create a deep copy of the result to avoid modifying the original data
            const result = JSON.parse(JSON.stringify(data[0]));
            const originalResult = JSON.parse(JSON.stringify(data[0]));

            switch (result.POST_NAME) {
                case "Специалист":
                    hourlyRate = 156.7
                    break
                case "Ведущий специалист":
                    hourlyRate = 164.2
                    break
                case "Эксперт":
                    hourlyRate = 195.9
                    break
            }

            // Calculate base salary if hours are provided
            const baseSalary = isValidHours ? workingHours * hourlyRate : 0;

            // Function to recalculate premium amounts
            const calculatePremium = () => {
                // Calculate premium amounts if hours are valid
                const totalPremiumAmount = isValidHours && result.TOTAL_PREMIUM ? Math.round(baseSalary * (result.TOTAL_PREMIUM / 100)) : "-";
                const headAdjustAmount = isValidHours && result.HEAD_ADJUST ? Math.round(baseSalary * (result.HEAD_ADJUST / 100)) : "0";
                const gokAmount = isValidHours && result.PERC_GOK ? Math.round(baseSalary * (result.PERC_GOK / 100)) : "-";
                const flrAmount = isValidHours && result.PERC_FLR ? Math.round(baseSalary * (result.PERC_FLR / 100)) : "-";
                const persAmount = isValidHours && result.PERS_PERCENT ? Math.round(baseSalary * (result.PERS_PERCENT / 100)) : "-";
                const slAmount = isValidHours && result.SL_PERCENT ? Math.round(baseSalary * (result.SL_PERCENT / 100)) : "-";
                const testingAmount = isValidHours && result.PERC_TESTING ? Math.round(baseSalary * (result.PERC_TESTING / 100)) : "-";
                const tutorAmount = isValidHours && result.PERC_TUTORS ? Math.round(baseSalary * (result.PERC_TUTORS / 100)) : "-";
                const thanksAmount = isValidHours && result.PERC_THANKS ? Math.round(baseSalary * (result.PERC_THANKS / 100)) : "-";

                // Add CSI calculation for specialists
                const csiAmount = inputField === "specialist" && isValidHours && result.PERC_CSI ?
                    Math.round(baseSalary * (result.PERC_CSI / 100)) : "-";

                return {
                    totalPremiumAmount, headAdjustAmount, gokAmount, flrAmount, persAmount, slAmount, testingAmount,tutorAmount,thanksAmount,
                    ...(inputField === "specialist" ? { csiAmount } : {})
                };
            };

            // Initial calculation
            const premiumAmounts = calculatePremium();

            tableHTML = `
            <table class="table table-hover table-bordered table-responsive table-sm">
        <thead>
            <tr>
                <th scope="col">Параметр</th>
                <th scope="col">Факт</th>
                <th scope="col">Норматив</th>
                <th scope="col">Процент</th>
                ${isValidHours ? '<th scope="col">Сумма (₽)</th>' : ''}
            </tr>
        </thead>
        <tbody class="table-group-divider">
            <tr>
                <th scope="row">Специалист</th>
                <td colspan="${isValidHours ? '4' : '3'}" class="align-middle">${result.USER_FIO}</td>
            </tr>
            <tr>
                <th scope="row">Должность</th>
                <td colspan="${isValidHours ? '4' : '3'}" class="align-middle">${result.POST_NAME}</td>
            </tr>
            <tr>
                <th scope="row">Месяц</th>
                <td colspan="${isValidHours ? '4' : '3'}" class="align-middle">${monthName}, ${yearValue}</td>
            </tr>
            <tr>
                <th scope="row">Кол-во чатов</th>
                <td colspan="${isValidHours ? '4' : '3'}" class="align-middle">${result.TOTAL_CHATS ? result.TOTAL_CHATS : "-"}</td>
            </tr>
            <tr>
                <th scope="row">Ручная правка</th>
                <td colspan="${isValidHours ? '3' : '4'}" class="align-middle">
                    ${result.HEAD_ADJUST ? result.HEAD_ADJUST : 0}
                </td>
                ${isValidHours ? `<td class="align-middle head-adjust-amount">${premiumAmounts.headAdjustAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">Наставничество</th>
                <td colspan="${isValidHours ? '3' : '4'}" class="align-middle">
                    ${result.PERC_TUTOR ? result.PERC_TUTOR : 0}
                </td>
                ${isValidHours ? `<td class="align-middle tutor-amount">${premiumAmounts.tutorAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">Тесты</th>
                <td colspan="${isValidHours ? '3' : '3'}" class="align-middle" style="text-decoration: underline; cursor: pointer;" data-bs-toggle="tooltip"
                    data-bs-html="true"
                    data-bs-title="Для премии за тесты:<br>
                    Всё сдано = 5%<br>
                    < Всё сдано = 0%<br><br>

                    Кликни для открытия тестов"><a href="https://okc2.ertelecom.ru/yii/testing/lk/profile" target="_blank" style="text-decoration:none; color:inherit;">${result.PERC_TESTING ? result.PERC_TESTING : "-"}%</a></td>
                ${isValidHours ? `<td class="align-middle testing-amount">${premiumAmounts.testingAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">Благодарности</th>
                <td colspan="${isValidHours ? '3' : '3'}" class="align-middle" style="text-decoration: underline;" data-bs-toggle="tooltip"
                    data-bs-html="true"
                    data-bs-title="Для премии за благи:<br>
                    >= 2 благи = 6%<br>
                    1 блага = 3%<br>
                    < 1 благи = 0%"
                >${result.PERC_THANKS ? result.PERC_THANKS : "-"}%</td>
                ${isValidHours ? `<td class="align-middle thanks-amount">${premiumAmounts.thanksAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">Оценка</th>
                <td class="align-middle editable-cell" data-field="CSI" data-original="${result.CSI}">${result.CSI ? result.CSI : "-"}</td>
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
                <td class="align-middle csi-percent">${result.PERC_CSI ? result.PERC_CSI : "-"}%</td>
                ${isValidHours ? `<td class="align-middle csi-amount">${premiumAmounts.csiAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">Отклик</th>
                <td class="align-middle editable-cell" data-field="CSI_RESPONSE" data-original="${result.CSI_RESPONSE}">${result.CSI_RESPONSE ? result.CSI_RESPONSE : "-"}</td>
                <td class="align-middle" style="text-decoration: underline;"
                    data-bs-toggle="tooltip"
                    data-bs-html="true"
                    data-bs-title="Для премии за оценку:<br>
                    ${result.CSI_RESPONSE_NORMATIVE} = Премия есть<br>
                    < ${result.CSI_RESPONSE_NORMATIVE} = Премии нет<br><br>
                    Текущий % выполнения: ${result.NORM_CSI_RESPONSE ? result.NORM_CSI_RESPONSE : "-"}%"
                >${result.CSI_RESPONSE_NORMATIVE ? result.CSI_RESPONSE_NORMATIVE : "-"}</td>
                <td class="align-middle response-percent">-</td>
                ${isValidHours ? `<td class="align-middle">-</td>` : ''}
            </tr>
            <tr>
                <th scope="row">FLR</th>
                <td class="align-middle editable-cell" data-field="FLR" data-original="${result.FLR}">${result.FLR ? result.FLR : "-"}</td>
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
                <td class="align-middle flr-percent">${result.PERC_FLR ? result.PERC_FLR : "-"}%</td>
                ${isValidHours ? `<td class="align-middle flr-amount">${premiumAmounts.flrAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">ГОК</th>
                <td class="align-middle editable-cell" data-field="GOK" data-original="${result.GOK}">${result.GOK ? result.GOK : "-"}</td>
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
                <td class="align-middle gok-percent">${result.PERC_GOK ? result.PERC_GOK : "-"}%</td>
                ${isValidHours ? `<td class="align-middle gok-amount">${premiumAmounts.gokAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">СЦ</th>
                <td class="align-middle editable-cell" data-field="PERS_FACT" data-original="${result.PERS_FACT}">${result.PERS_FACT ? result.PERS_FACT : "-"}</td>
                <td class="align-middle">${result.PERS_PLAN_1 ? `${result.PERS_PLAN_1} / ${result.PERS_PLAN_2}` : "-"}</td>
                <td class="align-middle pers-percent">${result.PERS_PERCENT ? result.PERS_PERCENT : "-"}%</td>
                ${isValidHours ? `<td class="align-middle pers-amount">${premiumAmounts.persAmount} ₽</td>` : ''}
            </tr>
            <tr>
                <th scope="row">Общая премия</th>
                <td colspan="${isValidHours ? '3' : '3'}" class="align-middle total-premium">${result.TOTAL_PREMIUM ? result.TOTAL_PREMIUM : "-"}%</td>
                ${isValidHours ? `<td class="align-middle total-premium-amount">${premiumAmounts.totalPremiumAmount} ₽</td>` : ''}
            </tr>
            ${isValidHours ? `
            <tr>
                <th scope="row">Оклад</th>
                <td colspan="4" class="align-middle">${baseSalary.toFixed(2)} ₽ (${workingHours} ч × ${hourlyRate} ₽/ч)</td>
            </tr>
            <tr>
                <th scope="row">Оклад + Премия</th>
                <td colspan="4" class="align-middle total-salary">${(baseSalary + parseInt(premiumAmounts.totalPremiumAmount)).toFixed(2)} ₽</td>
            </tr>
            ` : ''}
        </tbody>
    </table>
        `;
        } else {
            const result = JSON.parse(JSON.stringify(data["premium"][0]));
            const originalResult = JSON.parse(JSON.stringify(data["premium"][0]));
            hourlyRate = 225.3

            // Calculate base salary if hours are provided
            const baseSalary = isValidHours ? workingHours * hourlyRate : 0;

            // Function to recalculate premium amounts for head
            const calculatePremium = () => {
                // Calculate premium amounts if hours are valid
                const totalPremiumAmount = isValidHours && result.TOTAL_PREMIUM ? Math.round(baseSalary * (result.TOTAL_PREMIUM / 100)) : "-";
                const headAdjustAmount = isValidHours && result.HEAD_ADJUST ? Math.round(baseSalary * (result.HEAD_ADJUST / 100)) : "-";
                const gokAmount = isValidHours && result.PERC_GOK ? Math.round(baseSalary * (result.PERC_GOK / 100)) : "-";
                const flrAmount = isValidHours && result.PERC_FLR ? Math.round(baseSalary * (result.PERC_FLR / 100)) : "-";
                const persAmount = isValidHours && result.PERS_PERCENT ? Math.round(baseSalary * (result.PERS_PERCENT / 100)) : "-";
                const slAmount = isValidHours && result.SL_PERCENT ? Math.round(baseSalary * (result.SL_PERCENT / 100)) : "-";

                return {
                    totalPremiumAmount, headAdjustAmount, gokAmount, flrAmount, persAmount, slAmount
                };
            };

            // Initial calculation
            const premiumAmounts = calculatePremium();

            tableHTML = `
            <table class="table table-hover table-bordered table-responsive table-sm">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th scope="col">Факт</th>
                        <th scope="col">Норматив</th>
                        <th scope="col">Процент</th>
                        ${isValidHours ? '<th scope="col">Сумма (₽)</th>' : ''}
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                        <th scope="row">Руководитель</th>
                        <td colspan="${isValidHours ? '4' : '3'}" class="align-middle">${result.USER_FIO}</td>
                    </tr>
                    <tr>
                        <th scope="row">Месяц</th>
                        <td colspan="${isValidHours ? '4' : '3'}" class="align-middle">${monthName}, ${yearValue}</td>
                    </tr>
                    <tr>
                        <th scope="row">Ручная правка</th>
                        <td colspan="${isValidHours ? '3' : '3'}" class="align-middle">${result.HEAD_ADJUST ? result.HEAD_ADJUST : "-"}</td>
                        ${isValidHours ? `<td class="align-middle head-adjust-amount">${premiumAmounts.headAdjustAmount} ₽</td>` : ''}
                    </tr>
                    <tr>
                        <th scope="row">ГОК</th>
                        <td class="align-middle editable-cell" data-field="GOK" data-original="${result.GOK}">${result.GOK ? result.GOK : "-"}</td>
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
                        <td class="align-middle gok-percent">${result.PERC_GOK ? result.PERC_GOK : "-"}%</td>
                        ${isValidHours ? `<td class="align-middle gok-amount">${premiumAmounts.gokAmount} ₽</td>` : ''}
                    </tr>
                    <tr>
                        <th scope="row">FLR</th>
                        <td class="align-middle editable-cell" data-field="FLR" data-original="${result.FLR}">${result.FLR ? result.FLR : "-"}</td>
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
                        <td class="align-middle flr-percent">${result.PERC_FLR ? result.PERC_FLR : "-"}%</td>
                        ${isValidHours ? `<td class="align-middle flr-amount">${premiumAmounts.flrAmount} ₽</td>` : ''}
                    </tr>
                    <tr>
                        <th scope="row">СЦ</th>
                        <td class="align-middle editable-cell" data-field="PERS_FACT" data-original="${result.PERS_FACT}">${result.PERS_FACT ? result.PERS_FACT : "-"}</td>
                        <td style="text-decoration: underline;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за СЦ:<br>
                            2 норматива = 25%<br>
                            1 норматив = 16%<br>
                            < 1 норматива = 0%"
                        >${result.PERS_PLAN_1 ? result.PERS_PLAN_1 : "-"}/${result.PERS_PLAN_2 ? result.PERS_PLAN_2 : "-"}</td>
                        <td class="align-middle pers-percent">${result.PERS_PERCENT ? result.PERS_PERCENT : "-"}%</td>
                        ${isValidHours ? `<td class="align-middle pers-amount">${premiumAmounts.persAmount} ₽</td>` : ''}
                    </tr>
                    <tr>
                        <th scope="row">SL</th>
                        <td class="align-middle editable-cell" data-field="SL_FACT" data-original="${result.SL_FACT}">${result.SL_FACT ? result.SL_FACT : "-"}</td>
                        <td style="text-decoration: underline;" data-bs-toggle="tooltip"
                            data-bs-html="true"
                            data-bs-title="Для премии за SL:<br>
                            2 норматива = 10%<br>
                            1 норматив = 5%<br>
                            < 1 норматива = 0%"
                        >${result.SL_PLAN_1 ? result.SL_PLAN_1 : "-"}/${result.SL_PLAN_2 ? result.SL_PLAN_2 : "-"}</td>
                        <td class="align-middle sl-percent">${result.SL_PERCENT ? result.SL_PERCENT : "-"}%</td>
                        ${isValidHours ? `<td class="align-middle sl-amount">${premiumAmounts.slAmount} ₽</td>` : ''}
                    </tr>
                    <tr>
                        <th scope="row">Общая премия</th>
                        <td colspan="${isValidHours ? '3' : '3'}" class="align-middle total-premium">${result.TOTAL_PREMIUM ? result.TOTAL_PREMIUM : "-"}%</td>
                        ${isValidHours ? `<td class="align-middle total-premium-amount">${premiumAmounts.totalPremiumAmount} ₽</td>` : ''}
                    </tr>
                    ${isValidHours ? `
                    <tr>
                        <th scope="row">Оклад</th>
                        <td colspan="4" class="align-middle">${baseSalary.toFixed(2)} ₽ (${workingHours} ч × ${hourlyRate} ₽/ч)</td>
                    </tr>
                    <tr>
                        <th scope="row">Оклад + Премия</th>
                        <td colspan="4" class="align-middle total-salary">${(baseSalary + parseInt(premiumAmounts.totalPremiumAmount)).toFixed(2)} ₽</td>
                    </tr>
                    ` : ''}
                </tbody>
            </table>
        `;
        }

        loadingSpinner.style.display = "none";
        document.getElementById("result-container").innerHTML = DOMPurify.sanitize(tableHTML);

        // Add event listeners to editable cells
        document.querySelectorAll('.editable-cell').forEach(cell => {
            cell.addEventListener('click', function() {
                // If already in edit mode, don't do anything
                if (this.querySelector('input')) return;

                const currentValue = this.textContent !== "-" ? this.textContent : "";
                const field = this.getAttribute('data-field');
                const originalValue = this.getAttribute('data-original');

                // Store the original cell width before changing content
                const originalWidth = this.offsetWidth;

                // Create input element
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.style.width = (originalWidth - 10) + 'px'; // Account for padding
                input.style.maxWidth = '100%';
                input.style.boxSizing = 'border-box';
                input.style.border = 'none';
                input.style.outline = 'none';
                input.style.background = 'transparent';

                // Set cell width explicitly to prevent resizing
                this.style.width = originalWidth + 'px';
                this.style.maxWidth = originalWidth + 'px';

                // Clear cell content and append input
                this.textContent = '';
                this.appendChild(input);
                input.focus();

                // Handle input blur (save changes)
                input.addEventListener('blur', function() {
                    const newValue = this.value.trim() === "" ? "-" : this.value.trim();
                    const numericValue = parseFloat(newValue);

                    // Update cell content
                    cell.textContent = newValue;

                    // Check if value has changed from original
                    if (newValue !== originalValue) {
                        cell.style.backgroundColor = '#e3f2fd'; // Light blue highlight
                    } else {
                        cell.style.backgroundColor = '';
                    }

                    // Update result object with new value if it's a valid number
                    if (!isNaN(numericValue)) {
                        result[field] = numericValue;

                        // Recalculate percentages based on the new value
                        if (field === 'GOK') {
                            // Calculate GOK normative percentage
                            const normGOK = (numericValue / result.GOK_NORMATIVE) * 100;
                            result.NORM_GOK = normGOK;

                            if (inputField === "specialist") {
                                // Specialist GOK percentage rules (from second snippet)
                                if (numericValue >= result.GOK_NORMATIVE) {
                                    result.PERC_GOK = 17;
                                } else if (numericValue >= result.GOK_NORMATIVE * 0.95) {
                                    result.PERC_GOK = 15;
                                } else if (numericValue >= result.GOK_NORMATIVE * 0.9) {
                                    result.PERC_GOK = 12;
                                } else if (numericValue >= result.GOK_NORMATIVE * 0.85) {
                                    result.PERC_GOK = 9;
                                } else if (numericValue >= result.GOK_NORMATIVE * 0.8) {
                                    result.PERC_GOK = 5;
                                } else {
                                    result.PERC_GOK = 0;
                                }
                            } else {
                                // Head GOK percentage rules (from first snippet tooltip)
                                if (numericValue >= result.GOK_NORMATIVE * 1.04) {
                                    result.PERC_GOK = 20;
                                } else if (numericValue >= result.GOK_NORMATIVE * 1.02) {
                                    result.PERC_GOK = 18;
                                } else if (numericValue >= result.GOK_NORMATIVE * 1.0) {
                                    result.PERC_GOK = 16;
                                } else if (numericValue >= result.GOK_NORMATIVE * 0.96) {
                                    result.PERC_GOK = 14;
                                } else if (numericValue >= result.GOK_NORMATIVE * 0.91) {
                                    result.PERC_GOK = 12;
                                } else if (numericValue >= result.GOK_NORMATIVE * 0.8) {
                                    result.PERC_GOK = 10;
                                } else {
                                    result.PERC_GOK = 0;
                                }
                            }

                            // Update displayed percentage
                            document.querySelector('.gok-percent').textContent = `${result.PERC_GOK}%`;
                        }
                        else if (field === 'FLR') {
                            // Calculate FLR normative percentage
                            const normFLR = (numericValue / result.FLR_NORMATIVE) * 100;
                            result.NORM_FLR = normFLR;

                            if (inputField === "specialist") {
                                // Specialist FLR percentage rules (from second snippet)
                                if (numericValue >= result.FLR_NORMATIVE * 1.03) {
                                    result.PERC_FLR = 30;
                                } else if (numericValue >= result.FLR_NORMATIVE * 1.02) {
                                    result.PERC_FLR = 25;
                                } else if (numericValue >= result.FLR_NORMATIVE * 1.01) {
                                    result.PERC_FLR = 21;
                                } else if (numericValue >= result.FLR_NORMATIVE) {
                                    result.PERC_FLR = 18;
                                } else if (numericValue >= result.FLR_NORMATIVE * 0.95) {
                                    result.PERC_FLR = 13;
                                } else {
                                    result.PERC_FLR = 8;
                                }
                            } else {
                                // Head FLR percentage rules (from first snippet tooltip)
                                if (numericValue >= result.FLR_NORMATIVE * 1.2) {
                                    result.PERC_FLR = 25;
                                } else if (numericValue >= result.FLR_NORMATIVE * 1.14) {
                                    result.PERC_FLR = 23;
                                } else if (numericValue >= result.FLR_NORMATIVE * 1.07) {
                                    result.PERC_FLR = 18;
                                } else if (numericValue >= result.FLR_NORMATIVE * 1.0) {
                                    result.PERC_FLR = 16;
                                } else if (numericValue >= result.FLR_NORMATIVE * 0.96) {
                                    result.PERC_FLR = 14;
                                } else {
                                    result.PERC_FLR = 10;
                                }
                            }

                            // Update displayed percentage
                            document.querySelector('.flr-percent').textContent = `${result.PERC_FLR}%`;
                        }
                        else if (field === 'PERS_FACT') {
                            if (inputField === "specialist") {
                                // Specialist PERS percentage rules (from second snippet)
                                const planValue = (result.PERS_PLAN_1 + result.PERS_PLAN_2) / 2;
                                const normPERS = (numericValue / planValue) * 100;

                                // Simplified percentage assignment based on achievement
                                if (normPERS >= 100) {
                                    result.PERS_PERCENT = 10;
                                } else if (normPERS >= 95) {
                                    result.PERS_PERCENT = 8;
                                } else if (normPERS >= 90) {
                                    result.PERS_PERCENT = 5;
                                } else {
                                    result.PERS_PERCENT = 0;
                                }
                            } else {
                                // Head PERS percentage rules (from first snippet tooltip)
                                // The logic appears to be based on hitting 1 or 2 normatives
                                const normative1Met = numericValue >= result.PERS_PLAN_1;
                                const normative2Met = numericValue >= result.PERS_PLAN_2;

                                if (normative1Met && normative2Met) {
                                    result.PERS_PERCENT = 25; // 2 normatives
                                } else if (normative1Met) {
                                    result.PERS_PERCENT = 16; // 1 normative
                                } else {
                                    result.PERS_PERCENT = 0; // < 1 normative
                                }
                            }

                            // Update displayed percentage
                            document.querySelector('.pers-percent').textContent = `${result.PERS_PERCENT}%`;
                        }
                        else if (field === 'SL_FACT') {
                            // We don't have specialist rules for SL in the second snippet, so using head rules for both
                            const normative1Met = numericValue >= result.SL_PLAN_1;
                            const normative2Met = numericValue >= result.SL_PLAN_2;

                            if (normative1Met && normative2Met) {
                                result.SL_PERCENT = 10; // 2 normatives
                            } else if (normative1Met) {
                                result.SL_PERCENT = 5; // 1 normative
                            } else {
                                result.SL_PERCENT = 0; // < 1 normative
                            }

                            // Update displayed percentage
                            document.querySelector('.sl-percent').textContent = `${result.SL_PERCENT}%`;
                        }
                        else if (field === 'CSI' && inputField === "specialist") {
                            // Only for specialist position - CSI rules (from second snippet)
                            const normCSI = (numericValue / result.CSI_NORMATIVE) * 100;
                            result.NORM_CSI = normCSI;

                            if (numericValue >= result.CSI_NORMATIVE * 1.01) {
                                result.PERC_CSI = 20;
                            } else if (numericValue >= result.CSI_NORMATIVE * 1.005) {
                                result.PERC_CSI = 15;
                            } else if (numericValue >= result.CSI_NORMATIVE) {
                                result.PERC_CSI = 10;
                            } else if (numericValue >= result.CSI_NORMATIVE * 0.98) {
                                result.PERC_CSI = 5;
                            } else {
                                result.PERC_CSI = 0;
                            }

                            // Update displayed percentage
                            document.querySelector('.csi-percent').textContent = `${result.PERC_CSI}%`;
                        }

                        // Recalculate total premium percentage
                        result.TOTAL_PREMIUM = (
                            (result.PERC_CSI || 0) +
                            (result.PERC_FLR || 0) +
                            (result.PERC_GOK || 0) +
                            (result.PERC_TESTING || 0) +
                            (result.PERC_THANKS || 0) +
                            (result.PERS_PERCENT || 0) +
                            (result.HEAD_ADJUST || 0) +
                            (result.PERC_TUTOR || 0) +
                            (result.SL_PERCENT || 0)
                        );

                        // Update total premium display
                        document.querySelector('.total-premium').textContent = `${result.TOTAL_PREMIUM}%`;

                        // Recalculate all premium amounts
                        const updatedPremiumAmounts = calculatePremium();

                        // Update all amount displays
                        if (isValidHours) {
                            if (inputField === "specialist" && document.querySelector('.csi-amount')) {
                                document.querySelector('.csi-amount').textContent = `${updatedPremiumAmounts.csiAmount} ₽`;
                            }
                            document.querySelector('.flr-amount').textContent = `${updatedPremiumAmounts.flrAmount} ₽`;
                            document.querySelector('.gok-amount').textContent = `${updatedPremiumAmounts.gokAmount} ₽`;
                            document.querySelector('.pers-amount').textContent = `${updatedPremiumAmounts.persAmount} ₽`;
                            document.querySelector('.sl-amount').textContent = `${updatedPremiumAmounts.slAmount} ₽`;
                            document.querySelector('.head-adjust-amount').textContent = `${updatedPremiumAmounts.headAdjustAmount} ₽`;
                            document.querySelector('.total-premium-amount').textContent = `${updatedPremiumAmounts.totalPremiumAmount} ₽`;

                            // Update total salary
                            const totalSalary = baseSalary + parseInt(updatedPremiumAmounts.totalPremiumAmount);
                            document.querySelector('.total-salary').textContent = `${totalSalary.toFixed(2)} ₽`;
                        }
                    }
                });

                // Handle Enter key
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        this.blur();
                    }
                });
            });
        });

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
