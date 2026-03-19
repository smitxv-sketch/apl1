// Получаем все изображения из папки public/images/hero/ на этапе сборки
const rawHeroImages = import.meta.glob('/public/images/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}');
const dynamicHeroSlides = Object.keys(rawHeroImages)
  .map(path => path.replace('/public', ''))
  .sort((a, b) => {
    const nameA = a.split('/').pop() || '';
    const nameB = b.split('/').pop() || '';
    return nameA.localeCompare(nameB);
  });

const defaultHeroSlides = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
];

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
    ],
    workHours: 'Ежедневно с 9:00 до 20:00',
  },

  // Слайдер на главной (Hero Section)
  hero: {
    title: 'Автоплощадка№1',
    subtitle: 'Премиальные автомобили с пробегом.\nПроверены экспертами, готовы к новым дорогам.',
    buttonText: 'Смотреть каталог',
    // Фоновые изображения для эффекта Ken Burns
    // Автоматически подгружаются из папки public/images/hero/ и сортируются по имени
    slides: dynamicHeroSlides.length > 0 ? dynamicHeroSlides : defaultHeroSlides,
    
    // Настройка фокуса (сдвига) изображений для мобильных экранов (вертикальных)
    // Ключ — начало имени файла (например, '01', '02' или полное имя '01_car.jpg')
    // Значение — позиция по горизонтали (50% - центр, 0% - левый край, 100% - правый край)
    // Можно использовать px, %, calc() и т.д.
    mobileFocalPoints: {
      '01': '65%', // Пример: для файла 01...jpg сместить фокус левее
      '02': '53%', // Пример: для файла 02...jpg сместить фокус правее
	  '03': '70%', // Пример: для файла 02...jpg сместить фокус правее
	  '04': '70%', // Пример: для файла 02...jpg сместить фокус правее
    } as Record<string, string>,
  },

  // Цвета (дублируют Tailwind config для JS-компонентов)
  colors: {
    primary: '#dc2626',
  },
};
