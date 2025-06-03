// src/middleware/validation.js
const Joi = require('joi');

/**
 * Generic validation middleware
 * @param {Object} schema - Joi validation schema
 * @param {string} property - Property to validate (body, query, params)
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Show all validation errors
      stripUnknown: true, // Remove unknown fields
      allowUnknown: false // Don't allow unknown fields
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    // Replace the original property with the validated and sanitized value
    req[property] = value;
    next();
  };
};

// Common validation schemas
const schemas = {
  // User validation schemas
  registerUser: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'any.required': 'Password is required'
      }),
    role: Joi.string()
      .valid('user', 'admin')
      .default('user')
  }),

  loginUser: Joi.object({
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  updateUser: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters'
      }),
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .messages({
        'string.email': 'Please provide a valid email address'
      })
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    newPassword: Joi.string()
      .min(6)
      .max(128)
      .required()
      .messages({
        'string.min': 'New password must be at least 6 characters long',
        'string.max': 'New password cannot exceed 128 characters',
        'any.required': 'New password is required'
      })
  }),

  // Book validation schemas
  createBook: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .required()
      .messages({
        'string.min': 'Title is required',
        'string.max': 'Title cannot exceed 200 characters',
        'any.required': 'Title is required'
      }),
    author: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.min': 'Author is required',
        'string.max': 'Author cannot exceed 100 characters',
        'any.required': 'Author is required'
      }),
    scholarAuthor: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Scholar ID must be a valid MongoDB ObjectId'
      }),
    category: Joi.string()
      .required()
      .messages({
        'any.required': 'Category is required'
      }),
    description: Joi.string()
      .trim()
      .min(10)
      .max(2000)
      .required()
      .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required'
      }),
    coverImage: Joi.string()
      .uri()
      .required()
      .messages({
        'string.uri': 'Cover image must be a valid URL',
        'any.required': 'Cover image is required'
      }),
    publishedYear: Joi.number()
      .integer()
      .min(1400)
      .max(new Date().getFullYear())
      .required()
      .messages({
        'number.min': 'Published year must be after 1400',
        'number.max': 'Published year cannot be in the future',
        'any.required': 'Published year is required'
      }),
    pages: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.min': 'Number of pages must be at least 1',
        'any.required': 'Number of pages is required'
      }),
    language: Joi.string()
      .valid('العربية', 'English', 'Français', 'Deutsch', 'اردو', 'فارسی', 'Türkçe')
      .default('العربية'),
    isbn: Joi.string()
      .trim()
      .allow('')
      .pattern(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/)
      .messages({
        'string.pattern.base': 'Please provide a valid ISBN'
      }),
    publisher: Joi.string()
      .trim()
      .max(100)
      .allow('')
      .messages({
        'string.max': 'Publisher name cannot exceed 100 characters'
      }),
    tags: Joi.array()
      .items(Joi.string().trim().max(50))
      .max(20)
      .default([])
      .messages({
        'array.max': 'Cannot have more than 20 tags',
        'string.max': 'Each tag cannot exceed 50 characters'
      })
  }),

  updateBook: Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .messages({
        'string.min': 'Title cannot be empty',
        'string.max': 'Title cannot exceed 200 characters'
      }),
    author: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .messages({
        'string.min': 'Author cannot be empty',
        'string.max': 'Author cannot exceed 100 characters'
      }),
    scholarAuthor: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .allow(null)
      .messages({
        'string.pattern.base': 'Scholar ID must be a valid MongoDB ObjectId'
      }),
    category: Joi.string(),
    description: Joi.string()
      .trim()
      .min(10)
      .max(2000)
      .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot exceed 2000 characters'
      }),
    coverImage: Joi.string()
      .uri()
      .messages({
        'string.uri': 'Cover image must be a valid URL'
      }),
    publishedYear: Joi.number()
      .integer()
      .min(1400)
      .max(new Date().getFullYear())
      .messages({
        'number.min': 'Published year must be after 1400',
        'number.max': 'Published year cannot be in the future'
      }),
    pages: Joi.number()
      .integer()
      .min(1)
      .messages({
        'number.min': 'Number of pages must be at least 1'
      }),
    language: Joi.string()
      .valid('العربية', 'English', 'Français', 'Deutsch', 'اردو', 'فارسی', 'Türkçe'),
    isbn: Joi.string()
      .trim()
      .allow('')
      .pattern(/^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/)
      .messages({
        'string.pattern.base': 'Please provide a valid ISBN'
      }),
    publisher: Joi.string()
      .trim()
      .max(100)
      .allow('')
      .messages({
        'string.max': 'Publisher name cannot exceed 100 characters'
      }),
    tags: Joi.array()
      .items(Joi.string().trim().max(50))
      .max(20)
      .messages({
        'array.max': 'Cannot have more than 20 tags',
        'string.max': 'Each tag cannot exceed 50 characters'
      }),
    isActive: Joi.boolean(),
    isFeatured: Joi.boolean()
  }),

  // Scholar validation schemas
  createScholar: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'Scholar name must be at least 2 characters long',
        'string.max': 'Scholar name cannot exceed 100 characters',
        'any.required': 'Scholar name is required'
      }),
    title: Joi.string()
      .trim()
      .min(2)
      .max(150)
      .required()
      .messages({
        'string.min': 'Title must be at least 2 characters long',
        'string.max': 'Title cannot exceed 150 characters',
        'any.required': 'Academic title is required'
      }),
    institution: Joi.string()
      .trim()
      .max(150)
      .allow('')
      .messages({
        'string.max': 'Institution name cannot exceed 150 characters'
      }),
    specialization: Joi.string()
      .required()
      .messages({
        'any.required': 'Specialization is required'
      }),
    bio: Joi.string()
      .trim()
      .min(50)
      .max(5000)
      .required()
      .messages({
        'string.min': 'Biography must be at least 50 characters long',
        'string.max': 'Biography cannot exceed 5000 characters',
        'any.required': 'Biography is required'
      }),
    dateOfBirth: Joi.date()
      .max('now')
      .required()
      .messages({
        'date.max': 'Date of birth cannot be in the future',
        'any.required': 'Date of birth is required'
      }),
    dateOfDeath: Joi.date()
      .max('now')
      .when('isAlive', {
        is: false,
        then: Joi.required(),
        otherwise: Joi.forbidden()
      })
      .messages({
        'date.max': 'Date of death cannot be in the future',
        'any.required': 'Date of death is required for deceased scholars'
      }),
    isAlive: Joi.boolean()
      .default(true),
    image: Joi.string()
      .uri()
      .allow('')
      .messages({
        'string.uri': 'Image must be a valid URL'
      }),
    works: Joi.array()
      .items(Joi.object({
        title: Joi.string()
          .trim()
          .min(1)
          .max(200)
          .required()
          .messages({
            'string.min': 'Work title is required',
            'string.max': 'Work title cannot exceed 200 characters',
            'any.required': 'Work title is required'
          }),
        year: Joi.number()
          .integer()
          .min(600)
          .max(new Date().getFullYear())
          .required()
          .messages({
            'number.min': 'Publication year must be after 600 CE',
            'number.max': 'Publication year cannot be in the future',
            'any.required': 'Publication year is required'
          }),
        description: Joi.string()
          .trim()
          .max(500)
          .allow('')
          .messages({
            'string.max': 'Work description cannot exceed 500 characters'
          })
      }))
      .min(1)
      .required()
      .messages({
        'array.min': 'At least one work is required',
        'any.required': 'Scholar works are required'
      }),
    nationality: Joi.string()
      .trim()
      .max(50)
      .allow('')
      .messages({
        'string.max': 'Nationality cannot exceed 50 characters'
      }),
    languages: Joi.array()
      .items(Joi.string().valid('Arabic', 'English', 'French', 'German', 'Urdu', 'Persian', 'Turkish', 'Malay', 'Other'))
      .default([])
  }),

  // Search and query validation
  searchQuery: Joi.object({
    q: Joi.string()
      .trim()
      .min(1)
      .max(200)
      .messages({
        'string.min': 'Search query cannot be empty',
        'string.max': 'Search query cannot exceed 200 characters'
      }),
    category: Joi.string()
      .trim(),
    language: Joi.string()
      .valid('العربية', 'English', 'Français', 'Deutsch', 'اردو', 'فارسی', 'Türkçe'),
    author: Joi.string()
      .trim()
      .max(100),
    year: Joi.number()
      .integer()
      .min(1400)
      .max(new Date().getFullYear()),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20),
    sort: Joi.string()
      .valid('title', 'author', 'publishedYear', 'downloads', 'createdAt', '-title', '-author', '-publishedYear', '-downloads', '-createdAt')
      .default('-createdAt')
  }),

  // MongoDB ObjectId validation
  mongoId: Joi.object({
    id: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid ID format',
        'any.required': 'ID is required'
      })
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20)
  })
};

// Specific validation middleware functions
const validateRegister = validate(schemas.registerUser);
const validateLogin = validate(schemas.loginUser);
const validateUpdateUser = validate(schemas.updateUser);
const validateChangePassword = validate(schemas.changePassword);
const validateCreateBook = validate(schemas.createBook);
const validateUpdateBook = validate(schemas.updateBook);
const validateCreateScholar = validate(schemas.createScholar);
const validateSearch = validate(schemas.searchQuery, 'query');
const validateMongoId = validate(schemas.mongoId, 'params');
const validatePagination = validate(schemas.pagination, 'query');

module.exports = {
  validate,
  schemas,
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateChangePassword,
  validateCreateBook,
  validateUpdateBook,
  validateCreateScholar,
  validateSearch,
  validateMongoId,
  validatePagination
};