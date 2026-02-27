export interface Car {
  id: string | number;
  mark: string;
  model: string;
  year: number | null;
  run: number;
  price: number;
  vin?: string; // Опционально, так как в публичном API его нет
  images: string[];
  gearbox: string;
  bodyType: string;
  drive: string;
  description: string;
  engineVolume?: string | null;
  enginePower?: string | null;
  color?: string;
  buyPrice?: number; // Только для internal
  daysInStock?: number; // Только для internal
}

export interface CarsQuery {
  mark?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minRun?: number;
  maxRun?: number;
  minYear?: number;
  maxYear?: number;
  page?: number;
  limit?: number;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async getCars(params?: CarsQuery): Promise<Car[]> {
    const url = new URL('/api/cars', window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      });
    }
    
    // Добавляем timestamp для обхода жесткого кэширования браузера,
    // так как у нас есть свой кэш на сервере
    url.searchParams.set('t', String(Date.now()));

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new ApiError(res.status, await res.text());
    }
    return res.json();
  },
  
  async getInternalCars(): Promise<Car[]> {
    // В будущем здесь будет передаваться токен авторизации
    const res = await fetch(`/api/internal/cars?t=${Date.now()}`);
    if (!res.ok) {
      throw new ApiError(res.status, await res.text());
    }
    return res.json();
  },

  async getCarById(id: string): Promise<Car | null> {
    // Пока у нас нет отдельного эндпоинта для одной машины,
    // берем весь список и ищем нужную. В будущем лучше сделать /api/cars/:id
    const cars = await this.getCars();
    return cars.find(c => String(c.id) === String(id)) || null;
  }
};
