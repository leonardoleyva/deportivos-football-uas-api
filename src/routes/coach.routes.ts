import express from 'express'
import { handleGetTournaments } from '../controllers/coach'

const router = express.Router()

router.post('/tournaments', handleGetTournaments)

export default router
