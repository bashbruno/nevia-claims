export const API_CONFIG = {
  baseUrl: 'https://claims-api.nevia.top' as const,
  endpoints: {
    areas: () => `${API_CONFIG.baseUrl}/areas` as const,
    reservations: () => `${API_CONFIG.baseUrl}/reservations` as const,
    apiReservations: '/api/reservations' as const,
  },
}
