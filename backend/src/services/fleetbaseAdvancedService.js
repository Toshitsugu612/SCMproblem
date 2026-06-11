import axios from 'axios'
import logger from '../utils/logger.js'

class FleetbaseAdvancedService {
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
   * 時間窓制約を含むルート最適化
   * @param {Object} data - 最適化パラメータ
   * @returns {Promise<Object>} 最適化結果
   */
  async optimizeRouteWithTimeWindows(data) {
    try {
      logger.debug('Optimizing route with time windows', { 
        stopsCount: data.stops?.length,
        vehiclesCount: data.vehicles?.length 
      })

      const response = await this.client.post('/v1/routing/optimize', {
        destinations: data.stops.map(stop => ({
          id: stop.id,
          latitude: stop.lat,
          longitude: stop.lng,
          address: stop.address,
          time_window_start: stop.timeWindowStart,
          time_window_end: stop.timeWindowEnd,
          service_time: stop.serviceTime || 0,
        })),
        vehicles: data.vehicles.map(vehicle => ({
          id: vehicle.id,
          start_latitude: vehicle.startLat,
          start_longitude: vehicle.startLng,
          capacity: vehicle.capacity,
          available_time_start: vehicle.availableTimeStart,
          available_time_end: vehicle.availableTimeEnd,
          break_time: vehicle.breakTime || 0,
        })),
        optimize: 'time_distance',
        time_windows: true,
        polylines: true,
      })

      logger.info('Route optimization with time windows successful', {
        routeCount: response.data.routes?.length,
      })

      return {
        ...response.data,
        optimization_type: 'time_windows',
      }
    } catch (error) {
      logger.error('Time window optimization failed', {
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  }

  /**
   * スキル制約を含むルート最適化
   * @param {Object} data - 最適化パラメータ
   * @returns {Promise<Object>} 最適化結果
   */
  async optimizeRouteWithSkills(data) {
    try {
      logger.debug('Optimizing route with skill constraints', {
        stopsCount: data.stops?.length,
        vehiclesCount: data.vehicles?.length,
      })

      const response = await this.client.post('/v1/routing/optimize', {
        destinations: data.stops.map(stop => ({
          id: stop.id,
          latitude: stop.lat,
          longitude: stop.lng,
          address: stop.address,
          required_skills: stop.requiredSkills || [],
        })),
        vehicles: data.vehicles.map(vehicle => ({
          id: vehicle.id,
          start_latitude: vehicle.startLat,
          start_longitude: vehicle.startLng,
          capacity: vehicle.capacity,
          available_skills: vehicle.skills || [],
        })),
        optimize: 'distance',
        skill_matching: true,
        polylines: true,
      })

      logger.info('Route optimization with skills successful', {
        routeCount: response.data.routes?.length,
      })

      return {
        ...response.data,
        optimization_type: 'skills',
      }
    } catch (error) {
      logger.error('Skill-based optimization failed', {
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  }

  /**
   * 優先度を含むルート最適化
   * @param {Object} data - 最適化パラメータ
   * @returns {Promise<Object>} 最適化結果
   */
  async optimizeRouteWithPriority(data) {
    try {
      logger.debug('Optimizing route with priority constraints', {
        stopsCount: data.stops?.length,
      })

      // 優先度でソート（高優先度を先に処理）
      const sortedStops = [...data.stops].sort((a, b) => 
        (b.priority || 0) - (a.priority || 0)
      )

      const response = await this.client.post('/v1/routing/optimize', {
        destinations: sortedStops.map((stop, index) => ({
          id: stop.id,
          latitude: stop.lat,
          longitude: stop.lng,
          address: stop.address,
          priority: stop.priority || 0,
          sequence_order: index,
        })),
        vehicles: data.vehicles,
        optimize: 'distance',
        polylines: true,
      })

      logger.info('Route optimization with priority successful', {
        routeCount: response.data.routes?.length,
      })

      return {
        ...response.data,
        optimization_type: 'priority',
        priority_order: sortedStops.map(s => s.id),
      }
    } catch (error) {
      logger.error('Priority-based optimization failed', {
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  }

  /**
   * CO2排出量を計算
   * @param {number} distance - 移動距離（km）
   * @param {string} vehicleType - 車両タイプ（car, truck, van）
   * @returns {number} CO2排出量（kg）
   */
  calculateCO2Emissions(distance, vehicleType = 'car') {
    // CO2排出係数（g/km）
    const emissionFactors = {
      car: 150,      // 乗用車
      van: 200,      // バン
      truck: 250,    // トラック
    }

    const factor = emissionFactors[vehicleType] || emissionFactors.car
    const emissions = (distance * factor) / 1000 // kgに変換

    logger.debug('CO2 emissions calculated', {
      distance,
      vehicleType,
      emissions: emissions.toFixed(2),
    })

    return parseFloat(emissions.toFixed(2))
  }

  /**
   * 燃料消費量を計算
   * @param {number} distance - 移動距離（km）
   * @param {number} fuelEfficiency - 燃料効率（km/L）
   * @returns {number} 燃料消費量（L）
   */
  calculateFuelConsumption(distance, fuelEfficiency = 8) {
    const consumption = distance / fuelEfficiency
    logger.debug('Fuel consumption calculated', {
      distance,
      fuelEfficiency,
      consumption: consumption.toFixed(2),
    })
    return parseFloat(consumption.toFixed(2))
  }

  /**
   * ルートコストを計算
   * @param {Object} routeData - ルートデータ
   * @returns {Object} コスト分析
   */
  calculateRouteCost(routeData) {
    const {
      distance = 0,
      duration = 0,
      vehicleType = 'car',
      fuelPrice = 150, // 円/L
      driverWage = 1500, // 円/時間
    } = routeData

    // 燃料コスト
    const fuelConsumption = this.calculateFuelConsumption(distance)
    const fuelCost = fuelConsumption * fuelPrice

    // ドライバーコスト
    const driverCost = (duration / 3600) * driverWage // duration は秒

    // CO2排出コスト（1kg あたり 50 円）
    const co2Emissions = this.calculateCO2Emissions(distance, vehicleType)
    const co2Cost = co2Emissions * 50

    // 総コスト
    const totalCost = fuelCost + driverCost + co2Cost

    logger.debug('Route cost calculated', {
      fuelCost: fuelCost.toFixed(2),
      driverCost: driverCost.toFixed(2),
      co2Cost: co2Cost.toFixed(2),
      totalCost: totalCost.toFixed(2),
    })

    return {
      fuel_cost: parseFloat(fuelCost.toFixed(2)),
      driver_cost: parseFloat(driverCost.toFixed(2)),
      co2_cost: parseFloat(co2Cost.toFixed(2)),
      total_cost: parseFloat(totalCost.toFixed(2)),
      distance,
      duration,
      fuel_consumption: fuelConsumption,
      co2_emissions: co2Emissions,
    }
  }

  /**
   * 複数デポからの最適化
   * @param {Object} data - 最適化パラメータ
   * @returns {Promise<Object>} 最適化結果
   */
  async optimizeRouteWithMultipleDepots(data) {
    try {
      logger.debug('Optimizing route with multiple depots', {
        depotCount: data.depots?.length,
        stopsCount: data.stops?.length,
      })

      // 各デポごとにグループ化
      const vehiclesByDepot = {}
      data.depots.forEach(depot => {
        vehiclesByDepot[depot.id] = data.vehicles.filter(
          v => v.depotId === depot.id
        )
      })

      // 各デポについて最適化を実行
      const optimizationPromises = data.depots.map(depot =>
        this.client.post('/v1/routing/optimize', {
          destinations: data.stops,
          vehicles: vehiclesByDepot[depot.id].map(v => ({
            ...v,
            start_latitude: depot.lat,
            start_longitude: depot.lng,
          })),
          optimize: 'distance',
          polylines: true,
        })
      )

      const results = await Promise.all(optimizationPromises)

      logger.info('Multi-depot optimization successful', {
        depotCount: data.depots.length,
        totalRoutes: results.reduce((sum, r) => sum + r.data.routes?.length, 0),
      })

      return {
        depots: data.depots,
        routes_by_depot: results.map((r, idx) => ({
          depot_id: data.depots[idx].id,
          routes: r.data.routes,
        })),
        optimization_type: 'multi_depot',
      }
    } catch (error) {
      logger.error('Multi-depot optimization failed', {
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  }

  /**
   * 動的ルート再最適化
   * @param {Object} data - 最適化パラメータ
   * @returns {Promise<Object>} 再最適化結果
   */
  async dynamicReoptimization(data) {
    try {
      logger.debug('Dynamic re-optimization initiated', {
        newStopsCount: data.newStops?.length,
        existingRoutes: data.existingRoutes?.length,
      })

      // 既存ルートから完了した配送を除外
      const remainingStops = data.stops.filter(
        stop => !data.completedStopIds?.includes(stop.id)
      )

      // 新しい配送地点を追加
      const allStops = [...remainingStops, ...(data.newStops || [])]

      const response = await this.client.post('/v1/routing/optimize', {
        destinations: allStops,
        vehicles: data.vehicles,
        optimize: data.optimize || 'distance',
        polylines: true,
      })

      logger.info('Dynamic re-optimization successful', {
        routeCount: response.data.routes?.length,
      })

      return {
        ...response.data,
        optimization_type: 'dynamic_reoptimization',
        new_stops_count: data.newStops?.length || 0,
      }
    } catch (error) {
      logger.error('Dynamic re-optimization failed', {
        status: error.response?.status,
        message: error.message,
      })
      throw error
    }
  }
}

export default new FleetbaseAdvancedService()
