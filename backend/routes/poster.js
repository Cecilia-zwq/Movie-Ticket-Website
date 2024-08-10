var express = require('express');
var router = express.Router();
var models = require('../models');
var Op = models.Sequelize.Op;
var sequelize = require('sequelize')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'E:/Desktop/cinema2/frontend/public/posters')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.fileName)
    }
})
const upload = multer({ storage: storage })
//const upload = multer({ dest: '../../frontend/public/posters' }) ;

router.post('/', upload.single('file'), async function(req, res, next) {
    res.send('File uploaded successfully');
});

module.exports = router;