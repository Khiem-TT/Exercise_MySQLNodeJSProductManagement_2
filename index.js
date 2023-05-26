let http = require('http');
let mysql = require('mysql');
let fs = require("fs");
let qs = require('qs');


let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Bncvznczvzz1411',
    database: 'dbTest'
});

connection.connect(err => {
    if (err) console.log(err.stack);
    console.log('Connect success');
});

let server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        fs.readFile('./addproduct.html', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            }
        });
    } else {
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let productInfo = qs.parse(data);
            fs.readFile('./addproduct.html', 'utf-8', (err, dataHtml) => {
                if (err) {
                    console.log(err.message);
                } else {
                    let sqlInsert = `insert into products(name, price) values('${productInfo.name}', ${+productInfo.price});`;
                    connection.query(sqlInsert, (err, result) => {
                        if (err) throw err;
                    })
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end('Add a product success');
                }
            });
        });
        req.on('error', () => {
            console.log('error');
        });
    }
});

server.listen(8080, () => {
    console.log('http://localhost:8080');
});