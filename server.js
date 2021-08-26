const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
require('dotenv').config();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended:true }));

app.set('view engine', 'ejs');
app.set('views', './views');

// localhost 3000 으로 서버 구동
const server = app.listen(3000, () => {
    console.log('Start Server : localhost:3000');
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

connection.connect();

app.get('', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/shareform', (req, res) => {
    res.render('shareform')
});

app.get('/share_done', (req, res) => {
    res.render('share_done')
});

app.post('/shareform', (req, res) => {
    const form = req.body
    const idmember = form.idmember
    const itemtype = form.itemtype
    const itemname = form.itemname
    const shareprice = form.shareprice
    const description = form.description

    if(!idmember || !itemtype || !itemname || !shareprice || !description) {
        // 하나라도 누락된 경우
        res.send('정보를 모두 입력해주세요')
        console.log(idmember, itemtype, itemname, shareprice, description)
        return
    }

    var sql = 'insert into camping_db.shareform (idmember, itemtype, itemname, shareprice, description) values (?, ?, ?, ?, ?)';
    var params = [idmember, itemtype, itemname, shareprice, description]
    console.log(params)

    connection.query(sql, params, (err, rows, fields) => {
        if(err)
            console.log(err)
        else {
            console.log(rows)
            res.render('share_done')
        }
    })
});

app.get('/share_auto_camping_main', (req, res) => {
    // 처음 shareautocamping 들어갔을 때는 전체 목록 보여주기
    var sql = 'select sharegoods.goodstype, sharegoods.image, sharegoods.goodsname, sharegoods.shareprice from sharegoods';
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            var products = rows
            res.render('share_auto_camping_main', {products:products} )
        }
    })
});

app.post('/share_auto_camping', (req, res) => {
    const form = req.body
    const goodstype = form.goodstype.split(',')
    const shareprice = form.shareprice.split(',')
    console.log(form.shareprice)
    var sql = 'select s.goodstype, s.image, s.goodsname, s.shareprice, COUNT(r.idgoodsrentlist) as countshare from sharegoods as s INNER JOIN goodsrentlist as r ON s.idsharegoods=r.goodsid group by goodstype, goodsname, shareprice having (s.goodstype IN (?,?)) AND (s.shareprice between ? and ?) order by COUNT(r.idgoodsrentlist) desc';
    var parmas = [goodstype[0], goodstype[1], shareprice[0], shareprice[1]] //type과 가격 추가
    connection.query(sql, parmas, (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            var products = rows
            console.log(products)
            res.render('share_auto_camping', {products:products} )
        }
    })
});

app.get('/share_car_camping_main', (req, res) => {
    // 처음 share car camping에 들어갔을 때는 전체 목록 보여주기
    var sql = 'select carcamitem.caritemtype, carcamitem.image, carcamitem.caritemname, carcamitem.caritemprice from carcamitem';
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            var products = rows
            res.render('share_car_camping_main', {products:products} )
        }
    })
});

app.post('/share_car_camping', (req, res) => {
    const form = req.body
    const caritemtype = form.caritemtype.split(',')
    const caritemprice = form.caritemprice.split(',')
    console.log(form.caritemprice)
    var sql = 'select carcamitem.caritemtype, carcamitem.image, carcamitem.caritemname, carcamitem.caritemprice from carcamitem INNER JOIN carrentlist ON carcamitem.idcarcamitem=carrentlist.idcarrentlist group by caritemtype, caritemname having carcamitem.caritemtype IN (?, ?) order by COUNT(carrentlist.idcarrentlist) desc';
    var parmas = [caritemtype[0], caritemtype[1], caritemprice[0], caritemprice[1]]
    connection.query(sql, parmas, (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            var products = rows
            console.log(products)
            res.render('share_car_camping', {products:products} )
        }
    })
});

app.get('/info_auto_camping', (req, res) => {
    res.sendFile(__dirname + '/info_autocamping.html')
});

app.get('/info_car_camping', (req, res) => {
    res.sendFile(__dirname + '/info_carcamping.html')
});

app.get('/personal', (req, res) => {
    res.sendFile(__dirname + '/personal.html')
});

app.get('/condition', (req, res) => {
    res.sendFile(__dirname + '/condition.html')
});

app.get('/wish_list', (req, res) => {
    res.sendFile(__dirname + '/wish_list.html')
});

app.get('/join', (req, res) => {
    res.sendFile(__dirname + '/join.html')
});

app.get('/detail/:idx', (req, res, next) => {
    const idx = res.params.idx;
        var sql = 'select idsharegoods, goodstype, goodsname, shareprice from sharegoods where idsharegoods = ?'
    
    connection.query(sql, [idx], (err, row) => {
        if(err) {
            console.log(err)
        }
        else {
            res.render('detail', {title : 장비상세, row:row[0]})
        }
    })
});