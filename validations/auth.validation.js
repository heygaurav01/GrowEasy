const Joi = require('joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
  });

  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    deviceFingerprint: Joi.string().optional(),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  validate: (type) => (req, res, next) => {
    let validation;
    if (type === 'register') {
      validation = registerValidation(req.body);
    } else if (type === 'login') {
      validation = loginValidation(req.body);
    }

    if (validation.error) {
      return res.status(400).json({
        status: 'error',
        message: validation.error.details[0].message,
      });
    }

    next();
  },
};