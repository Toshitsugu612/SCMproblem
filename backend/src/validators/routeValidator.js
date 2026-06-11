import Joi from 'joi'

/**
 * ルート最適化リクエストバリデーション
 */
export const optimizeRouteSchema = Joi.object({
  stops: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().required(),
        weight: Joi.number().optional(),
        required_skills: Joi.array().items(Joi.string()).optional(),
        time_window_start: Joi.number().optional(),
        time_window_end: Joi.number().optional(),
      })
    )
    .min(2)
    .required(),
  vehicles: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        capacity: Joi.number().required(),
        startLat: Joi.number().min(-90).max(90).required(),
        startLng: Joi.number().min(-180).max(180).required(),
        skills: Joi.array().items(Joi.string()).optional(),
        max_time: Joi.number().optional(),
      })
    )
    .min(1)
    .required(),
  options: Joi.object({
    optimize: Joi.string().valid('distance', 'time', 'cost').optional(),
    timeWindow: Joi.boolean().optional(),
  }).optional(),
})

/**
 * バリデーション実行
 * @param {Object} data - バリデーション対象データ
 * @param {Object} schema - Joi スキーマ
 * @returns {Object} バリデーション結果
 */
export const validate = (data, schema) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })

  if (error) {
    const messages = error.details.map((detail) => detail.message)
    return { valid: false, error: messages, value: null }
  }

  return { valid: true, error: null, value }
}
