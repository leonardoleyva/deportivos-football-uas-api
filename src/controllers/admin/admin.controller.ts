import mongoose from 'mongoose'
import { Response } from 'express'
import {
  fetchTournamentMetaDataToCreate,
  fetchTournamentMetaDataToUpdate,
  mixCategoryWithBranches,
} from '../tournament.functions'
import { CreateTournamentBodyParams } from '../type'
import { Request } from '../../helpers/type'

const Tournaments = mongoose.model('tournaments')
const TournamentCategories = mongoose.model('tournament-categories')
const TournamentBranches = mongoose.model('tournament-branches')
const TournamentTypes = mongoose.model('tournament-types')
const Cities = mongoose.model('cities')
const Places = mongoose.model('places')
const Admins = mongoose.model('admins')
const Coaches = mongoose.model('coaches')
const Referees = mongoose.model('referees')

export const handleCreateTournament = async (
  req: Request<CreateTournamentBodyParams>,
  res: Response,
) => {
  try {
    const { body } = req

    const { admins, coaches, referees, ...restMetaData } =
      await fetchTournamentMetaDataToCreate(body)
    const mixedCategories = mixCategoryWithBranches(
      restMetaData.category,
      restMetaData.branches,
      'pending',
    )

    const newTournament = await new Tournaments({
      ...restMetaData,
      name: body.name,
      hours: body.hours,
      dates: body.dates,
      officials: {
        admins,
        coaches,
        referees,
      },
      mixedCategories,
      status: 'in-progress',
    }).save()
    res.status(200).send(res.json(newTournament))
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(res.json(err.errors))
      return
    }
    res.status(400).send(res.json())
  }
}

export const handleUpdateTournamentBaseData = async (
  req: Request<CreateTournamentBodyParams>,
  res: Response,
) => {
  try {
    const { body, params } = req

    const { admins, coaches, referees, ...restMetaData } =
      await fetchTournamentMetaDataToUpdate(body)

    await Tournaments.updateOne(
      { _id: new mongoose.Types.ObjectId(params.id) },
      {
        $set: {
          ...restMetaData,
          name: body.name,
          hours: body.hours,
          dates: body.dates,
          officials: {
            admins,
            coaches,
            referees,
          },
        },
      },
    )
    res.status(200).send(res.json())
  } catch (err) {
    res.status(400).send(res.json())
  }
}

export const handleGetTournaments = async (req: Request<{}>, res: Response) => {
  try {
    const tournaments = await Tournaments.find()
    res.status(200).send(res.json(tournaments))
  } catch (err) {
    res.status(400).send(res.json())
  }
}

export const handleGetOneTournament = async (
  req: Request<{}>,
  res: Response,
) => {
  try {
    const tournament = await Tournaments.findById(req.params.id)
    res.status(200).send(res.json(tournament))
  } catch (err) {
    res.status(400).send(res.json())
  }
}

export const handleGetFieldsetData = async (
  req: Request<{}>,
  res: Response,
) => {
  try {
    const [categories, branches, types, cities, admins, coaches, referees] =
      await Promise.all([
        TournamentCategories.find(),
        TournamentBranches.find(),
        TournamentTypes.find(),
        Cities.find(),
        Admins.find(),
        Coaches.find(),
        Referees.find(),
      ])
    res.status(200).send(
      res.json({
        categories,
        branches,
        types,
        cities,
        admins,
        coaches,
        referees,
      }),
    )
  } catch (err) {
    res.status(400).send(res.json())
  }
}

export const handleGetFieldsetDataPlaces = async (
  req: Request<{}>,
  res: Response,
) => {
  try {
    const placesBasedOnCity = await Places.find({
      'city._id': req.params.cityId,
    })
    res.status(200).send(res.json({ places: placesBasedOnCity }))
  } catch (err) {
    res.status(400).send(res.json())
  }
}
