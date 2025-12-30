import { data } from 'react-router'
import { getReservations } from '~/lib/api/functions'

export async function action() {
  try {
    const reservations = await getReservations()
    return data(reservations, { status: 200 })
  } catch (err) {
    console.error('Error fetching reservations', err)
    return data([], { status: 500 })
  }
}
