var express = require('express');
var router = express.Router();
var models = require('../models');
const SeatLayout = require('../structures/seatLayout');

// 预定座位
/*
userId:
screeningId:
seats:[{"seatRow":5,"seatColumn":8},{"seatRow":5,"seatColumn":9}]
*/
router.post('/', async function(req, res, next) {
    var screening = await models.Screening.findByPk(req.body.screeningId);
    if (!screening) {
        res.status(400).json({msg:"排片不存在"});
        return;
    }
    var user = await models.User.findByPk(req.body.userId);
    if (!user) {
        res.status(400).json({msg:"用户不存在"});
        return;
    }
    var seatLayout = new SeatLayout(screening.seatLayout.theaterName,screening.seatLayout.rows,screening.seatLayout.columns);
    seatLayout.setSeats(screening.seatLayout.seats);
    //console.log(seatLayout);
    const newBookings = [];
    for ( i in req.body.seats) {
        var booking = await models.Booking.create({
            userId: req.body.userId,
            screeningId: req.body.screeningId,
            seatRow: req.body.seats[i].row,
            seatColumn: req.body.seats[i].col,
            status: "booked"
        });
        newBookings.push(booking);
        seatLayout.bookSeat(req.body.seats[i].row, req.body.seats[i].col);
    }
    // console.log(seatLayout);
    screening.update({
        seatLayout: seatLayout
    });
    res.json({booking:newBookings, msg:"订座成功"});
})

router.get('/:id', async function(req, res, next) {
    var booking = await models.Booking.findByPk(req.params.id);
    if (!booking) {
        res.status(400).json({msg: "订单不存在"});
    }
    res.json({booking: booking});
})

router.get('/', async function(req, res, next) {
    console.log(req.query.sta);   
    if (req.query.sta === "date") {
        const bookedBookings = await models.Booking.findAll({
            where: {
              status: 'booked',
            },
            include: [{
                model: models.Screening, 
                attributes: ['date', 'price'], }]
        });
        const currentDate = new Date(); // 当前日期
        const sevenDaysAgo = new Date(); // 七天前的日期
        sevenDaysAgo.setDate(currentDate.getDate() - 7);
        const dateBookingCounts = [];
        bookedBookings.forEach(booking => {
            const createdAtDate = new Date(booking.Screening.date);
            if (createdAtDate >= sevenDaysAgo && createdAtDate < currentDate) {
                // 提取日期部分并格式化为 "YYYY-MM-DD" 格式
                const formattedDate = createdAtDate.toISOString().split('T')[0];
                // 查找数组中是否已存在相同日期的项
                const existingItem = dateBookingCounts.find(item => item.date === formattedDate);
                if (existingItem) {
                    existingItem.bookingCount=existingItem.bookingCount+parseFloat(booking.Screening.price);
                } else {
                    dateBookingCounts.push({ 
                        date: formattedDate, 
                        bookingCount: parseFloat(booking.Screening.price),
                    });
                }
            } 
        });
        dateBookingCounts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
          
            // 如果要升序排序，使用dateA - dateB
            // 如果要降序排序，使用dateB - dateA
            return dateA - dateB;
        });
        res.json({ dateBookingCounts: dateBookingCounts });
        return;
    }
    if (req.query.sta === "movie") {
        var bookedBookings = await models.Booking.findAll({
            where: {
                status: 'booked',
            },
            include: [
                {
                    model: models.Screening, 
                    attributes: ['movieId','price'], 
                    include: [
                        {
                          model: models.Movie, // 关联到Movie模型
                          attributes: ['title'], // 选择需要的属性，例如title
                        },
                    ],
                },
            ]
        });
        // 按照screeningId关联的Screnning.movieId分组
        const groupedBookings = bookedBookings.reduce((acc, booking) => {
            const key = booking.Screening.movieId; 
            if (!acc[key]) {
              acc[key] = {
                movieId: key,
                title: booking.Screening.Movie.title,
                bookingCount: 0,
                };
            }
            acc[key].bookingCount=acc[key].bookingCount+parseFloat(booking.Screening.price);
            return acc;
        }, {});
        // 转化为数组，并按订单数量降序排序
        const movieBookingCounts = Object.values(groupedBookings)
            .sort((a, b) => b.bookingCount - a.bookingCount)
            .slice(0, 10);
        res.json({movieBookingCounts: movieBookingCounts});
        return;
    }
})

router.put('/:id', async function(req, res, next) {
    var booking = await models.Booking.findByPk(req.params.id);
    if (!booking) {
        res.status(400).json({msg: "订单不存在"});
        return;
    }
    var screening = await models.Screening.findByPk(booking.screeningId);
    var seatLayout = new SeatLayout(screening.seatLayout.theaterName,screening.seatLayout.rows,screening.seatLayout.columns);
    seatLayout.setSeats(screening.seatLayout.seats);
    //console.log(seatLayout);
    seatLayout.cancelSeat(booking.seatRow, booking.seatColumn);
    // console.log(seatLayout);
    screening.update({
        seatLayout: seatLayout
    });
    booking.update({
        status: "canceled"
    })
    res.json({msg:"取消订单成功"});
})

router.put('/', async function(req, res, next) {
    const bookingIds = req.body; // 接收到的订单数组
    for (const bookingId of bookingIds) {
        const booking = await models.Booking.findByPk(bookingId);
        if (!booking) {
            res.status(400).json({ msg: "订单不存在" });
            return;
        }
        const screening = await models.Screening.findByPk(booking.screeningId);
        const seatLayout = new SeatLayout(
            screening.seatLayout.theaterName,
            screening.seatLayout.rows,
            screening.seatLayout.columns
        );
        seatLayout.setSeats(screening.seatLayout.seats);
        seatLayout.cancelSeat(booking.seatRow, booking.seatColumn);
        await screening.update({
            seatLayout: seatLayout,
        });
        await booking.update({
            status: "canceled",
        });
    }
    res.json({ msg: "取消订单成功" });
})

module.exports = router;