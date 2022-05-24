import { PrivateUser } from '../user'

export interface TournamentCategory {
  readonly _id: string
  readonly name: string
}

export interface TournamentBranch {
  readonly _id: string
  readonly name: string
}

export interface TournamentType {
  readonly _id: string
  readonly name: string
}

export interface City {
  readonly _id: string
  readonly name: string
}

export interface Place {
  readonly _id: string
  readonly name: string
  readonly city: City
}

export type MixedCategoryStatus = 'pending' | 'active'

export interface MixedCategory {
  readonly _id: string
  readonly name: string
  readonly categoryName: string
  readonly branchName: string
  readonly status: MixedCategoryStatus
}

export type TournamentStatus = 'in-progress' | 'active' | 'done'

export interface Tournament {
  readonly _id: string
  readonly name: string
  readonly category: TournamentCategory
  readonly branches: TournamentBranch[]
  readonly type: TournamentType
  readonly city: City
  readonly places: Place[]
  readonly dates: {
    init: string
    final: string
  }
  readonly hours: string
  readonly officials: {
    admins: PrivateUser[]
    coaches: PrivateUser[]
    referees: PrivateUser[]
  }
  readonly mixedCategories: MixedCategory[]
  readonly status: TournamentStatus
}

export interface Player {
  readonly _id: string
  readonly name: string
  readonly curp: String
  readonly playerNumber: number
}

export interface Team {
  readonly _id: string
  readonly name: string
  readonly teamLogo: string
  readonly tournamentId: string
  readonly categoryId: string
  readonly players: Player[]
}

export type TeamOnMatchStatus = 'pending' | 'winner' | 'loser'

export interface TeamOnMatch extends Team {
  readonly goals: number
  readonly status: TeamOnMatchStatus
}

export type TournamentStage = 'top16' | 'quartersFinal' | 'semiFinal' | 'final'

export type TournamentStageStatus = 'in-progress' | 'done'

export interface TournamentMatch {
  readonly _id: string
  readonly tournamentId: string
  readonly categoryId: string
  readonly initialStage: TournamentStage
  readonly currentStage: TournamentStage
  top16: {
    status: TournamentStageStatus
    matches: TeamOnMatch[][]
  }
  quartersFinal: {
    status: TournamentStageStatus
    matches: TeamOnMatch[][]
  }
  semiFinal: {
    status: TournamentStageStatus
    matches: TeamOnMatch[][]
  }
  final: {
    status: TournamentStageStatus
    matches: TeamOnMatch[][]
  }
}
