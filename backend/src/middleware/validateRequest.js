import { validationResult } from 'express-validator'
import logger from '../utils/logger.js'

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    logger.warn('Validation errors', { errors: errors.array() })
    const error = new Error('Validation failed')
    error.isValidation = true
    error.messages = errors.array().map((err) => err.msg)
    return next(error)
  }
  next()
}

export default handleValidationErrors
