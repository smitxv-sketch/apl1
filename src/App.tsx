/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { Home } from './pages/public/Home';
import { Catalog } from './pages/public/Catalog';
import { CarDetail } from './pages/public/CarDetail';
import { NotFound } from './pages/public/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичная часть (Сайт для клиентов) */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="cars" element={<Catalog />} />
          <Route path="cars/:id" element={<CarDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
