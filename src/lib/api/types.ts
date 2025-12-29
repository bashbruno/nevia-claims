export type AreasResponse = Array<Area>

export type Area = {
  id: number
  name: string
  respawns: Array<string>
}

export type ReservationsResponse = Array<AreaReservartion>

export type AreaReservartion = {
  id: number
  name: string
  respawnReservations: Array<RespawnReservation>
}

export type RespawnReservation = {
  id: number
  name: string
  reservations: Array<Reservation>
}

export type Reservation = {
  characterName: string
  endDate: string
  id: number
  startDate: string
  userName: string
}
