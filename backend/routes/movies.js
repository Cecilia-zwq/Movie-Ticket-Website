var express = require('express');
var router = express.Router();
var models = require('../models');
var Op = models.Sequelize.Op;
var sequelize = require('sequelize')
const multer  = require('multer')



/* GET movies page. */
// 查找
router.get('/', async function(req, res, next) {
    if (req.query.sta === "rate") {
        const topRatedMovies = await models.Movie.findAll({
            order: [['average_rating', 'DESC']],
            limit: 10,
        });
        const movieData = topRatedMovies.map(movie => ({
            movieId: movie.id,
            title: movie.title,
            averageRating: movie.average_rating,
        }));
        res.json({ movieRatingRank: movieData });
        return;
    }
    // 分页 
    // offset=(currentPage-1)*pageSize
    var currentPage = parseInt(req.query.currentPage) || 1;
    var pageSize = parseInt(req.query.pageSize) || 3;

    // 模糊查询
    var where = {};
    var search = req.query.search;
    if (search) {
        where[Op.or] = [{
                title: {
                    [Op.like]: '%'+search+'%'
                }
            },{
                genre: {
                    [Op.like]: '%'+search+'%'
                }
            }
        ];
    }
    var sort = req.query.sort;
    var result = await models.Movie.findAndCountAll({
        order: [[sort || 'average_rating','DESC']],
        where: where,
        offset: (currentPage-1)*pageSize,
        limit: pageSize
    });
    res.json({
        movies: result.rows,
        pagination: {
            currentPage: currentPage,
            pageSize:pageSize,
            total: Math.ceil(result.count/pageSize)
        }
    });
});

router.get('/:id', async function(req, res, next) {
    var movie = await models.Movie.findOne({
        where: {id: req.params.id},
        include: [{
            model: models.Screening,
            order: [[sequelize.fn('TIME', sequelize.col('start_time')), 'ASC']]}]
    });
    if (!movie){
        res.status(400).json({msg:"电影不存在"});
        return;
    }
    res.json({movie: movie});
});

// 增加
router.post('/', async function(req, res, next) {
    var movie = await models.Movie.create({
        title: req.body.title,
        genre: req.body.genre,
        release_date: req.body.release_date,
        duration: parseInt(req.body.duration),
        average_rating: Number(req.body.average_rating),
        director: req.body.director,
        cast: req.body.cast,
        synopsis: req.body.synopsis,
        url: ""
    });
    console.log(movie);
    const movieId = movie.id;
    const posterFileName = `${movieId}.png`;
    await movie.update({ url: "posters/"+posterFileName });
    res.json({movie:movie});
});

// 修改
router.put('/:id', async function(req, res, next) {
    var movie = await models.Movie.findByPk(req.params.id);
    if (!movie){
        res.status(400).json({msg:"资源不存在"});
        return;
    };
    movie.update({
        title: req.body.title,
        genre: req.body.genre,
        release_date: req.body.release_date,
        duration: parseInt(req.body.duration),
        average_rating: Number(req.body.average_rating),
        director: req.body.director,
        cast: req.body.cast,
        synopsis: req.body.synopsis,
        url: req.body.url
    })
    res.json({movie:movie});
});

// 删除
router.delete('/:id', async function(req, res, next) {
    var movie = await models.Movie.findByPk(req.params.id);
    if (!movie){
        res.status(400).json({msg:"电影不存在"});
        return;
    };
    movie.destroy();
    res.json({msg:"删除成功"});
});

module.exports = router;