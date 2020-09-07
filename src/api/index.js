const express = require('express');
const router = express.Router();
const importData = require('./importData')

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏'
    });
});
router.use('/import', importData)
module.exports = router;
