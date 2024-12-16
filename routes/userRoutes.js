const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const restrictJwt = require('../middlewares/restrictJwt')

router.post('/user', UserController.registerUser)
router.post('/user/verify', UserController.verifyUser)
router.post('/user/resend', UserController.resendOtp)
router.post('/user/login', UserController.login)

router.use(restrictJwt);

router.get('/:user_id', UserController.getUser);
router.put('/:user_id', UserController.updateUser);
router.delete('/:user_id', UserController.deleteUser);

module.exports = router;