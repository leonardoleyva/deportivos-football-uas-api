import express from 'express'
import { handleSignUp } from '../controllers/auth'

const router = express.Router()

router.post('/sign-up', handleSignUp)

export default router