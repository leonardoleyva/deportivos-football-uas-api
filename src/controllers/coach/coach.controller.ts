import mongoose from 'mongoose'
import { Response } from 'express'
import { Request } from '../../helpers/type'

import { v2 as cloudinary } from 'cloudinary'
import { TeamOnMatch, TournamentMatch } from '../../models/tournament'
import {
  FinishTournamentMatchBodyParams,
  UpdateTeamScoreBodyParams,
} from '../type'
import { tournamentStageBasedOnTeamsAmount } from '../constants'

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
  req: Request<UpdateTeamScoreBodyParams>,
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
    res.status(200).send(res.json())
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(res.json(err.errors))
      return
    }
    res.status(400).send(res.json())
  }
}

export const handleFinishMatch = async (
  req: Request<FinishTournamentMatchBodyParams>,
  res: Response,
) => {
  try {
    const { body, params } = req
    const { teamsIds } = body

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

        if (teamA._id === teamsIds[0]) {
          indexFoundMatch = index
          const isTeamAWinner = teamA.goals > teamB.goals

          updatedMatch.push({
            ...teamA,
            status: isTeamAWinner ? 'winner' : 'loser',
          })
          updatedMatch.push({
            ...teamB,
            status: !isTeamAWinner ? 'winner' : 'loser',
          })
        }
      },
    )

    const newMatches = tournamentMatches[tournamentMatches.currentStage].matches
    newMatches[indexFoundMatch] = [...updatedMatch]

    let amountOfFinishedMatches: number = 0
    newMatches.forEach(match => {
      if (match[0].status !== 'pending') {
        amountOfFinishedMatches += 1
      }
    })

    const isCurrentStageFinished = amountOfFinishedMatches === newMatches.length

    await TournamentMatches.updateOne(
      { tournamentId: params.id, categoryId: params.mixedCategoryId },
      {
        $set: {
          [tournamentMatches.currentStage]: {
            status: isCurrentStageFinished ? 'done' : 'in-progress',
            matches: [...newMatches],
          },
        },
      },
    )

    if (isCurrentStageFinished && tournamentMatches.currentStage !== 'final') {
      const matchesOfNextStage: TeamOnMatch[][] = []
      newMatches.forEach((match, index) => {
        if (index % 2 === 0) {
          const winnerTeamA: TeamOnMatch =
            match[0].status === 'winner'
              ? Object.assign(match[0])
              : Object.assign(match[1])
          const winnerTeamB: TeamOnMatch =
            newMatches[index + 1][0].status === 'winner'
              ? Object.assign(newMatches[index + 1][0])
              : Object.assign(newMatches[index + 1][1])

          matchesOfNextStage.push([
            {
              _id: winnerTeamA._id,
              name: winnerTeamA.name,
              teamLogo: winnerTeamA.teamLogo,
              tournamentId: winnerTeamA.tournamentId,
              categoryId: winnerTeamA.categoryId,
              players: winnerTeamA.players,
              goals: 0,
              status: 'pending',
            },
            {
              _id: winnerTeamB._id,
              name: winnerTeamB.name,
              teamLogo: winnerTeamB.teamLogo,
              tournamentId: winnerTeamB.tournamentId,
              categoryId: winnerTeamB.categoryId,
              players: winnerTeamB.players,
              goals: 0,
              status: 'pending',
            },
          ])
        }
      })

      const nextStage =
        tournamentStageBasedOnTeamsAmount[matchesOfNextStage.length * 2]

      await TournamentMatches.updateOne(
        { tournamentId: params.id, categoryId: params.mixedCategoryId },
        {
          $set: {
            currentStage: nextStage,
            [nextStage]: {
              status: 'in-progress',
              matches: matchesOfNextStage,
            },
          },
        },
      )
    }
    res.status(200).send(res.json(newMatches))
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send(res.json(err.errors))
      return
    }
    res.status(400).send(res.json())
  }
}
