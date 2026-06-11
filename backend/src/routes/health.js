import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  })
})

router.get('/ready', (req, res) => {
  // ここで依存関係のチェックを行う（DB、外部API など）
  res.json({
    ready: true,
    timestamp: new Date().toISOString(),
  })
})

export default router
