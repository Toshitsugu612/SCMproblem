import NodeCache from 'node-cache'
import logger from '../utils/logger.js'

const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

class CacheService {
  /**
   * キャッシュからデータを取得
   * @param {string} key - キャッシュキー
   * @returns {*} キャッシュ値、またはundefined
   */
  get(key) {
    const value = cache.get(key)
    if (value) {
      logger.debug(`Cache hit: ${key}`)
    }
    return value
  }

  /**
   * キャッシュにデータを保存
   * @param {string} key - キャッシュキー
   * @param {*} value - 保存する値
   * @param {number} ttl - TTL（秒）
   */
  set(key, value, ttl = 3600) {
    cache.set(key, value, ttl)
    logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`)
  }

  /**
   * キャッシュを削除
   * @param {string} key - キャッシュキー
   */
  delete(key) {
    cache.del(key)
    logger.debug(`Cache deleted: ${key}`)
  }

  /**
   * すべてのキャッシュをクリア
   */
  clear() {
    cache.flushAll()
    logger.info('All cache cleared')
  }

  /**
   * キャッシュキーを生成
   * @param {string} prefix - プレフィックス
   * @param {Object} params - パラメータ
   * @returns {string} キャッシュキー
   */
  generateKey(prefix, params) {
    const hash = JSON.stringify(params)
    return `${prefix}:${Buffer.from(hash).toString('base64')}`
  }
}

export default new CacheService()
