import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import './db/connection'
import './db/bucket'
import mainRouter from './routes/main.routes'

const app = express()

app.use(cors())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: false }))

app.use('/', mainRouter)

app.listen(process.env.PORT || 8000, () => {
  console.log('Server running...')
})

export default app
