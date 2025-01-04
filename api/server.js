//app.js

import http from 'http';
import fs from 'fs';
import * as formidable from 'formidable';
import path from 'path';
import {generateTitleFromPdfText} from "../main.js";
import {extractTextFromPdf} from "../parser.js";
import { blob } from 'stream/consumers';


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
        console.log("Fetching...")

        let body = '';

        // Collect the data sent in the request
        req.on('data', chunk => {
          body += chunk;
        });
    
        // When the data is fully received, process the string
        req.on('end', async () => {
          try {
            // Parse the JSON body to get the string
            const parsedBody = JSON.parse(body);
            const { text } = parsedBody;

            console.log("sendText:", text);
    
            if (text) {
              const storedString = text; // Store the string in memory. This is the string of the pdf contents

              
              const newName = await generateTitleFromPdfText(storedString);
              console.log("newNameServerJS:", newName);


              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: newName }));



            } else {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ message: 'No string provided!' }));
            }
          } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Error processing request.' }));
          }
        });
    } else if (url === "/tail.html") {
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
                res.writeHead(200, { 'Content-Type': 'text/javascript' });
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
    } else if (url == '/AMS.png') {
        console.log("hey", url)
        fs.readFile("AMS.png", function (err, pgres) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.write("AMS.png NOT FOUND");
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': 'image/png' });
                res.write(pgres);
                res.end();
            }
        });
    }
}).listen(3000, function () {
    console.log("SERVER STARTED PORT: 3000");
});