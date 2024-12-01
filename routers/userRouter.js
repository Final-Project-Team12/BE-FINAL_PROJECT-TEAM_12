const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

router.post('/', async (req, res, next) => {UserController.registerUser(req, res, next)})
router.get('/:user_id', async (req, res, next) => {UserController.getUser(req, res, next, req.params.user_id)})
router.put('/:user_id', async (req, res, next) => {UserController.updateUser(req, res, next, req.params.user_id)})
router.delete('/:user_id', async (req, res, next) => {UserController.deleteUser(req, res, next, req.params.user_id)})

module.exports = router;