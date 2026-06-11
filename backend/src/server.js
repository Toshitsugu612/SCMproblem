import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import logger from './utils/logger.js'
import errorHandler from './middleware/errorHandler.js'
import requestLogger from './middleware/requestLogger.js'
import routesRouter from './routes/routes.js'
import healthRouter from './routes/health.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(requestLogger)

// Routes
app.use('/health', healthRouter)
app.use('/api/routes', routesRouter)

// Error Handler (must be last)
app.use(errorHandler)

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`)
})

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    logger.info('HTTP server closed')
    process.exit(0)
  })
})

export default app
