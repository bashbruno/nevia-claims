const BASE_URL = 'https://claims-api.nevia.top' as const

export const API_CONFIG = {
  endpoints: {
    areas: `${BASE_URL}/areas`,
    reservations: `${BASE_URL}/reservations`,
  },
} as const
