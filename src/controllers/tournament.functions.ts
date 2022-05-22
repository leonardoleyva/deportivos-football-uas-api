import mongoose from 'mongoose'
import {
  City,
  MixedCategory,
  MixedCategoryStatus,
  Place,
  TournamentBranch,
  TournamentCategory,
  TournamentType,
} from '../models/tournament'
import '../models/tournament/schema'
import '../models/user/schema'
import { CreateTournamentBodyParams, UpdateTournamentBodyParams } from './type'

const TournamentCategories = mongoose.model('tournament-categories')
const TournamentBranches = mongoose.model('tournament-branches')
const TournamentTypes = mongoose.model('tournament-types')
const Cities = mongoose.model('cities')
const Places = mongoose.model('places')
const Admins = mongoose.model('admins')
const Coaches = mongoose.model('coaches')
const Referees = mongoose.model('referees')

export const mixCategoryWithBranches = (
  category: TournamentCategory,
  branches: TournamentBranch[],
  status: MixedCategoryStatus,
): MixedCategory[] => {
  return branches.map(branch => ({
    _id: `${category._id}---${branch._id}`,
    name: `${category.name} - ${branch.name}`,
    categoryName: category.name,
    branchName: branch.name,
    status,
  }))
}

export const fetchTournamentCategoryMetaData = async (categoryId: string) =>
  TournamentCategories.findById<TournamentCategory>(categoryId)

export const fetchTournamentTypeMetaData = async (typeId: string) =>
  TournamentTypes.findById<TournamentType>(typeId)

export const fetchCityMetaData = async (cityId: string) =>
  Cities.findById<City>(cityId)

export const fetchBranchesMetaData = async (branchesIds: string[]) => {
  const branches: TournamentBranch[] = []
  for (let id of branchesIds) {
    branches.push(await TournamentBranches.findById(id))
  }
  return branches
}

export const fetchPlacesMetaData = async (placesIds: string[]) => {
  const places: Place[] = []
  for (let id of placesIds) {
    places.push(await Places.findById(id))
  }
  return places
}

export const fetchAdminsMetaData = async (adminsIds: string[]) => {
  const admins = []
  for (let id of adminsIds) {
    admins.push(await Admins.findById(id))
  }
  return admins
}

export const fetchCoachesMetaData = async (coachesIds: string[]) => {
  const coaches = []
  for (let id of coachesIds) {
    coaches.push(await Coaches.findById(id))
  }
  return coaches
}

export const fetchRefereesMetaData = async (refereesIds: string[]) => {
  const referees = []
  for (let id of refereesIds) {
    referees.push(await Referees.findById(id))
  }
  return referees
}

export const fetchTournamentMetaDataToCreate = async (
  body: CreateTournamentBodyParams,
) => {
  const [category, type, city] = await Promise.all([
    fetchTournamentCategoryMetaData(body.category),
    fetchTournamentTypeMetaData(body.type),
    fetchCityMetaData(body.city),
  ])
  const branches = await fetchBranchesMetaData(body.branches)
  const places = await fetchPlacesMetaData(body.places)
  const admins = await fetchAdminsMetaData(body.admins)
  const coaches = await fetchCoachesMetaData(body.coaches)
  const referees = await fetchRefereesMetaData(body.referees)

  return {
    category,
    type,
    city,
    branches,
    places,
    admins,
    coaches,
    referees,
  }
}

export const fetchTournamentMetaDataToUpdate = async (
  body: UpdateTournamentBodyParams,
) => {
  const [type, city] = await Promise.all([
    fetchTournamentTypeMetaData(body.type),
    fetchCityMetaData(body.city),
  ])
  const places = await fetchPlacesMetaData(body.places)
  const admins = await fetchAdminsMetaData(body.admins)
  const coaches = await fetchCoachesMetaData(body.coaches)
  const referees = await fetchRefereesMetaData(body.referees)

  return {
    type,
    city,
    places,
    admins,
    coaches,
    referees,
  }
}
