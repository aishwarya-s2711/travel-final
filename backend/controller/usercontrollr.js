// User controller - delegates to authController
const authController = require('./authController');

module.exports = {
  // Re-export auth functions for consistency
  signup: authController.signup,
  login: authController.login,
  getMe: authController.getMe,
  updateProfile: authController.updateProfile,
};
