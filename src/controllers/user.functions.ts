import mongoose from 'mongoose'
import { OfficialRol, PrivateUser } from '../models/user'
import '../models/user/schema'

const Admins = mongoose.model('admins')
const Coaches = mongoose.model('coaches')
const Referees = mongoose.model('referees')
const OfficialRoles = mongoose.model('official-roles')

export const createAdmin = async (data: Omit<PrivateUser, '_id'>) =>
  new Admins(data).save()

export const createCoach = async (data: Omit<PrivateUser, '_id'>) =>
  new Coaches(data).save()

export const createReferee = async (data: Omit<PrivateUser, '_id'>) =>
  new Referees(data).save()

export const fetchOfficialRolMetaData = (roleId: string) =>
  OfficialRoles.findById<OfficialRol>(roleId)

export const createPrivateUserBasedOnRole = (
  privateUserData: Omit<PrivateUser, '_id'>,
): Promise<PrivateUser | null | any> => {
  switch (privateUserData.role.name) {
    case 'admin':
      return createAdmin(privateUserData)
    case 'coach':
      return createCoach(privateUserData)
    case 'referee':
      return createReferee(privateUserData)
    default:
      console.error('Official role was not recognized')
      return null
  }
}
