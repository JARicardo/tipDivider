const express = require('express')
const router = express.Router()
const ApiController = require('../controllers/apiController')

router.get('/', (req, res) => { ApiController.index(req, res) })

module.exports = router
