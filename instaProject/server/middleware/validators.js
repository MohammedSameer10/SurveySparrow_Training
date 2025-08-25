'use strict';

const { body, param, query } = require('express-validator');

exports.loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email required').bail(),
  body('login_type').optional({ nullable: true, checkFalsy: true }).isIn(['oauth']).withMessage('login_type must be "oauth" when provided').bail(),
  body('password')
    .if(body('login_type').not().equals('oauth'))
    .isString()
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

exports.registerValidation = [
  body('username')
    .trim()
    .matches(/^[A-Za-z0-9_]{3,20}$/)
    .withMessage('Username must be 3-20 chars, letters/numbers/underscore only'),
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/)
    .withMessage('Password needs a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password needs an uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password needs a number')
];

exports.updateUserValidation = [
  body('username').optional().trim().matches(/^[A-Za-z0-9_]{3,20}$/),
  body('newEmail').optional().trim().isEmail(),
  body('bio').optional().isLength({ max: 200 }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/)
    .withMessage('Password needs a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password needs an uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password needs a number')
];

exports.likeAddValidation = [ body('postId').isUUID() ];
exports.likeRemoveValidation = [ body('postId').isUUID() ];

exports.postCreateValidation = [
  body('caption').optional().isLength({ min: 1 }),
  body().custom((_, { req }) => {
    if ((req.body.caption && String(req.body.caption).trim() !== '') || req.file) return true;
    throw new Error('Provide caption or image');
  })
];

exports.postUpdateValidation = [
  param('id').isUUID(),
  body('caption').optional().isLength({ min: 1 })
];

exports.postDeleteValidation = [
  param('id').isUUID()
];

exports.searchPostsValidation = [
  body('searchTerm').optional().isString(),
  body('filterBy').optional().isIn(['caption', 'username']),
  body('sortOrder').optional().isIn(['ASC', 'DESC']),
  body('page').optional().isInt({ min: 1 }),
  body('limit').optional().isInt({ min: 1, max: 100 })
];

exports.searchMyPostsValidation = [
  body('searchTerm').optional().isString(),
  body('page').optional().isInt({ min: 1 }),
  body('limit').optional().isInt({ min: 1, max: 100 }),
  body('sortOrder').optional().isIn(['ASC', 'DESC'])
];

exports.getMyPostsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

exports.searchUsersValidation = [
  body('searchTerm').optional().isString(),
  body('page').optional().isInt({ min: 1 }),
  body('limit').optional().isInt({ min: 1, max: 100 })
];


