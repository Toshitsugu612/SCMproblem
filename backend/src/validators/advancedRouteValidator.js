import Joi from 'joi'

/**
 * 時間窓制約付きルート最適化スキーマ
 */
export const optimizeRouteWithTimeWindowsSchema = Joi.object({
  stops: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().required(),
        weight: Joi.number().optional(),
        timeWindowStart: Joi.number().optional().description('開始時刻（秒）'),
        timeWindowEnd: Joi.number().optional().description('終了時刻（秒）'),
        serviceTime: Joi.number().optional().description('サービス時間（秒）'),
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
        availableTimeStart: Joi.number().optional().description('稼働開始時刻（秒）'),
        availableTimeEnd: Joi.number().optional().description('稼働終了時刻（秒）'),
        breakTime: Joi.number().optional().description('休憩時間（秒）'),
      })
    )
    .min(1)
    .required(),
})

/**
 * スキル制約付きルート最適化スキーマ
 */
export const optimizeRouteWithSkillsSchema = Joi.object({
  stops: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().required(),
        weight: Joi.number().optional(),
        requiredSkills: Joi.array()
          .items(Joi.string())
          .optional()
          .description('必要なスキル'),
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
        skills: Joi.array()
          .items(Joi.string())
          .optional()
          .description('保有スキル'),
      })
    )
    .min(1)
    .required(),
})

/**
 * 優先度付きルート最適化スキーマ
 */
export const optimizeRouteWithPrioritySchema = Joi.object({
  stops: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().required(),
        weight: Joi.number().optional(),
        priority: Joi.number()
          .min(0)
          .max(10)
          .optional()
          .description('優先度（0-10）'),
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
      })
    )
    .min(1)
    .required(),
})

/**
 * 複数デポルート最適化スキーマ
 */
export const optimizeRouteWithMultipleDepotsSchema = Joi.object({
  depots: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        name: Joi.string().optional(),
      })
    )
    .min(1)
    .required(),
  stops: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().required(),
        weight: Joi.number().optional(),
      })
    )
    .min(2)
    .required(),
  vehicles: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        capacity: Joi.number().required(),
        depotId: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
})

/**
 * 動的再最適化スキーマ
 */
export const dynamicReoptimizationSchema = Joi.object({
  stops: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
  vehicles: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        capacity: Joi.number().required(),
        startLat: Joi.number().min(-90).max(90).required(),
        startLng: Joi.number().min(-180).max(180).required(),
      })
    )
    .min(1)
    .required(),
  newStops: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        lat: Joi.number().min(-90).max(90).required(),
        lng: Joi.number().min(-180).max(180).required(),
        address: Joi.string().required(),
      })
    )
    .optional(),
  completedStopIds: Joi.array()
    .items(Joi.string())
    .optional(),
  optimize: Joi.string()
    .valid('distance', 'time', 'cost')
    .optional(),
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
