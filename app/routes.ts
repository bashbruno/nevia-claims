import { index, type RouteConfig, route } from '@react-router/dev/routes'

export default [
  route('api/reservations', 'routes/api/reservations.ts'),
  index('routes/home.tsx'),
] satisfies RouteConfig
