import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';
import type { Car } from '../../../services/api.client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Gauge, Settings2, Car as CarIcon, Users } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  // Берем первые 10 фото для оптимизации каталога
  const previewImages = car.images ? car.images.slice(0, 10) : [];

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-[var(--color-border)] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
      {/* Изображение / Слайдер */}
      <div className="h-56 bg-slate-200 relative overflow-hidden">
        {previewImages.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            pagination={{ 
              type: 'fraction',
              formatFractionCurrent: (number) => String(number).padStart(2, '0'),
              formatFractionTotal: (number) => String(number).padStart(2, '0'),
            }}
            navigation={true}
            className="h-full w-full car-card-slider group/slider"
            lazyPreloadImages={1}
          >
            {previewImages.map((img, idx) => (
              <SwiperSlide key={idx} className="h-full">
                <img 
                  src={img} 
                  alt={`${car.mark} ${car.model}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
            {/* Стили для пагинации и стрелок */}
            <style>{`
              .car-card-slider .swiper-pagination-fraction {
                bottom: 12px !important;
                right: 12px !important;
                left: auto !important;
                width: auto !important;
                background: rgba(0, 0, 0, 0.6);
                color: white;
                padding: 4px 10px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 500;
                backdrop-filter: blur(4px);
                z-index: 20;
                line-height: 1.4;
              }
              
              /* Стили стрелок: скрыты по умолчанию, появляются при наведении */
              .car-card-slider .swiper-button-next,
              .car-card-slider .swiper-button-prev {
                width: 28px !important;
                height: 28px !important;
                background: rgba(255, 255, 255, 0.9);
                border-radius: 50%;
                color: var(--color-primary);
                opacity: 0;
                transition: all 0.2s ease;
                transform: scale(0.8);
                /* Явное позиционирование внутри контейнера */
                top: 50% !important;
                margin-top: -14px !important; /* Половина высоты */
                z-index: 30;
              }

              .car-card-slider .swiper-button-next {
                right: 8px !important;
              }
              
              .car-card-slider .swiper-button-prev {
                left: 8px !important;
              }

              .car-card-slider .swiper-button-next::after,
              .car-card-slider .swiper-button-prev::after {
                font-size: 12px !important;
                font-weight: bold;
              }

              /* Показываем при наведении на карточку (только на устройствах с мышкой) */
              @media (hover: hover) {
                .group:hover .car-card-slider .swiper-button-next,
                .group:hover .car-card-slider .swiper-button-prev {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              /* На мобильных стрелки всегда скрыты, чтобы не мешать свайпу */
              @media (hover: none) {
                .car-card-slider .swiper-button-next,
                .car-card-slider .swiper-button-prev {
                  display: none !important;
                }
              }
            `}</style>
          </Swiper>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">Нет фото</div>
        )}
        
        {/* Градиенты и бейджи (поверх слайдера) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-100" />
          
          {/* Год выпуска - стиль как у пагинации (пилюля) */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] font-medium px-3 py-1 rounded-full backdrop-blur-md z-20">
            {car.year} г.
          </div>
        </div>
      </div>
      
      {/* Контент карточки */}
      <div className="p-5 flex-grow flex flex-col">
        <Link to={ROUTES.carDetail(car.id)} className="block group-hover:text-[var(--color-primary)] transition-colors">
          <h3 className="font-bold text-lg leading-tight mb-3 text-slate-900 group-hover:text-[var(--color-primary)] transition-colors">
            {car.mark} {car.model}
          </h3>
        </Link>
        
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-[var(--color-text-muted)] mb-5">
          <div className="flex items-center gap-1.5" title="Пробег">
            <Gauge className="w-4 h-4 text-slate-400" />
            <span>{car.run.toLocaleString('ru-RU')} км</span>
          </div>
          <div className="flex items-center gap-1.5" title="Коробка передач">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span>{car.gearbox}</span>
          </div>
          {car.bodyType && (
            <div className="flex items-center gap-1.5" title="Тип кузова">
              <CarIcon className="w-4 h-4 text-slate-400" />
              <span>{car.bodyType}</span>
            </div>
          )}
          {car.ownersNumber && (
            <div className="flex items-center gap-1.5 w-full mt-1 pt-2 border-t border-slate-100" title="Владельцы">
              <Users className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="font-medium text-slate-700">{car.ownersNumber}</span>
            </div>
          )}
        </div>
        
        <div className="mt-auto">
          <div className="text-2xl font-bold text-[var(--color-primary)] mb-5">
            {car.price.toLocaleString('ru-RU')} ₽
          </div>
          <Link 
            to={ROUTES.carDetail(car.id)} 
            className="block text-center w-full bg-slate-100 hover:bg-[var(--color-primary)] text-slate-900 hover:text-white font-medium py-2.5 rounded-xl transition-colors duration-300"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
}
