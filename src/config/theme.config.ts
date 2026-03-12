export const ThemeConfig = {
  // Логотип компании (можно заменить на ссылку или путь к файлу в public)
  logo: {
    text: 'Автоплощадка№1', // Если нет картинки, будет текст
    image: '', // Например: '/images/logo.png' или 'https://example.com/logo.png'
  },

  // Контакты
  contacts: {
    phone: '8-351-777-77-23',
    address: 'г. Челябинск, ул. Гагарина, 7а', // Fallback
    addresses: [
      'г. Челябинск, ул. Гагарина, 7а',
      'ул. Братьев Кашириных, 130',
      'ул. Кузнецова, 1а',
    ],
    workHours: 'Ежедневно с 9:00 до 20:00',
  },

  // Слайдер на главной (Hero Section)
  hero: {
    title: 'Автоплощадка№1',
    subtitle: 'Премиальные автомобили с пробегом.\nПроверены экспертами, готовы к новым дорогам.',
    buttonText: 'Смотреть каталог',
    // Фоновые изображения для эффекта Ken Burns (локальные файлы из папки public/images)
    slides: [
      '/images/hero-1.jpg',
      '/images/hero-2.jpg',
      '/images/hero-3.jpg',
    ],
  },

  // Цвета (дублируют Tailwind config для JS-компонентов)
  colors: {
    primary: '#dc2626',
  },
};
