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

// app.get('/db', (req, res) => {
// // '/db'는 접속하는 파일 경론데 'localhost:3000/db' url로 접속하면 작동되는 코드

//     pool.getConnection((err, connection) => {
//         if (err) throw err; // not connected!
        
//         // Use the connection
//         connection.query('SELECT * FROM sharegoods', (error, results, fields) => {
//             /*
//                 테이블명 잘 확인해서 쿼리문 수정!!
//             */
//             res.send(JSON.stringify(results)); // 웹페이지 상에 렌더링 해주는 코드
//             console.log(results);
//             connection.release();

//             // Handle error after the release.
//             if (error) throw error;
//             // Don't use the connection here, it has been returned to the pool.
//         });
//     });
// });

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

app.get('/share_auto_camping', (req, res) => {
    // 처음 shareautocamping 들어갔을 때는 전체 목록 보여주기
    var sql = 'select sharegoods.goodstype, sharegoods.goodsname, sharegoods.shareprice from sharegoods';
    connection.query(sql, (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            var products = rows
            res.render('share_auto_camping', {products:products} )
        }
    })
});

app.post('/share_auto_camping', (req, res) => {
    const form = req.body
    const goodstype = form.goodstype.split(',')
    const shareprice = form.shareprice.split(',')
    console.log(form.shareprice)
    // var sql = 타입에 따라 분류하는것, 날짜 이런 애들은 아직 안 들어감
    var sql = 'select s.goodstype, s.goodsname, s.shareprice, COUNT(r.idgoodsrentlist) as countshare from sharegoods as s INNER JOIN goodsrentlist as r ON s.idsharegoods=r.goodsid group by goodstype, goodsname, shareprice having (s.goodstype IN (?,?)) AND (s.shareprice between ? and ?) order by COUNT(r.idgoodsrentlist) desc';
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

app.get('/share_car_camping', (req, res) => {
    res.sendFile(__dirname + '/Share_carcamping.html')
});

app.post('/share_car_camping', (req, res) => {
    const form = req.body
    const goodstype = form.goodstype.split(',')
    console.log(goodstype)
    // 테이블 다 변경 되면 sql문 바꿔서 넣어주기
    var sql = 'select sharegoods.goodstype, sharegoods.goodsname, sharegoods.shareprice from sharegoods INNER JOIN goodsrentlist ON sharegoods.idsharegoods=goodsrentlist.idgoodsrentlist group by goodstype, goodsname having sharegoods.goodstype IN (?, ?) order by COUNT(goodsrentlist.idgoodsrentlist) desc';
    var parmas = [goodstype[0], goodstype[1]]
    connection.query(sql, parmas, (err, rows, fields) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(rows)
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