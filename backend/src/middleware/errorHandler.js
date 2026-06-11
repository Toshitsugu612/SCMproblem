import logger from '../utils/logger.js'

const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  // Fleetbase API エラー
  if (err.response?.status) {
    return res.status(err.response.status).json({
      success: false,
      error: 'Fleetbase API Error',
      message: err.response.data?.message || err.message,
      statusCode: err.response.status,
    })
  }

  // バリデーションエラー
  if (err.isValidation) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages: err.messages,
      statusCode: 400,
    })
  }

  // その他のエラー
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    statusCode: 500,
  })
}

export default errorHandler
