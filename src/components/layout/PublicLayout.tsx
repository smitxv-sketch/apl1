import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { AppConfig } from '../../config/app.config';
import { ROUTES } from '../../config/routes';
import { ThemeConfig } from '../../config/theme.config';

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--color-surface)] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Логотип (Слева) */}
          <Link to={ROUTES.home} className="font-bold text-xl text-[var(--color-primary)] shrink-0">
            {AppConfig.company.name}
          </Link>

          {/* Навигация (По центру) */}
          <nav className="flex gap-8 items-center flex-grow justify-center">
            {location.pathname !== ROUTES.home && (
              <NavLink 
                to={ROUTES.home} 
                className={({ isActive }) => `transition-colors text-lg ${isActive ? 'text-[var(--color-primary)] font-medium' : 'hover:text-[var(--color-primary)]'}`}
              >
                Главная
              </NavLink>
            )}
            {location.pathname !== ROUTES.catalog && (
              <NavLink 
                to={ROUTES.catalog} 
                className={({ isActive }) => `transition-colors text-lg ${isActive ? 'text-[var(--color-primary)] font-medium' : 'hover:text-[var(--color-primary)]'}`}
              >
                Каталог
              </NavLink>
            )}
          </nav>

          {/* Контакты (Справа для ПК) */}
          <div className="hidden md:flex flex-col items-end text-sm text-slate-600 shrink-0">
            <a href={`tel:${ThemeConfig.contacts.phone}`} className="font-bold text-lg text-slate-900 hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {ThemeConfig.contacts.phone}
            </a>
            <div className="flex gap-3 text-xs mt-1">
              {ThemeConfig.contacts.addresses?.map((addr, i) => (
                <span key={i} className="flex items-center gap-1 opacity-80">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[var(--color-primary)]" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {addr}
                </span>
              ))}
            </div>
          </div>
            
          {/* Мобильная кнопка звонка (видна только на мобильных) */}
          <a href={`tel:${ThemeConfig.contacts.phone}`} className="md:hidden absolute right-4 top-3 p-2 text-[var(--color-primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
          </a>
        </div>
      </header>
      
      <main className="flex-grow">
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
