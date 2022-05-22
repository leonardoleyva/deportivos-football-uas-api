import express from 'express'

import adminRouter from './admin.routes'
import coachRouter from './coach.routes'

const router = express.Router()

router.use('/admin', adminRouter)
router.use('/coach', coachRouter)

export default router
