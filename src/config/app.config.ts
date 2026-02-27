/**
 * Единый источник истины (SSOT) для конфигурации приложения.
 * Zero Hardcode: все тексты, настройки полей и скрипты вынесены сюда.
 */
export const AppConfig = {
  // Настройки автосалона
  company: {
    name: 'Автоплощадка№1',
    phone: '+7 (999) 123-45-67',
    address: 'г. Челябинск, ул. Гагарина, 7А',
    workingHours: 'Ежедневно с 9:00 до 20:00',
  },

  // Ссылка на XML фид CM.Expert
  xmlFeedUrl: 'https://media.cm.expert/stock/export/cmexpert/dealer.site/all/all/f1be278e279b7dea06e6aee198c21696.xml',

  // Внешние скрипты и виджеты (Bitrix24, Метрика и т.д.)
  scripts: {
    bitrix24: '', // Сюда можно вставить URL скрипта Bitrix24
    analytics: '',
  },

  // Конфигурация полей автомобиля (SOC - разделение публичного и внутреннего вида)
  fields: {
    // Поля, доступные обычным пользователям на сайте
    public: [
      'mark', 'model', 'year', 'run', 'price', 
      'engine_volume', 'engine_power', 'transmission', 'body_type', 'drive_type'
    ],
    // Поля, доступные только менеджерам в /internal
    internal: [
      'vin', 'mark', 'model', 'year', 'run', 'price', 
      'engine_volume', 'engine_power', 'transmission', 'body_type', 'drive_type',
      'buy_price', 'days_in_stock', 'owner_count', 'pts_type'
    ],
  },

  // Настройки фильтров (какие поля выводить в фильтре)
  filters: {
    public: ['mark', 'model', 'price', 'year', 'run', 'transmission'],
    internal: ['vin', 'mark', 'model', 'price', 'year', 'run', 'transmission', 'days_in_stock'],
  }
};
