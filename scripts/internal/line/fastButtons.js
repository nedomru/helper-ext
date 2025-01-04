// Добавляет кнопки-ссылки на важные для дежурных ресурсы
async function dutyButtons() {
    // Exit early if buttons already exist
    if (document.querySelector(".helper-duty-button")) return;

    // Define links data with more robust typing
    const linksData = [
        {
            id: "list-item-queue",
            url: "http://46.146.231.248/linenck",
            icon: "mdi mdi-robot-outline",
            text: "Очередь вопросов",
        },
        {
            id: "list-item-stubs",
            url: "http://genesys-stat.cc1.ertelecom.ru:9090/gax/#/!/view:com.cm.details/101/CfgTransaction/CfgFolder:196/CfgTransaction:312/gax:options",
            icon: "mdi mdi-alert-octagon-outline",
            text: "Заглушки",
        },
        {
            id: "list-item-offers",
            url: "https://okc2.ertelecom.ru/wfm/offers/duty/nsk_stp",
            icon: "mdi mdi-account-multiple-outline",
            text: "Предложка",
        },
        {
            id: "list-item-sl-forecast",
            url: "https://okc.ertelecom.ru/stats/genesys-reports/ntp/sl-forecast",
            icon: "mdi mdi-chart-box-outline",
            text: "Прогноз SL",
        },
        {
            id: "list-item-city-stats",
            url: "https://genesys.domru.ru/citystats/queue",
            icon: "mdi mdi-alien-outline",
            text: "ТС 2.0",
        },
        {
            id: "list-item-gax",
            url: "http://genesys-stat.cc1.ertelecom.ru:9090/gax/?#/!/view:com.cm.home/101",
            icon: "mdi mdi-server-outline",
            text: "GAX",
        },
        {
            id: "list-item-feed-generator",
            url: "http://10.121.15.99/lenta",
            icon: "mdi mdi-chat-processing-outline",
            text: "Генератор ленты",
        },
    ];

    // Determine current theme
    const getTheme = () => {
        const appElement = document.querySelector(".v-application.v-application--is-ltr");
        return appElement?.classList.contains("theme--dark") ? "dark" : "light";
    };

    // Create a single link element
    const createLinkTab = (linkData) => {
        const theme = getTheme();

        const link = document.createElement("a");
        link.tabIndex = "0";
        link.href = linkData.url;
        link.target = "_blank";
        link.role = "menuitem";
        link.id = linkData.id;
        link.classList.add(
            "v-list-item",
            "v-list-item--link",
            `theme--${theme}`,
            "helper-duty-button"
        );

        // Create icon container
        const iconDiv = document.createElement("div");
        iconDiv.className = "v-list-item__icon";

        const icon = document.createElement("i");
        icon.setAttribute("aria-hidden", "true");
        icon.classList.add(
            "v-icon",
            "helper-duty-button",
            "notranslate",
            ...linkData.icon.split(" "),
            `theme--${theme}`
        );
        iconDiv.appendChild(icon);

        // Create title container
        const titleDiv = document.createElement("div");
        titleDiv.className = "v-list-item__title";
        titleDiv.textContent = linkData.text;

        // Append elements
        link.appendChild(iconDiv);
        link.appendChild(titleDiv);

        return link;
    };

    // Wait for the container to be available
    const waitForContainer = () => {
        return new Promise((resolve) => {
            const observer = new MutationObserver((mutations, obs) => {
                const container = document.querySelector(
                    ".v-menu__content.v-menu__content--fixed.menuable__content__active.elevation-3"
                );

                if (container) {
                    const containerList = container.querySelector(
                        ".v-list.v-sheet.v-list--dense"
                    );

                    if (containerList) {
                        obs.disconnect();
                        resolve(containerList);
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    };

    try {
        // Wait for container and add buttons
        const containerList = await waitForContainer();

        // Create and append buttons
        const buttons = linksData.map(createLinkTab);
        buttons.forEach(button => containerList.appendChild(button));

        console.info(
            "[Хелпер] - [Линия] - [Кнопки дежурных] Добавлены кнопки дежурного"
        );
    } catch (error) {
        console.error(
            "[Хелпер] - [Линия] - [Кнопки дежурных] Ошибка при добавлении кнопок:",
            error
        );
    }
}

// Добавляет кнопки-ссылки на важные для специалистов ресурсы
async function specialistButtons() {
    if (document.querySelector(".helper-specialist-button") !== null ||
        document.querySelector(".helper") !== null) {
        return;
    }

    const buttonToggleContainer = document.createElement("div");
    buttonToggleContainer.innerHTML = `
        <div class="v-card v-sheet">
            <div class="v-card__text">
                <div class="v-btn-toggle v-item-group v-btn-toggle--rounded">
                </div>
            </div>
        </div>
    `;
    buttonToggleContainer.style.marginLeft = "20px";
    buttonToggleContainer.style.display = "inline-block";

    const buttonGroup = buttonToggleContainer.querySelector(".v-btn-toggle");

    const interval = setInterval(() => {
        const lineHeader = document.querySelector(".duty-app-block");
        if (lineHeader !== null) {
            lineHeader.parentNode.insertBefore(buttonToggleContainer, lineHeader.nextSibling);
            clearInterval(interval);
        }
    }, 1000);

    const settingsKeys = [
        "LINE_showFB_Mail",
        "LINE_showFB_Lunch",
        "LINE_showFB_OKC",
        "LINE_showFB_BZ",
        "LINE_showFB_ARM",
        "LINE_showFB_BreakNCK1",
        "LINE_showFB_BreakNCK2",
        "LINE_showFB_JIRA",
        "LINE_showFB_NTP1",
        "LINE_showFB_NTP2"
    ];

    const settings = await Promise.all(
        settingsKeys.map(key => browser.storage.sync.get(key))
    );

    const buttonData = [
        {text: "Почта", link: "https://mail.domru.ru", show: settings[0].LINE_showFB_Mail},
        {text: "Обеды", link: "https://okc2.ertelecom.ru/wfm/vueapp/day", show: settings[1].LINE_showFB_Lunch},
        {text: "ОКЦ", link: "https://okc.ertelecom.ru/stats/#octpNck", show: settings[2].LINE_showFB_OKC},
        {text: "БЗ", link: "https://clever.ertelecom.ru", show: settings[3].LINE_showFB_BZ},
        {
            text: "АРМ",
            link: "https://perm.db.ertelecom.ru/cgi-bin/ppo/excells/wcc_main.entry_continue",
            show: settings[4].LINE_showFB_ARM
        },
        {
            text: "Перики НЦК1",
            link: "https://okc.ertelecom.ru/stats/breaks/ntp-nck-one",
            show: settings[5].LINE_showFB_BreakNCK1
        },
        {
            text: "Перики НЦК2",
            link: "https://okc.ertelecom.ru/stats/breaks/ntp-nck-two",
            show: settings[6].LINE_showFB_BreakNCK2
        },
        {text: "JIRA", link: "https://ticket.ertelecom.ru", show: settings[7].LINE_showFB_JIRA},
        {text: "NTP1", link: "https://okc.ertelecom.ru/stats/line_ts/ntp1/index", show: settings[8].LINE_showFB_NTP1},
        {text: "NTP2", link: "https://okc.ertelecom.ru/stats/line_ts/ntp2/index", show: settings[9].LINE_showFB_NTP2}
    ];

    buttonData.forEach(item => {
        if (item.show) {
            const buttonWrapper = document.createElement("div");
            buttonWrapper.className = "v-item-group-item";

            const button = document.createElement("a");
            button.href = item.link;
            button.target = "_blank";
            button.className = "v-btn v-btn--contained v-size--default helper-specialist-button";

            const buttonContent = document.createElement("span");
            buttonContent.className = "v-btn__content";
            buttonContent.textContent = item.text;

            const ripple = document.createElement("div");
            ripple.className = "v-ripple__container";

            button.appendChild(buttonContent);
            button.appendChild(ripple);
            buttonWrapper.appendChild(button);
            buttonGroup.appendChild(buttonWrapper);

            button.addEventListener("mouseenter", () => {
                button.classList.add("v-btn--hover");
            });
            button.addEventListener("mouseleave", () => {
                button.classList.remove("v-btn--hover");
            });
        }
    });

    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
        .v-btn-toggle {
            background: #403e3e;
            border-radius: 28px !important;
            display: inline-flex;
            max-width: 100%;
            padding: 0 2px;
        }
        .v-btn-toggle--rounded .v-btn {
            height: 28px !important;
            min-width: 70px;
            margin: 2px;
            padding: 0 12px;
            border: none;
            background: transparent !important;
            color: white !important;
            border-radius: 14px !important;
        }
        .v-btn-toggle .v-btn:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
        }
        .v-btn-toggle .v-btn--hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
        }
        .v-btn__content {
            font-size: 0.875rem;
            letter-spacing: 0.0178571429em;
            line-height: normal;
            text-transform: none;
        }
        .v-btn-toggle .v-btn:not(:last-child) {
            margin-right: 2px;
        }
    `;
    document.head.appendChild(styleSheet);
}

