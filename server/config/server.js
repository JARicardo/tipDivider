import express from 'express'
import cors from 'cors'
import api from '../routes/api'

const app = express()

app.use(cors());
app.use(express.json())

// Routes
app.use('/api', api)

export default app
