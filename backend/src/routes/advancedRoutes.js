import express from 'express'
import fleetbaseAdvancedService from '../services/fleetbaseAdvancedService.js'
import {
  optimizeRouteWithTimeWindowsSchema,
  optimizeRouteWithSkillsSchema,
  optimizeRouteWithPrioritySchema,
  optimizeRouteWithMultipleDepotsSchema,
  dynamicReoptimizationSchema,
  validate,
} from '../validators/advancedRouteValidator.js'
import logger from '../utils/logger.js'

const router = express.Router()

/**
 * POST /api/routes/optimize/time-windows
 * 時間窓制約を含むルート最適化
 */
router.post('/optimize/time-windows', async (req, res) => {
  try {
    const { valid, error, value } = validate(
      req.body,
      optimizeRouteWithTimeWindowsSchema
    )

    if (!valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      })
    }

    logger.info('Time window route optimization requested', {
      stopsCount: value.stops.length,
      vehiclesCount: value.vehicles.length,
    })

    const result = await fleetbaseAdvancedService.optimizeRouteWithTimeWindows(value)

    // コスト計算
    const costAnalysis = result.routes?.map(route => {
      const distance = route.distance || 0
      const duration = route.duration || 0
      return {
        route_id: route.id,
        cost: fleetbaseAdvancedService.calculateRouteCost({
          distance,
          duration,
          vehicleType: 'car',
        }),
      }
    })

    res.json({
      success: true,
      cached: false,
      optimization_type: 'time_windows',
      routes: result.routes,
      cost_analysis: costAnalysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Time window optimization error', {
      message: error.message,
      status: error.response?.status,
    })

    res.status(500).json({
      success: false,
      error: 'Route optimization failed',
      message: error.message,
    })
  }
})

/**
 * POST /api/routes/optimize/skills
 * スキル制約を含むルート最適化
 */
router.post('/optimize/skills', async (req, res) => {
  try {
    const { valid, error, value } = validate(
      req.body,
      optimizeRouteWithSkillsSchema
    )

    if (!valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      })
    }

    logger.info('Skill-based route optimization requested', {
      stopsCount: value.stops.length,
      vehiclesCount: value.vehicles.length,
    })

    const result = await fleetbaseAdvancedService.optimizeRouteWithSkills(value)

    res.json({
      success: true,
      cached: false,
      optimization_type: 'skills',
      routes: result.routes,
      skill_matching: true,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Skill-based optimization error', {
      message: error.message,
      status: error.response?.status,
    })

    res.status(500).json({
      success: false,
      error: 'Skill-based route optimization failed',
      message: error.message,
    })
  }
})

/**
 * POST /api/routes/optimize/priority
 * 優先度を含むルート最適化
 */
router.post('/optimize/priority', async (req, res) => {
  try {
    const { valid, error, value } = validate(
      req.body,
      optimizeRouteWithPrioritySchema
    )

    if (!valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      })
    }

    logger.info('Priority-based route optimization requested', {
      stopsCount: value.stops.length,
      vehiclesCount: value.vehicles.length,
    })

    const result = await fleetbaseAdvancedService.optimizeRouteWithPriority(value)

    res.json({
      success: true,
      cached: false,
      optimization_type: 'priority',
      routes: result.routes,
      priority_order: result.priority_order,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Priority-based optimization error', {
      message: error.message,
      status: error.response?.status,
    })

    res.status(500).json({
      success: false,
      error: 'Priority-based route optimization failed',
      message: error.message,
    })
  }
})

/**
 * POST /api/routes/optimize/multi-depot
 * 複数デポからのルート最適化
 */
router.post('/optimize/multi-depot', async (req, res) => {
  try {
    const { valid, error, value } = validate(
      req.body,
      optimizeRouteWithMultipleDepotsSchema
    )

    if (!valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      })
    }

    logger.info('Multi-depot route optimization requested', {
      depotCount: value.depots.length,
      stopsCount: value.stops.length,
      vehiclesCount: value.vehicles.length,
    })

    const result = await fleetbaseAdvancedService.optimizeRouteWithMultipleDepots(value)

    res.json({
      success: true,
      cached: false,
      optimization_type: 'multi_depot',
      depots: result.depots,
      routes_by_depot: result.routes_by_depot,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Multi-depot optimization error', {
      message: error.message,
      status: error.response?.status,
    })

    res.status(500).json({
      success: false,
      error: 'Multi-depot route optimization failed',
      message: error.message,
    })
  }
})

/**
 * POST /api/routes/optimize/dynamic
 * 動的ルート再最適化
 */
router.post('/optimize/dynamic', async (req, res) => {
  try {
    const { valid, error, value } = validate(
      req.body,
      dynamicReoptimizationSchema
    )

    if (!valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error,
      })
    }

    logger.info('Dynamic re-optimization requested', {
      stopsCount: value.stops.length,
      newStopsCount: value.newStops?.length || 0,
      vehiclesCount: value.vehicles.length,
    })

    const result = await fleetbaseAdvancedService.dynamicReoptimization(value)

    res.json({
      success: true,
      cached: false,
      optimization_type: 'dynamic_reoptimization',
      routes: result.routes,
      new_stops_count: result.new_stops_count,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Dynamic re-optimization error', {
      message: error.message,
      status: error.response?.status,
    })

    res.status(500).json({
      success: false,
      error: 'Dynamic re-optimization failed',
      message: error.message,
    })
  }
})

/**
 * GET /api/routes/:id/metrics
 * ルートのメトリクス取得
 */
router.get('/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params
    const { distance = 0, duration = 0, vehicleType = 'car' } = req.query

    logger.info('Route metrics requested', { routeId: id, distance, duration })

    const costAnalysis = fleetbaseAdvancedService.calculateRouteCost({
      distance: parseFloat(distance),
      duration: parseFloat(duration),
      vehicleType,
    })

    const co2Emissions = fleetbaseAdvancedService.calculateCO2Emissions(
      parseFloat(distance),
      vehicleType
    )

    const fuelConsumption = fleetbaseAdvancedService.calculateFuelConsumption(
      parseFloat(distance)
    )

    res.json({
      success: true,
      route_id: id,
      metrics: {
        distance: parseFloat(distance),
        duration: parseFloat(duration),
        vehicle_type: vehicleType,
        cost_analysis: costAnalysis,
        co2_emissions: co2Emissions,
        fuel_consumption: fuelConsumption,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('Metrics retrieval error', {
      message: error.message,
    })

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve metrics',
      message: error.message,
    })
  }
})

export default router
