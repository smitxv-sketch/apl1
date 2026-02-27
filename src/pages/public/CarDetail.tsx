import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient, type Car } from '../../services/api.client';
import { ROUTES } from '../../config/routes';
import { ThemeConfig } from '../../config/theme.config';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCar() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await apiClient.getCarById(id);
        if (!data) {
          setError('Автомобиль не найден');
        } else {
          setCar(data);
        }
      } catch (err) {
        setError('Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-[400px] bg-slate-200 rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-12 bg-slate-200 rounded w-1/2"></div>
            <div className="h-6 bg-slate-200 rounded w-full"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'Автомобиль не найден'}</h2>
        <Link to={ROUTES.catalog} className="text-[var(--color-primary)] hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Хлебные крошки */}
      <nav className="text-sm text-slate-500 mb-6 flex gap-2">
        <Link to={ROUTES.home} className="hover:text-slate-900">Главная</Link>
        <span>/</span>
        <Link to={ROUTES.catalog} className="hover:text-slate-900">Каталог</Link>
        <span>/</span>
        <span className="text-slate-900">{car.mark} {car.model}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Левая колонка: Галерея */}
        <div className="lg:w-3/5">
          <div className="bg-slate-100 rounded-2xl overflow-hidden border border-[var(--color-border)]">
            {car.images && car.images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ 
                  type: 'fraction',
                  formatFractionCurrent: (number) => String(number).padStart(2, '0'),
                  formatFractionTotal: (number) => String(number).padStart(2, '0'),
                }}
                className="aspect-[4/3] w-full group"
              >
                {car.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img 
                      src={img} 
                      alt={`${car.mark} ${car.model} - фото ${idx + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </SwiperSlide>
                ))}
                <style>{`
                  .swiper-pagination-fraction {
                    bottom: 1rem !important;
                    right: 1rem !important;
                    left: auto !important;
                    width: auto !important;
                    background: rgba(0, 0, 0, 0.6);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    backdrop-filter: blur(4px);
                  }
                  .swiper-button-next, .swiper-button-prev {
                    color: white !important;
                    width: 40px !important;
                    height: 40px !important;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                    backdrop-filter: blur(2px);
                  }
                  .swiper-button-next:after, .swiper-button-prev:after {
                    font-size: 18px !important;
                  }
                  .swiper-button-disabled {
                    opacity: 0 !important;
                  }
                  @media (max-width: 768px) {
                    .swiper-button-next, .swiper-button-prev {
                      display: none !important;
                    }
                  }
                `}</style>
              </Swiper>
            ) : (
              <div className="aspect-[4/3] w-full flex items-center justify-center text-slate-400">
                Нет фотографий
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка: Информация */}
        <div className="lg:w-2/5 flex flex-col">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {car.mark} {car.model}, {car.year}
          </h1>
          <p className="text-slate-500 mb-6">VIN: {car.vin || 'Скрыт'}</p>

          <div className="text-4xl font-bold text-[var(--color-primary)] mb-8">
            {car.price.toLocaleString('ru-RU')} ₽
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-[var(--color-border)] mb-8">
            <h3 className="font-semibold text-lg mb-4">Характеристики</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <dt className="text-slate-500">Пробег</dt>
                <dd className="font-medium">{car.run.toLocaleString('ru-RU')} км</dd>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <dt className="text-slate-500">Коробка</dt>
                <dd className="font-medium">{car.gearbox}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <dt className="text-slate-500">Кузов</dt>
                <dd className="font-medium">{car.bodyType}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <dt className="text-slate-500">Привод</dt>
                <dd className="font-medium">{car.drive}</dd>
              </div>
              {car.engineVolume && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Объем двигателя</dt>
                  <dd className="font-medium">{car.engineVolume} см³</dd>
                </div>
              )}
              {car.enginePower && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Мощность</dt>
                  <dd className="font-medium">{car.enginePower} л.с.</dd>
                </div>
              )}
              {car.color && (
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <dt className="text-slate-500">Цвет</dt>
                  <dd className="font-medium">{car.color}</dd>
                </div>
              )}
            </dl>
          </div>

          <a 
            href={`tel:${ThemeConfig.contacts.phone}`}
            className="block w-full text-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-4 px-8 rounded-xl transition-all hover:scale-[1.02]"
          >
            Позвонить: {ThemeConfig.contacts.phone}
          </a>
        </div>
      </div>

      {/* Описание */}
      {car.description && (
        <div className="mt-12 max-w-3xl">
          <h3 className="text-2xl font-bold mb-4">Комментарий продавца</h3>
          <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-600">
            {car.description}
          </div>
        </div>
      )}
    </div>
  );
}
