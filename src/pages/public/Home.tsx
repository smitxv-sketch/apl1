import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeConfig } from '../../config/theme.config';
import { ROUTES } from '../../config/routes';
import { useCatalogStore } from '../../store/catalog.store';
import { useShallow } from 'zustand/react/shallow';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { CarCard } from '../../shared/components/ui/CarCard';
import { CarCardSkeleton } from '../../shared/components/ui/CarCardSkeleton';

// Импорт стилей Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function Home() {
  const { allCars, loading, fetchCars } = useCatalogStore(
    useShallow((state) => ({
      allCars: state.allCars,
      loading: state.loading,
      fetchCars: state.fetchCars,
    }))
  );

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  // Берем первые 8 машин для слайдера на главной
  const featuredCars = allCars.slice(0, 8);

  return (
    <div>
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        .ken-burns-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          animation: kenburns 18s infinite;
        }
        /* Генерируем стили для каждого слайда из конфига */
        ${ThemeConfig.hero.slides.map((url, index) => `
          .ken-burns-bg:nth-child(${index + 1}) { 
            animation-delay: ${index * 6}s; 
            background-image: url('${url}'); 
          }
        `).join('')}

        /* Кастомизация Swiper */
        .swiper-button-next, .swiper-button-prev {
          color: var(--color-primary);
          background: rgba(255, 255, 255, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: var(--color-primary);
        }
        .swiper-horizontal > .swiper-pagination-bullets, .swiper-pagination-bullets.swiper-pagination-horizontal {
          bottom: 0;
        }
        .swiper-wrapper {
          padding-bottom: 40px; /* Место для пагинации */
        }
      `}</style>

      {/* Hero Section с эффектом Кена Бернса */}
      <section className="h-[80vh] bg-slate-900 flex items-center justify-center text-white relative overflow-hidden">
        {/* Анимированные фоны */}
        <div className="absolute inset-0 z-0">
          {ThemeConfig.hero.slides.map((_, index) => (
            <div key={index} className="ken-burns-bg" />
          ))}
        </div>
        
        {/* Затемнение для читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/40 z-10" />
        
        <div className="relative z-20 text-center max-w-4xl px-4 w-full">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 tracking-tight break-words">
            {ThemeConfig.hero.title}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-10 text-slate-200 font-light max-w-2xl mx-auto whitespace-pre-line">
            {ThemeConfig.hero.subtitle}
          </p>
          <Link 
            to={ROUTES.catalog} 
            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 px-8 md:py-4 md:px-10 rounded-xl transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,0,0,0.3)] text-base md:text-lg"
          >
            {ThemeConfig.hero.buttonText}
          </Link>
        </div>
      </section>

      {/* Слайдер автомобилей (как на маркетплейсах) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Новые поступления</h2>
            <Link to={ROUTES.catalog} className="text-[var(--color-primary)] font-medium hover:underline underline-offset-4">
              Все автомобили &rarr;
            </Link>
          </div>

          {loading && allCars.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="hidden sm:block first:block">
                  <CarCardSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="card-slider !pb-12" // Важно: padding-bottom для точек
            >
              {featuredCars.map((car) => (
                <SwiperSlide key={car.id} className="h-auto">
                  <CarCard car={car} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </div>
  );
}


