export const ROUTES = {
  home: '/',
  catalog: '/cars',
  carDetail: (id: string | number) => `/cars/${id}`,
} as const;
