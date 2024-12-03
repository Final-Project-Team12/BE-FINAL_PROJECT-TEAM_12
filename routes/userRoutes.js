const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const restrictJwt = require('./middlewares/restrictJwt')

router.post('/user', async (req, res, next) => {UserController.registerUser(req, res, next)})
router.post('/user/login', async (req, res, next) => {UserController.login(req, res, next)})

router.use(restrictJwt)

router.get('/user/:user_id', async (req, res, next) => {UserController.getUser(req, res, next, req.params.user_id)})
router.put('/user/:user_id', async (req, res, next) => {UserController.updateUser(req, res, next, req.params.user_id)})
router.delete('/user/:user_id', async (req, res, next) => {UserController.deleteUser(req, res, next, req.params.user_id)})

module.exports = router;