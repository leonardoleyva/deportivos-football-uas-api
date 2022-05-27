import express from 'express'
import {
  handleCreateTeam,
  handleFinishMatch,
  handleGetMixedCategoriesByTournament,
  handleGetOneMatch,
  handleGetTeams,
  handleGetTournaments,
  handleUpdateTeamScore,
} from '../controllers/coach'

const router = express.Router()

router.post('/tournaments', handleGetTournaments)
router.get(
  '/tournament/:id/mixed-categories',
  handleGetMixedCategoriesByTournament,
)
router.post('/tournament/:id/team', handleCreateTeam)
router.get('/tournament/:id/category/:mixedCategoryId/teams', handleGetTeams)
router.put(
  '/tournament/:id/category/:mixedCategoryId/scores',
  handleUpdateTeamScore,
)
router.put(
  '/tournament/:id/category/:mixedCategoryId/match-status',
  handleFinishMatch,
)
router.post('/tournament/:id/category/:mixedCategoryId/get-match', handleGetOneMatch)

export default router
