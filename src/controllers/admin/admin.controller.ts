import mongoose from 'mongoose'
import { Response } from 'express'
import {
  fetchTeamsMetaData,
  fetchTournamentMetaDataToCreate,
  fetchTournamentMetaDataToUpdate,
  mixCategoryWithBranches,
} from '../tournament.functions'
import {
  CreateTournamentBodyParams,
  SetTournamentMatchesBodyParams,
} from '../type'
import { Request } from '../../helpers/type'
import { tournamentStageBasedOnTeamsAmount } from '../constants'
import { Team, TeamOnMatch } from '../../models/tournament'

const Tournaments = mongoose.model('tournaments')
const TournamentCategories = mongoose.model('tournament-categories')
const TournamentBranches = mongoose.model('tournament-branches')
const TournamentTypes = mongoose.model('tournament-types')
const Cities = mongoose.model('cities')
const Places = mongoose.model('places')
const Admins = mongoose.model('admins')
const Coaches = mongoose.model('coaches')
const Referees = mongoose.model('referees')
const TournamentMatches = mongoose.model('tournament-matches')

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

export const handleSetTournamentMatches = async (
  req: Request<SetTournamentMatchesBodyParams>,
  res: Response,
) => {
  try {
    const { body, params } = req

    const teams: Team[] = await fetchTeamsMetaData(body.teamsIds)

    const initialStage = tournamentStageBasedOnTeamsAmount[teams.length]

    const teamsMatches: TeamOnMatch[][] = []
    teams.forEach((team, index) => {
      if (index % 2 === 0) {
        const teamA: TeamOnMatch = { ...team, goals: 0, status: 'pending' }
        const teamB: TeamOnMatch = {
          ...teams[index + 1],
          goals: 0,
          status: 'pending',
        }
        teamsMatches.push([teamA, teamB])
      }
    })

    const tournamentMatches = await new TournamentMatches({
      tournamentId: params.id,
      categoryId: params.mixedCategoryId,
      initialStage,
      currentStage: initialStage,
      [initialStage]: {
        status: 'in-progress',
        matches: teamsMatches,
      },
    }).save()
    res.status(200).send(res.json(tournamentMatches))
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(res.json(err.errors))
      return
    }
    res.status(400).send(res.json())
  }
}

export const handleGetTournamentMatches = async (
  req: Request<SetTournamentMatchesBodyParams>,
  res: Response,
) => {
  try {
    const tournamentMatches = await TournamentMatches.findOne({
      tournamentId: req.params.id,
      categoryId: req.params.mixedCategoryId,
    })
    res.status(200).send(res.json(tournamentMatches))
  } catch (err) {
    res.status(400).send(res.json())
  }
}
