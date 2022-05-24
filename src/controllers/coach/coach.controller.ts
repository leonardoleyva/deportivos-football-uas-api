import mongoose from 'mongoose'
import { Response } from 'express'
import { Request } from '../../helpers/type'

import { v2 as cloudinary } from 'cloudinary'
import { TeamOnMatch, TournamentMatch } from '../../models/tournament'

const Tournaments = mongoose.model('tournaments')
const Teams = mongoose.model('teams')
const Players = mongoose.model('players')
const TournamentMatches = mongoose.model('tournament-matches')

export const handleGetTournaments = async (req: Request<{}>, res: Response) => {
  try {
    const tournaments = await Tournaments.find({
      $or: [{ status: 'in-progress' }, { status: 'active' }],
    })
    res.status(200).send(res.json(tournaments))
  } catch (err) {
    res.status(400).send(res.json())
  }
}

export const handleGetMixedCategoriesByTournament = async (
  req: Request<{}>,
  res: Response,
) => {
  try {
    const tournamentWithOnlyCategories = await Tournaments.findById(
      { _id: req.params.id },
      { name: 1, mixedCategories: 1 },
    )
    res.status(200).send(res.json(tournamentWithOnlyCategories))
  } catch (err) {
    res.status(400).send(res.json())
  }
}

export const handleCreateTeam = async (req: any, res: Response) => {
  try {
    const { body, params } = req

    const uploadImgStr = `data:image/jpg;base64,${body.image}`

    const { secure_url } = await cloudinary.uploader.upload(uploadImgStr, {
      overwrite: true,
      invalidate: true,
    })

    const players = []
    for (let player of body.players) {
      players.push(
        await new Players({
          name: player.name,
          curp: player.curp,
          playerNumber: player.playerNumber,
        }).save(),
      )
    }

    const team = await new Teams({
      name: body.name,
      teamLogo: secure_url,
      tournamentId: params.id,
      categoryId: body.categoryId,
      players,
    }).save()

    res.status(200).send(res.json(team))
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(res.json(err.errors))
      return
    }
    res.status(400).send(res.json())
  }
}

export const handleGetTeams = async (req: Request<{}>, res: Response) => {
  try {
    const tournaments = await Teams.find({
      tournamentId: req.params.id,
      categoryId: req.params.mixedCategoryId,
    })
    res.status(200).send(res.json(tournaments))
  } catch (err) {
    res.status(400).send(res.json())
  }
}

export const handleUpdateTeamScore = async (
  req: Request<any>,
  res: Response,
) => {
  try {
    const { body, params } = req
    const { teams } = body

    const tournamentMatches: TournamentMatch = await TournamentMatches.findOne({
      tournamentId: params.id,
      category: params.mixedCategoryId,
    })

    const updatedMatch: TeamOnMatch[] = []
    let indexFoundMatch: number | undefined
    tournamentMatches[tournamentMatches.currentStage].matches.forEach(
      (match, index) => {
        const teamA: TeamOnMatch = match[0]
        const teamB: TeamOnMatch = match[1]

        if (teamA._id === teams[0]._id) {
          indexFoundMatch = index
          updatedMatch.push({ ...teamA, goals: teams[0].goals })
          updatedMatch.push({ ...teamB, goals: teams[1].goals })
        }
      },
    )

    const newMatches = tournamentMatches[tournamentMatches.currentStage].matches
    newMatches[indexFoundMatch] = [...updatedMatch]

    await TournamentMatches.updateOne(
      { tournamentId: params.id, categoryId: params.mixedCategoryId },
      {
        $set: {
          [tournamentMatches.currentStage]: {
            status: 'in-progress',
            matches: [...newMatches],
          },
        },
      },
    )
    res.status(200).send(res.json(newMatches))
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(res.json(err.errors))
      return
    }
    res.status(400).send(res.json())
  }
}
