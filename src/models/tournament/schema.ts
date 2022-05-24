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

export const PlayerSchema = new Schema({
  name: { type: String, trim: true, required: true },
  curp: {
    type: String,
    trim: true,
    required: true,
    minlength: 18,
    maxlength: 18,
  },
  playerNumber: { type: Number, trim: true, required: true, min: 0, max: 100 },
})

export const TeamSchema = new Schema({
  name: { type: String, trim: true, required: true },
  teamLogo: { type: String, trim: true, required: true },
  tournamentId: { type: String, trim: true, required: true },
  categoryId: { type: String, trim: true, required: true },
  players: [{ _id: String, name: String, curp: String, playerNumber: Number }],
})

export const TournamentMatchSchema = new Schema({
  tournamentId: { type: String, trim: true, required: true },
  categoryId: { type: String, trim: true, required: true },
  initialStage: { type: String, trim: true, required: true },
  currentStage: { type: String, trim: true, required: true },
  top16: {
    type: {
      status: { type: String, trim: true },
      matches: [
        [
          {
            _id: { type: String, trim: true, required: true },
            name: { type: String, trim: true, required: true },
            teamLogo: { type: String, trim: true, required: true },
            tournamentId: { type: String, trim: true, required: true },
            categoryId: { type: String, trim: true, required: true },
            players: [
              { _id: String, name: String, curp: String, playerNumber: Number },
            ],
            goals: { type: Number, required: true },
            status: { type: String, trim: true, required: true },
          },
        ],
      ],
      required: false,
    },
  },
  quartersFinal: {
    type: {
      status: { type: String, trim: true },
      matches: [
        [
          {
            _id: { type: String, trim: true, required: true },
            name: { type: String, trim: true, required: true },
            teamLogo: { type: String, trim: true, required: true },
            tournamentId: { type: String, trim: true, required: true },
            categoryId: { type: String, trim: true, required: true },
            players: [
              { _id: String, name: String, curp: String, playerNumber: Number },
            ],
            goals: { type: Number, required: true },
            status: { type: String, trim: true, required: true },
          },
        ],
      ],
      required: false,
    },
  },
  semiFinal: {
    type: {
      status: { type: String, trim: true },
      matches: [
        [
          {
            _id: { type: String, trim: true, required: true },
            name: { type: String, trim: true, required: true },
            teamLogo: { type: String, trim: true, required: true },
            tournamentId: { type: String, trim: true, required: true },
            categoryId: { type: String, trim: true, required: true },
            players: [
              { _id: String, name: String, curp: String, playerNumber: Number },
            ],
            goals: { type: Number, required: true },
            status: { type: String, trim: true, required: true },
          },
        ],
      ],
      required: false,
    },
  },
  final: {
    type: {
      status: { type: String, trim: true },
      matches: [
        [
          {
            _id: { type: String, trim: true, required: true },
            name: { type: String, trim: true, required: true },
            teamLogo: { type: String, trim: true, required: true },
            tournamentId: { type: String, trim: true, required: true },
            categoryId: { type: String, trim: true, required: true },
            players: [
              { _id: String, name: String, curp: String, playerNumber: Number },
            ],
            goals: { type: Number, required: true },
            status: { type: String, trim: true, required: true },
          },
        ],
      ],
      required: false,
    },
  },
})

model('tournament-categories', TournamentCategorySchema)
model('tournament-branches', TournamentBranchSchema)
model('tournament-types', TournamentTypeSchema)
model('cities', CitySchema)
model('places', PlacesSchema)
model('tournaments', TournamentSchema)
model('players', PlayerSchema)
model('teams', TeamSchema)
model('tournament-matches', TournamentMatchSchema)
