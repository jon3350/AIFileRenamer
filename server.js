//app.js

import http from 'http';
import fs from 'fs';
import * as formidable from 'formidable';
import path from 'path';

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
    } else if (url === "/upload" && req.method === "POST") {
        const form = new formidable.IncomingForm();

       form.uploadDir = './uploads';
       form.keepExtensions = true;

        // Handle file uploads
        form.on('fileBegin', (formName, file) => {
            // Customize the file path
            const sanitizedFileName = file.originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
            file.filepath = path.join('./uploads', sanitizedFileName);
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error("Error parsing form:", err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.write("Internal Server Error");
                res.end();
                return;
            }

            console.log("Fields:", fields);
            console.log("Files:", files);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: "File uploaded successfully!", file: files.uploadedFile }));
            res.end();
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
                res.write("script.js NOT FOUND");
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'text/js' });
                res.write(pgres);
                res.end();
            }
        });
    } else if (url == '/favicon.ico') {
        console.log("hey", url)
        fs.readFile("favicon.ico", function (err, pgres) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("favicon.ico NOT FOUND");
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                res.write(pgres);
                res.end();
            }
        });
    }
}).listen(3000, function () {
    console.log("SERVER STARTED PORT: 3000");
});