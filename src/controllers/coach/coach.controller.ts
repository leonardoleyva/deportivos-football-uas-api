import mongoose from 'mongoose'
import { Response } from 'express'
import { Request } from '../../helpers/type'

const Tournaments = mongoose.model('tournaments')

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
    const tournaments = await Tournaments.find(
      { _id: req.params.id },
      { name: 1, mixedCategories: 1 },
    )
    res.status(200).send(res.json(tournaments))
  } catch (err) {
    res.status(400).send(res.json())
  }
}
