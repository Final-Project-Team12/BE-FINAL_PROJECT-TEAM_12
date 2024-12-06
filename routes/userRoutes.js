const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const restrictJwt = require('../middlewares/restrictJwt')

router.post('/user', async (req, res, next) => {UserController.registerUser(req, res, next)})
router.post('/user/verify', async (req, res, next) => {UserController.verifyUser(req, res, next)})
router.post('/user/resend', async (req, res, next) => {UserController.resendOtp(req, res, next)})
router.post('/user/login', async (req, res, next) => {UserController.login(req, res, next)})

const restrictedRoutes = express.Router();

restrictedRoutes.get('/:user_id', async (req, res, next) => {UserController.getUser(req, res, next, req.params.user_id);});
restrictedRoutes.put('/:user_id', async (req, res, next) => {UserController.updateUser(req, res, next, req.params.user_id);});
restrictedRoutes.delete('/:user_id', async (req, res, next) => {UserController.deleteUser(req, res, next, req.params.user_id);});

router.use('/user', restrictJwt, restrictedRoutes);

module.exports = router;