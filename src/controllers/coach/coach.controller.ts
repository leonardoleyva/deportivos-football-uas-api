import mongoose from 'mongoose'
import { Response } from 'express'
import { Request } from '../../helpers/type'

const Tournaments = mongoose.model('tournaments')
const Teams = mongoose.model('teams')
const Players = mongoose.model('players')

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

export const handleCreateTeam = async (req: Request<any>, res: Response) => {
  try {
    const { body, params } = req

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
      teamLogo: body.image,
      tournamentId: params.id,
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
