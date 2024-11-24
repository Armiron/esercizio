const Joi = require('joi');
const { supportedPlaces, supportedSorting } = require('../consts.js');

const tripSchema = Joi.object({
  origin: Joi.string()
    .valid(...supportedPlaces)
    .required(),
  destination: Joi.string()
    .valid(...supportedPlaces)
    .required(),
  cost: Joi.number().required(),
  duration: Joi.number().required(),
  type: Joi.string().required(), // could be a .valid(...opt)
  id: Joi.string().required(),
  display_name: Joi.string().required(),
});

const tripsQuerySchema = Joi.object({
  origin: Joi.string()
    .valid(...supportedPlaces)
    .required(),
  destination: Joi.string()
    .valid(...supportedPlaces)
    .required(),
  sort_by: Joi.string().valid(...supportedSorting),
});

const tripDeleteSchema = Joi.object({
  id: Joi.string().required(),
});

const tripGetSchema = Joi.object({
  sort_by: Joi.string().valid(...supportedSorting),
});

module.exports = {
  tripSchema,
  tripsQuerySchema,
  tripDeleteSchema,
  tripGetSchema,
};
