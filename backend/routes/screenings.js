var express = require('express');
var router = express.Router();
var models = require('../models');
const SeatLayout = require('../structures/seatLayout');
var Op = models.Sequelize.Op;

// 获取所有排片信息
router.get('/', async function(req, res, next) {
    // 模糊查询
    var where = {};
    var theaterId = req.query.theaterId;
    if (theaterId) {
        where = {theaterId: theaterId}
    }
    var result = await models.Screening.findAll({
        order: [['date','DESC']],
        where: where,
        include: [
            {
              model: models.Movie, // 包含 Movie 模型
              attributes: ['title'], // 只选择 Movie 模型中的 title 属性
            },
        ],
    });
    //console.log(result);
    res.json({
        screenings: result,
    });
});

// 获取指定排片信息
router.get('/:id', async function(req, res, next) {
    var screening = await models.Screening.findByPk(req.params.id);
    if (!screening){
        res.status(400).json({msg:"排片不存在"});
        return;
    }
    res.json({screening:screening});
})


// 新增排片
router.post('/', async function(req, res, next) {
    var theater = await models.Theater.findByPk(req.body.theaterId);
    if (!theater) {
        res.status(400).json({msg:"放映厅不存在"});
    }
    var seatLayout = new SeatLayout(theater.name, theater.rows, theater.columns);
    var movie = await models.Movie.findByPk(req.body.movieId);
    var duration = movie.duration;
    var screening = await models.Screening.create({
        movieId: parseInt(req.body.movieId),
        theaterId: parseInt(req.body.theaterId),
        date: req.body.date,
        start_time: req.body.start_time,
        duration: duration,
        language: req.body.language,
        version: req.body.version,
        price: parseFloat(req.body.price),
        seatLayout: seatLayout
    });
    console.log(screening);
    res.json({screening:screening});
});

// 修改排片
router.put('/:id', async function(req, res, next) {
    var screening = await models.Screening.findByPk(req.params.id);
    if (!screening){
        res.status(400).json({msg:"排片不存在"});
        return;
    };
    //
    // 此处应该判断一下是否有订单，有订单的排片不可以修改和删除
    //
    var theater = await models.Theater.findByPk(req.body.theaterId);
    var seatLayout = new SeatLayout(theater.name, theater.rows, theater.columns);
    screening.update({
        movieId: parseInt(req.body.movieId),
        theaterId: parseInt(req.body.theaterId),
        date: req.body.date,
        start_time: req.body.start_time,
        duration: parseInt(req.body.duration),
        language: req.body.language,
        version: req.body.version,
        price: parseFloat(req.body.price),
    })
    res.send(screening);
});


// 删除排片
router.delete('/:id', async function(req, res, next) {
    try {
        var screening = await models.Screening.findByPk(req.params.id);
        if (!screening){
            res.status(400).json({msg:"排片不存在"});
            return;
        };
        await screening.destroy();
        res.json({msg:"删除成功"});
    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            // 处理外键约束错误
            res.status(400).json({ msg: "无法删除，因为存在关联的记录" });
        } else {
            // 处理其他数据库错误
            res.status(500).json({ msg: "数据库错误：" + error.message });
        }
    }
});


module.exports = router;