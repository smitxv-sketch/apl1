export const ROUTES = {
  home: '/',
  catalog: '/cars',
  carDetail: (id: string | number) => `/cars/${id}`,
  amik: '/amik',
} as const;
