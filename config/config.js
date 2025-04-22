require('dotenv').config();

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key', // Ensure this is defined
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',          // Ensure this is defined
  },
  mongoose: {
    url: process.env.MONGO_URI || 'your_mongo_uri',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },
};