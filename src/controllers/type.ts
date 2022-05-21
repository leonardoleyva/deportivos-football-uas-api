export interface CreateTournamentBodyParams {
  name: string
  type: string
  branches: string[]
  category: string
  dates: {
    init: string
    final: string
  }
  city: string
  places: string[]
  hours: string
  admins: string[]
  coaches: string[]
  referees: string[]
}
