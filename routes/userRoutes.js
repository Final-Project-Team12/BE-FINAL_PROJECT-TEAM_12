const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const restrictJwt = require('../middlewares/restrictJwt')
const restrictJwtAdmin = require('../middlewares/restrictJwtAdmin')


router.post('/user', UserController.registerUser)
router.post('/user/verify', UserController.verifyUser)
router.post('/user/resend', UserController.resendOtp)
router.post('/user/login', UserController.login)

const restrictedRoutes = express.Router();

restrictedRoutes.get('/:user_id', UserController.getUser);
restrictedRoutes.put('/:user_id', UserController.updateUser);
restrictedRoutes.delete('/:user_id', UserController.deleteUser);

router.use('/user', restrictJwt, restrictedRoutes);

module.exports = router;