import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import mainRouter from './routes/main.routes'
import './db/connection'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', mainRouter)

app.listen(8000, () => {
  console.log('Server running...')
})

export default app
