import express from 'express'
import {
  handleGetMixedCategoriesByTournament,
  handleGetTournaments,
} from '../controllers/coach'

const router = express.Router()

router.post('/tournaments', handleGetTournaments)
router.get(
  '/tournament/:id/mixed-categories',
  handleGetMixedCategoriesByTournament,
)

export default router
