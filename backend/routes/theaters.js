var express = require('express');
var router = express.Router();
var models = require('../models');

// 查找放映厅信息
router.get('/', async function(req, res, next) {
    var theaters = await models.Theater.findAll();
    res.json({theaters: theaters});
});

module.exports = router;