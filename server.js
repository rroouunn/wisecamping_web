const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.static(__dirname + '/public'));

// localhost 3000 으로 서버 구동
const server = app.listen(3000, () => {
    console.log('Start Server : localhost:3000');
});

var mysql = require('mysql');
var pool = mysql.createPool({  // 우리 졸프 AWS db 접속정보인데 일단 돌아가나 확인해보고 너네 db로 수정해봐
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

app.get('/db', (req, res) => {
// '/db'는 접속하는 파일 경론데 'localhost:3000/db' url로 접속하면 작동되는 코드

    pool.getConnection((err, connection) => {
        if (err) throw err; // not connected!
        
        // Use the connection
        connection.query('SELECT * FROM 공유물품', (error, results, fields) => {
            /*
                테이블명 잘 확인해서 쿼리문 수정!!
            */
            res.send(JSON.stringify(results)); // 웹페이지 상에 렌더링 해주는 코드
            console.log(results);
            connection.release();

            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
        });
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});