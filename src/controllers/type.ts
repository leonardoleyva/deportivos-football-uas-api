export interface TournamentBodyParams {
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

export interface CreateTournamentBodyParams extends TournamentBodyParams {}

export interface UpdateTournamentBodyParams
  extends Omit<TournamentBodyParams, 'branches' | 'category'> {}

export interface SetTournamentMatchesBodyParams {
  teamsIds: string[]
}

export interface UpdateTeamScoreBodyParams {
  teams: { _id: string, goals: number }[]
}

export interface FinishTournamentMatchBodyParams {
  teamsIds: string[]
}
