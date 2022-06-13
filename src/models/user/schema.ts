import { model, Schema } from 'mongoose'

const PrivateUserSchema = new Schema({
  name: { type: String, trim: true, required: true },
  username: { type: String, trim: true, required: false },
  password: { type: String, trim: true, required: false },
  role: { type: { _id: String, name: String }, required: true },
})

/**
 * Schema of admins, coaches and referees can change in a soon future,
 * meanwhile they're using private user schema
 */
export const AdminSchema = PrivateUserSchema
export const CoachSchema = PrivateUserSchema
export const RefereeSchema = PrivateUserSchema

export const PublicUserSchema = new Schema({
  name: { type: String, trim: true, required: true },
  ine: { type: String, required: true },
})

export const OfficialRolSchema = new Schema({
  name: { type: String, trim: true, required: true },
})

model('admins', AdminSchema)
model('coaches', CoachSchema)
model('referees', RefereeSchema)
model('public-users', PublicUserSchema)
model('official-roles', PublicUserSchema)
