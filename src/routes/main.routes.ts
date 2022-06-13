import express from 'express'

import authRouter from './auth.routes'
import adminRouter from './admin.routes'
import coachRouter from './coach.routes'

import '../models/tournament/schema'
import '../models/user/schema'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/coach', coachRouter)

export default router
