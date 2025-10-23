const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, resendOtp, deleteUser, forgotPassword, resetPassword, getAllUsers } = require('../controllers/userController');
const { registerValidator, loginValidator } = require('../middleware/validator');
const { authentication } = require('../middleware/auth');


router.post('/register', registerValidator, register);

router.post('/verify-email', verifyEmail);

router.post('/resend-otp', resendOtp);

router.post('/login', loginValidator, login);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.delete('/user/:id', deleteUser);

router.get('/users', getAllUsers);

module.exports = router;