import express from 'express'
import fleetbaseService from '../services/fleetbaseService.js'
import cacheService from '../services/cacheService.js'
import { optimizeRouteSchema, validate } from '../validators/routeValidator.js'
import logger from '../utils/logger.js'

const router = express.Router()

/**
 * POST /api/routes/optimize
 * ルート最適化リクエストを処理
 */
router.post('/optimize', async (req, res, next) => {
  try {
    // バリデーション
    const { valid, error, value } = validate(req.body, optimizeRouteSchema)
    if (!valid) {
      const err = new Error('Validation failed')
      err.isValidation = true
      err.messages = error
      return next(err)
    }

    // キャッシュキーを生成
    const cacheKey = cacheService.generateKey('optimize_route', value)

    // キャッシュを確認
    const cachedResult = cacheService.get(cacheKey)
    if (cachedResult) {
      logger.info('Returning cached optimization result')
      return res.json({
        success: true,
        cached: true,
        ...cachedResult,
      })
    }

    // Fleetbase API にリクエストを送信
    const result = await fleetbaseService.optimizeRoute(value)

    // 結果をキャッシュ
    cacheService.set(cacheKey, result, 3600)

    // レスポンスを返す
    res.json({
      success: true,
      cached: false,
      ...result,
    })
  } catch (err) {
    next(err)
  }
})

/**
 * GET /api/routes
 * ルート一覧を取得（ダミー実装）
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    routes: [],
    message: 'Routes endpoint - Database integration required',
  })
})

/**
 * GET /api/routes/:id
 * 特定のルート詳細を取得（ダミー実装）
 */
router.get('/:id', (req, res) => {
  const { id } = req.params
  res.json({
    success: true,
    route: {
      id,
      message: 'Route detail endpoint - Database integration required',
    },
  })
})

/**
 * DELETE /api/routes/:id
 * ルートを削除（ダミー実装）
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params
  res.json({
    success: true,
    message: `Route ${id} deleted - Database integration required`,
  })
})

/**
 * PUT /api/routes/:id
 * ルートを更新（ダミー実装）
 */
router.put('/:id', (req, res) => {
  const { id } = req.params
  res.json({
    success: true,
    message: `Route ${id} updated - Database integration required`,
  })
})

export default router
