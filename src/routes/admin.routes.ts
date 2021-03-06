import express from 'express'
import {
  handleCreateTournament,
  handleGetFieldsetData,
  handleGetFieldsetDataPlaces,
  handleGetOneTournament,
  handleGetTournamentMatches,
  handleGetTournaments,
  handleSetTournamentMatches,
  handleUpdateTournamentBaseData,
} from '../controllers/admin'

const router = express.Router()

router.post('/tournaments', handleGetTournaments)
router.get('/tournament/:id', handleGetOneTournament)
router.post('/tournament', handleCreateTournament)
router.put('/tournament/:id', handleUpdateTournamentBaseData)
router.get('/tournament/fieldset-data/all', handleGetFieldsetData)
router.get(
  '/tournament/fieldset-data/places/:cityId',
  handleGetFieldsetDataPlaces,
)
router.post(
  '/tournament/:id/category/:mixedCategoryId/matches',
  handleSetTournamentMatches,
)
router.get(
  '/tournament/:id/category/:mixedCategoryId/matches',
  handleGetTournamentMatches,
)

export default router
