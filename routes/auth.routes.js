const express = require('express');
const {
  register,
  login,
  verifyMFA,
  refreshTokens,
  resetPassword,
  updatePassword,
  listSessions,
  revokeSession,
} = require('../controllers/auth.controller');
const { validate } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register', validate('register'), register);
router.post('/login', validate('login'), login);
router.post('/mfa/verify', verifyMFA);
router.post('/tokens/refresh', refreshTokens);
router.post('/password/reset', resetPassword);
router.put('/password/update', updatePassword);
router.get('/sessions', listSessions);
router.delete('/sessions/:id', revokeSession);

module.exports = router;