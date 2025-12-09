import Joi from 'joi';

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Property to validate ('body', 'query', 'params')
 */
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: messages
      });
    }

    req[property] = value;
    next();
  };
};

// ==================== Auth Validation Schemas ====================

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().trim().max(50).required().messages({
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().trim().max(50).required().messages({
    'any.required': 'Last name is required'
  }),
  role: Joi.string().valid('admin', 'chauffeur').default('chauffeur'),
  phone: Joi.string().trim().allow(''),
  licenseNumber: Joi.string().trim().allow('')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

// ==================== User Validation Schemas ====================

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().max(50),
  lastName: Joi.string().trim().max(50),
  phone: Joi.string().trim().allow(''),
  licenseNumber: Joi.string().trim().allow(''),
  isActive: Joi.boolean()
}).min(1);


// ==================== ID Param Validation ====================

export const mongoIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Invalid ID format',
    'string.length': 'Invalid ID format'
  })
});

// ==================== Truck Validation Schemas ====================

export const createTruckSchema = Joi.object({
  registrationNumber: Joi.string().trim().uppercase().required().messages({
    'any.required': 'Registration number is required'
  }),
  brand: Joi.string().trim().required(),
  model: Joi.string().trim().required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  status: Joi.string().valid('Active', 'Maintenance', 'OutOfService'),
  currentOdometer: Joi.number().min(0)
});

export const updateTruckSchema = Joi.object({
  registrationNumber: Joi.string().trim().uppercase(),
  brand: Joi.string().trim(),
  model: Joi.string().trim(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  status: Joi.string().valid('Active', 'Maintenance', 'OutOfService'),
  currentOdometer: Joi.number().min(0)
}).min(1);

// ==================== Fuel Validation Schemas ====================

export const createFuelSchema = Joi.object({
  truck: Joi.string().hex().length(24).required().messages({ // Helper for ObjectId validation
    'string.hex': 'Invalid Truck ID format',
    'string.length': 'Invalid Truck ID length'
  }),
  date: Joi.date().default(Date.now),
  odometer: Joi.number().required().min(0),
  liters: Joi.number().required().min(0.1),
  pricePerLiter: Joi.number().required().min(0),
  fullTank: Joi.boolean()
});

// ==================== Trailer Validation Schemas ====================

export const createTrailerSchema = Joi.object({
  registrationNumber: Joi.string().trim().uppercase().required(),
  type: Joi.string().trim().required(),
  capacity: Joi.number().required().min(0),
  status: Joi.string().valid('Active', 'Maintenance', 'OutOfService')
});

export const updateTrailerSchema = Joi.object({
  registrationNumber: Joi.string().trim().uppercase(),
  type: Joi.string().trim(),
  capacity: Joi.number().min(0),
  status: Joi.string().valid('Active', 'Maintenance', 'OutOfService')
}).min(1);

// ==================== Tire Validation Schemas ====================

export const createTireSchema = Joi.object({
  serialNumber: Joi.string().trim().uppercase().required(),
  brand: Joi.string().trim().required(),
  size: Joi.string().trim().required(),
  status: Joi.string().valid('Active', 'InStorage', 'Scrapped'),
  vehicleType: Joi.string().valid('Truck', 'Trailer'),
  vehicleId: Joi.string().hex().length(24),
  mileageAtInstall: Joi.number().min(0),
  wearLevel: Joi.number().min(0).max(100)
});

export const updateTireSchema = Joi.object({
  serialNumber: Joi.string().trim().uppercase(),
  brand: Joi.string().trim(),
  size: Joi.string().trim(),
  status: Joi.string().valid('Active', 'InStorage', 'Scrapped'),
  vehicleType: Joi.string().valid('Truck', 'Trailer'),
  vehicleId: Joi.string().hex().length(24),
  mileageAtInstall: Joi.number().min(0),
  wearLevel: Joi.number().min(0).max(100)
}).min(1);


