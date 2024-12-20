// Константы URL-адресов
const LINE_URL = {
  BASE: 'genesys-ntp'
};

// Конфигурация функций линии
const LINE_FEATURES = {
  core: {
    LINE_showFB: {
      handler: specialistButtons,
      description: 'Быстрые кнопки'
    },
    LINE_highlightOperators: {
      handler: highlightOperators,
      description: 'Подсветка операторов'
    },
    LINE_dutyButtons: {
      handler: dutyButtons,
      description: 'Кнопки дежурных'
    },
    LINE_countAppointments: {
      handler: countAppointments,
      description: 'Подсчет назначений'
    },
    LINE_highlightEndingAppointments: {
      handler: highlightEndingAppointments,
      description: 'Подсветка завершающихся назначений'
    }
  }
};

// Инициализация основных функций линии
async function initializeLineFeatures() {
  if (!document.URL.includes(LINE_URL.BASE)) {
    return;
  }

  try {
    // Получаем все настройки одним запросом
    const settings = await browser.storage.sync.get(Object.keys(LINE_FEATURES.core));

    // Инициализируем активированные функции
    for (const [feature, config] of Object.entries(LINE_FEATURES.core)) {
      if (settings[feature]) {
        try {
          await config.handler();
          Logger.info(`[Линия] - Активирован модуль: ${config.description}`);
        } catch (featureError) {
          Logger.error(`[Линия] - Сбой модуля ${config.description}: ${featureError.message}`);
        }
      }
    }
  } catch (error) {
    Logger.error(`[Линия] - Ошибка инициализации основных функций: ${error.message}`);
  }
}

// Общая инициализация
async function initializeLine() {
  try {
    await initializeLineFeatures();
  } catch (error) {
    Logger.error(`[Линия] - Ошибка общей инициализации: ${error.message}`);
  }
}

// Инициализация функционала линии
initializeLine();