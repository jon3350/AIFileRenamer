//app.js

import http from 'http';
import fs from 'fs';


http.createServer(function (req, res) {
    var url = req.url;
    console.log(`Request URL: ${req.url}`);
    if (url === "/") {
        fs.readFile("head.html", function (err, pgres) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("HEAD.HTML NOT FOUND");
                res.end();
            } else {
                res.writeHead(200, {'Content-Type': 'text/html' });
                res.write(pgres);
                res.end();
            }
        });
    } else if (url === "/tailPage") {
        fs.readFile("tail.html", function (err, pgres) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("TAIL.HTML NOT FOUND");
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(pgres);
                res.end();
            }
        });
    } else if (url == '/styles.css') {
        console.log("hey", url)
        fs.readFile("styles.css", function (err, pgres) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("Styles.css NOT FOUND");
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.write(pgres);
                res.end();
            }
        });
    } else if (url == '/script.js') {
        console.log("hey", url)
        fs.readFile("script.js", function (err, pgres) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("Styles.css NOT FOUND");
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/js' });
                res.write(pgres);
                res.end();
            }
        });
    }

}).listen(3000, function () {
    console.log("SERVER STARTED PORT: 3000");
});