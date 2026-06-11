import axios from 'axios'
import logger from '../utils/logger.js'

class FleetbaseService {
  constructor() {
    this.apiKey = process.env.FLEETBASE_API_KEY
    this.apiHost = process.env.FLEETBASE_API_HOST || 'https://api.fleetbase.io'
    this.orgSlug = process.env.FLEETBASE_ORGANIZATION_SLUG

    if (!this.apiKey) {
      throw new Error('FLEETBASE_API_KEY is not set')
    }

    this.client = axios.create({
      baseURL: this.apiHost,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    })
  }

  /**
   * ルート最適化リクエストを送信
   * @param {Object} data - 最適化パラメータ
   * @returns {Promise<Object>} 最適化結果
   */
  async optimizeRoute(data) {
    try {
      logger.debug('Sending route optimization request to Fleetbase', { data })

      const response = await this.client.post('/v1/routing/optimize', {
        destinations: data.stops,
        vehicles: data.vehicles,
        optimize: data.options?.optimize || 'distance',
        time_windows: data.options?.timeWindow || false,
        polylines: true,
      })

      logger.info('Route optimization successful', { routeCount: response.data.routes?.length })
      return response.data
    } catch (error) {
      logger.error('Fleetbase route optimization failed', {
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  }

  /**
   * ジオコーディング（住所から座標に変換）
   * @param {string} address - 住所
   * @returns {Promise<Object>} 座標情報
   */
  async geocode(address) {
    try {
      const response = await this.client.get('/v1/geocoding', {
        params: { query: address },
      })
      return response.data
    } catch (error) {
      logger.error('Geocoding failed', { address, error: error.message })
      throw error
    }
  }

  /**
   * リバースジオコーディング（座標から住所に変換）
   * @param {number} latitude - 緯度
   * @param {number} longitude - 経度
   * @returns {Promise<Object>} 住所情報
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await this.client.get('/v1/geocoding/reverse', {
        params: { latitude, longitude },
      })
      return response.data
    } catch (error) {
      logger.error('Reverse geocoding failed', {
        latitude,
        longitude,
        error: error.message,
      })
      throw error
    }
  }

  /**
   * マトリックス計算（複数地点間の距離・時間）
   * @param {Array} locations - 地点配列
   * @returns {Promise<Object>} マトリックス情報
   */
  async calculateMatrix(locations) {
    try {
      const response = await this.client.post('/v1/routing/matrix', {
        locations,
      })
      return response.data
    } catch (error) {
      logger.error('Matrix calculation failed', { error: error.message })
      throw error
    }
  }
}

export default new FleetbaseService()
