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

export interface MixedCategory {
  readonly _id: string
  readonly name: string
  readonly categoryName: string
  readonly branchName: string
}

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
}