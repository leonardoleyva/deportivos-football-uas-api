import { model, Schema } from 'mongoose'

export const TournamentCategorySchema = new Schema({
  name: { type: String, trim: true, required: true },
})

export const TournamentBranchSchema = new Schema({
  name: { type: String, trim: true, required: true },
})

export const TournamentTypeSchema = new Schema({
  name: { type: String, trim: true, required: true },
})

export const CitySchema = new Schema({
  name: { type: String, trim: true, required: true },
})

export const PlacesSchema = new Schema({
  name: { type: String, trim: true, required: true },
  city: {
    _id: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
  },
})

export const TournamentSchema = new Schema({
  name: { type: String, trim: true, required: true },
  category: {
    type: { _id: String, name: String },
    required: true,
  },
  branches: { type: [{ _id: String, name: String }], required: true },
  type: { _id: String, name: String },
  city: {
    type: { _id: String, name: String },
    required: true,
  },
  places: {
    type: [
      {
        _id: String,
        name: String,
        city: {
          _id: { type: String, trim: true, required: true },
          name: { type: String, trim: true, required: true },
        },
      },
    ],
    required: true,
  },
  dates: {
    init: { type: String, trim: true, required: true },
    final: { type: String, trim: true, required: true },
  },
  hours: { type: String, trim: true, required: true },
  officials: {
    admins: {
      type: [
        {
          _id: String,
          name: String,
          role: { type: { _id: String, name: String }, required: true },
        },
      ],
      required: true,
    },
    coaches: {
      type: [
        {
          _id: String,
          name: String,
          role: { type: { _id: String, name: String }, required: true },
        },
      ],
      required: true,
    },
    referees: {
      type: [
        {
          _id: String,
          name: String,
          role: { type: { _id: String, name: String }, required: true },
        },
      ],
      required: true,
    },
  },
  mixedCategories: {
    type: [
      {
        _id: String,
        name: String,
        categoryName: String,
        branchName: String,
        status: String,
      },
    ],
    required: true,
  },
  status: { type: String, required: true },
})

model('tournament-categories', TournamentCategorySchema)
model('tournament-branches', TournamentBranchSchema)
model('tournament-types', TournamentTypeSchema)
model('cities', CitySchema)
model('places', PlacesSchema)
model('tournaments', TournamentSchema)
