import { Outlet, Link, useLocation } from 'react-router-dom';
import { AppConfig } from '../../config/app.config';
import { ROUTES } from '../../config/routes';
import { ThemeConfig } from '../../config/theme.config';

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === ROUTES.home;

  return (
    <div className="min-h-screen flex flex-col">
      {/* iOS Telegram style Glassmorphism Header (Absolute, scrolls with page) */}
      <header className="absolute top-0 sm:top-5 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-7xl sm:px-4">
          <div className="bg-white/70 backdrop-blur-md border-b sm:border border-slate-200/60 sm:rounded-2xl shadow-sm sm:shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
            {/* Логотип (Слева) */}
            <Link to={ROUTES.home} className="font-bold text-xl sm:text-2xl text-[var(--color-primary)] shrink-0 tracking-tight">
              {AppConfig.company.name}
            </Link>

            {/* Контакты (Справа для ПК) */}
            <div className="hidden md:flex flex-col items-end text-sm text-slate-600 shrink-0">
              <a href={`tel:${ThemeConfig.contacts.phone}`} className="font-bold text-lg text-slate-900 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {ThemeConfig.contacts.phone}
              </a>
              <div className="flex gap-3 text-xs mt-0.5">
                {ThemeConfig.contacts.addresses?.map((addr, i) => (
                  <span key={i} className="flex items-center gap-1 opacity-80 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[var(--color-primary)]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {addr}
                  </span>
                ))}
              </div>
            </div>
              
            {/* Мобильная кнопка звонка (Стильная, круглая, акцентная) */}
            <a href={`tel:${ThemeConfig.contacts.phone}`} className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white shadow-lg shadow-red-500/30 active:scale-95 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            </a>
          </div>
        </div>
      </header>
      
      {/* Main Content - добавляем отступ сверху, если мы не на главной странице */}
      <main className={`flex-grow ${isHome ? '' : 'pt-20 sm:pt-32'}`}>
        <Outlet />
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4">
          <p>© 2026 {AppConfig.company.name}. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
