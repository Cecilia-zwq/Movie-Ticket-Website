var express = require('express');
var router = express.Router();
var models = require('../models');
var jwt = require('jsonwebtoken');
var Op = models.Sequelize.Op;
// 密钥
const SECRET = 'asdasvjkl';

// 登录
router.post('/login', async function(req, res, next) {
  var user = await models.User.findOne({
    where: {
      user_name: req.body.user_name,
      password: req.body.password}});
  if (!user) {
    res.status(401).json({msg:"用户名不存在或密码不正确"});
    return;
  }
  // 生成token
  var token = jwt.sign({
    id: String(user.id)
  }, SECRET);
  res.json({user:user, token:token});
});

// 注册新用户（管理员不可注册）
router.post('/register', async function(req, res, next) {
  var user = await models.User.findOne({where: {user_name: req.body.user_name}});
  if (user) {
    res.status(400).json({msg:"账号已存在"});
    return;
  }
  user = await models.User.create({
    user_name: req.body.user_name,
    password: req.body.password,
    full_name: req.body.full_name,
    phone_no: req.body.phone_no,
    is_admin: false
  });
  res.json({user:user});
});

// 验证
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({msg:'Authorization header 缺失'});
  }
  const raw = String(authHeader).split(' ').pop();
  if (!raw) {
    return res.status(401).json({msg:'JWT 缺失'});
  }
  let id;
  try {
    var tokenData = jwt.verify(raw, SECRET);
    id = parseInt(tokenData.id);
    const user = await models.User.findByPk(id);
    if (!user) {
      return res.status(404).json({msg:'用户不存在'});
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({msg:'JWT 无效'});
  }
}

// 个人信息
router.get('/profile', auth, async function(req, res, next) {
  res.json({user:req.user});
});

// 个人订单
router.get('/profile/bookings', auth, async function(req, res, next) {
  // console.log(req.user.id);
  user = await models.User.findByPk(req.user.id, {
    include: [
      {
        model: models.Booking,
        include: [
          {
            model: models.Screening,
            include: [
              {
                model: models.Movie,
                attributes: ['title'], // 仅选择movie.title属性
              },
              {
                model: models.Theater,
                attributes: ['name'], // 仅选择theater.name属性
              }
            ],
          },
        ],
      },
    ],
    order: [[models.Booking, 'createdAt', 'DESC']]
  }).then(user => {
    const bookings = user.Bookings;
    res.json({bookings:bookings});
  });
})

// 用户权限
router.get('/authorization', auth, async function(req, res, next) {
  res.json({is_admin:req.user.is_admin});
});

module.exports = router;
