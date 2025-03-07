const URL_PATTERNS = {
  ARM_BASE: "db.ertelecom.ru/cgi-bin",
  EXCELLS: "ertelecom.ru/cgi-bin/ppo/excells",
  CLIENT_SESSION:
    "db.ertelecom.ru/static_pages/private/wcc/client_session/?user_id",
  RADIUS_LOGIN:
    "db.ertelecom.ru/cgi-bin/ppo/excells/radius_accounting_info.login_detail?id_session",
  LEFT_FRAME: "wcc2_main.frame_left_reasons",
  RETENTION: "db.ertelecom.ru/cgi-bin/ppo/excells/adv_act_retention",
  CHANGE_REQUEST: "wcc_request_appl_support.change_request_appl",
};

const TABS_CONFIG = {
  ARM_hideTabIPTV: "Агентское IPTV",
  ARM_hideTabMVNO: "MVNO",
  ARM_hideTabAVTOSP: "АвтоСП",
  ARM_hideTabPORTRET: "Портрет клиента",
  ARM_hideTabABONEMENT: "Абонемент",
  ARM_hideTabPL: "Новая ПЛ",
  ARM_hideTabInvoices: "Счета",
  ARM_hideTabPayments: "Платежи",
  ARM_hideTabAutopayment: "Карты и автоплатеж",
  ARM_hideTabDiagnostic: "Диагностика",
  ARM_hideTabDiagnosticNew: "Диагностика (new)",
  ARM_hideTabSpecialOffers: "Спецпредложения",
  ARM_hideTabBalanceLimit: "Ограничение по балансу",
  ARM_hideTabMNP: "MNP",
  ARM_hideTabMainSales: "Основные продажи",
  ARM_hideTabLoans: "Кредиты",
};

const ARM_FEATURES = {
  base: {
    ARM_hideSPAS: hideSPAS,
    ARM_copyClientAddress: copyClientAddress,
    ARM_copyClientCard: copyClientCard,
    ARM_sendClientCardExample: sendClientCardExample,
    ARM_copyClientAgreement: copyClientAgreement,
    ARM_showHelperSMSButtons: smsButtons,
    ARM_checkForSpecialClient: checkForSpecialClient,
    ARM_hideNonActiveApps: initApplicationsFold,
    ARM_hideInfoTabRows: initInformationFold,
    ARM_hideRequests: initServiceRequestsFold,
    ARM_hideAppeals: initAppealsFold,
    ARM_hideConnectionRequests: initConnectionRequestsFold,
    ARM_checkPaidHelp: paidHelpTrue,
    ARM_removeUselessDiagTabs: removeDiagnosticTabs,
    ARM_removeUselessAppealsColumns: removeAppealsColumns,
    ARM_highlightRequestsClasses: initHighlighting,
  },
  changeRequest: {
    ARM_checkWrongTransfer: wrongTransferFalse,
    ARM_checkSetToMe: removeSetForMe,
    ARM_copyTimeSlots: copyTimeSlots,
    ARM_changeRequestFBCR: fastButtonsChangeRequest,
    ARM_checkPaidHelp: paidHelpTrue,
    ARM_showAgreementOnChange: showClientAgreementOnChangeRequest,
  },
};

// Проверка паттерна URL-адреса
const matchesUrlPattern = (pattern) => document.URL.includes(pattern);

// Функция-хелпер для инициализации настроек
const initializeFeatures = async (features) => {
  try {
    const settings = await browser.storage.sync.get(Object.keys(features));
    Object.entries(settings).forEach(([key, enabled]) => {
      if (enabled && features[key]) {
        features[key]();
      }
    });
  } catch (error) {
    console.error("[Хелпер] - Ошибка инициализации:", error);
  }
};

// Основная функция инициализации
const initializeExtension = async () => {
  // Инициализация функции копирования по всему ARM'у
  if (matchesUrlPattern(URL_PATTERNS.EXCELLS)) {
    await initializeFeatures({ ARM_allowCopy: allowCopy });
    await infoCompensationButton();
  }

  // Инициализация функций страницы сессий клиента
  if (matchesUrlPattern(URL_PATTERNS.CLIENT_SESSION)) {
    await initializeFeatures({
      ARM_filterClientSessions: initFilterClientSessions,
      ARM_copySearchMAC: copyMAC,
    });
    await loadLastDayClientSessions();
  }

  // Инициализация функций копирования IP и MAC-адреса
  if (matchesUrlPattern(URL_PATTERNS.RADIUS_LOGIN)) {
    await copyIP();
    await initializeFeatures({ ARM_copySearchMAC: copyMAC });
  }

  // Инициализация функций левого фрейма
  if (matchesUrlPattern(URL_PATTERNS.LEFT_FRAME)) {
    await initializeFeatures({
      ARM_changeRequestFBLF: fastButtonsLeftFrame,
      ARM_setAppealItemToInternet: changeAppealItemToInternet,
    });
  }

  // Инициализация функций страницы акций на удержание
  if (matchesUrlPattern(URL_PATTERNS.RETENTION)) {
    await agrTransCompensationButton();
    await autoFormatCompensateButtons();
  }

  // Инициализация базовых функций АРМа
  if (
    matchesUrlPattern(URL_PATTERNS.ARM_BASE) &&
    !matchesUrlPattern(URL_PATTERNS.CHANGE_REQUEST)
  ) {
    // Инициализация удаления вкладок договора
    const tabSettings = await browser.storage.sync.get(
      Object.keys(TABS_CONFIG),
    );
    const tabsToDelete = Object.entries(tabSettings)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => TABS_CONFIG[key]);

    if (tabsToDelete.length) {
      await deleteTabs(tabsToDelete);
      console.info("[Хелпер] - [АРМ] - [Удаление вкладок] Вкладки удалены");
    }

    // Инициализация функций АРМа
    await initializeFeatures(ARM_FEATURES.base);
    await setHelperAnticipation();

    // Инициализация функций поиска и форматирования EQM
    await searchByLog();
    await searchByFlag();
    await searchByAppeal();
    await autoFormatEQM();
  }

  // Инициализация функций страницы изменения обращения
  if (matchesUrlPattern(URL_PATTERNS.CHANGE_REQUEST)) {
    await initializeFeatures(ARM_FEATURES.changeRequest);
  }
};

// Инициализация расширения
initializeExtension().catch((error) => {
  console.error("[Хелпер] - Ошибка инициализации расширения:", error);
});
