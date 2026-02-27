import { Link } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-8xl font-bold text-slate-200">404</h1>
      <p className="text-xl text-slate-600">Страница не найдена</p>
      <Link 
        to={ROUTES.home} 
        className="mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-3 px-6 rounded-xl transition-colors"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
