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
      'г. Челябинск, ул. Гагарина, 7а',
      'г. Челябинск, ул. Гагарина, 7а',
    ],
    workHours: 'Ежедневно с 9:00 до 20:00',
  },

  // Слайдер на главной (Hero Section)
  hero: {
    title: 'Автоплощадка№1',
    subtitle: 'Премиальные автомобили с пробегом.\nПроверены экспертами, готовы к новым дорогам.',
    buttonText: 'Смотреть каталог',
    // Фоновые изображения для эффекта Ken Burns
    slides: [
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop', // Заменили пальмы на другое авто
      'https://images.unsplash.com/photo-1503376712341-ea1d2484310d?q=80&w=2070&auto=format&fit=crop',
    ],
  },

  // Цвета (дублируют Tailwind config для JS-компонентов)
  colors: {
    primary: '#dc2626',
  },
};
