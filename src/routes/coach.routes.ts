import express from 'express'
import {
  handleCreateTeam,
  handleGetMixedCategoriesByTournament,
  handleGetTournaments,
} from '../controllers/coach'

const router = express.Router()

router.post('/tournaments', handleGetTournaments)
router.get(
  '/tournament/:id/mixed-categories',
  handleGetMixedCategoriesByTournament,
)
router.post('/tournament/:id/team', handleCreateTeam)

export default router
