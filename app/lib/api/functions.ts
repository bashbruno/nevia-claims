import ky from 'ky'
import { API_CONFIG } from '~/lib/api/config'
import type { AreasResponse, ReservationsResponse } from '~/lib/api/types'

export function getAreas() {
  return ky.get(API_CONFIG.endpoints.areas()).json<AreasResponse>()
}

export function getReservations() {
  return ky
    .get(API_CONFIG.endpoints.reservations())
    .json<ReservationsResponse>()
}

export function getApiReservations() {
  return ky
    .post(API_CONFIG.endpoints.apiReservations)
    .json<ReservationsResponse>()
}
