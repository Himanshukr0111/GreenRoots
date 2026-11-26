const express = require('express')
const router = express.Router()
const { identifyPlant, getPlantAdvisorStatus } = require('../controllers/plantController')

router.get('/status', getPlantAdvisorStatus)
router.post('/', identifyPlant)

module.exports = router
