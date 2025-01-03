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
        let data = [];

        req.on('data', chunk => {
          data.push(chunk); // Collect data chunks
        });
    
        req.on('end', async () => {
          const blobBuffer = Buffer.concat(data); // Combine all chunks into a buffer
          console.log('Received Blob (binary data):', blobBuffer);

          const uint8Array = new Uint8Array(blobBuffer);
          console.log('Converted to unit8Array:', uint8Array);


                  //   Process the binary PDF Blob
                  try {
                    const text = await extractTextFromPdf(uint8Array);
                    console.log('Extracted Text from PDF:', text);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Blob received successfully' }));
                  } catch (error) {
                    console.error('Error extracting text from PDF:', error);
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.write("Error in extractTextFromPdf");
                    res.end();
                  }
            


    
        //   Process the binary PDF Blob
        //   try {
        //     const text = await extractTextFromPdf(uint8Array);
        //     console.log('Extracted Text from PDF:', text);
        //     // generateTitleFromPdfText(text).then(function (pdfDetailsAI) {
        //     //     console.log("AI Generated file details:");
        //     //     console.log(pdfDetailsAI);
        //     // } );
    

        //     res.writeHead(200, { 'Content-Type': 'application/json' });
        //     // res.write(JSON.stringify({message: "IDK"}));
        //     res.end();



        //   } catch (error) {
        //     console.error('Error extracting text from PDF:', error);
        //   }


        });
    
        req.on('error', err => {
          console.error('Error receiving blob:', err);
          res.writeHead(500);
          res.end();
        });

        // const form = new formidable.IncomingForm();
        // form.uploadDir = './uploads';
        // form.keepExtensions = true;

        // // Handle file uploads
        // form.on('fileBegin', (formName, file) => {
        //     // Customize the file path
        //     const sanitizedFileName = file.originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_'); // Sanitize filename
        //     file.filepath = path.join('./uploads', sanitizedFileName);
        // });

        // form.parse(req, (err, fields, files) => {
        //     if (err) {
        //         console.error("Error parsing form:", err);
        //         res.writeHead(500, { 'Content-Type': 'text/plain' });
        //         res.write("Internal Server Error");
        //         res.end();
        //         return;
        //     }

        //     console.log("Recieved file:", files);

        //     let filepath = ".\\" + files.uploadedFile[0].filepath;
        //     console.log("Filepath: " + filepath);

        //     generateTitleFromPdf(filepath).then(function (pdfDetailsAI) {
        //         console.log("AI Generated file details:");
        //         console.log(pdfDetailsAI);

        //         let paddedRevision = pdfDetailsAI.revision.padStart(2, " ");
        //         let paddedMonth = pdfDetailsAI.monthAsNumber.padStart(2, "0");
        //         let sanitizedTitle = pdfDetailsAI.title.replace(/ /g, "_");

        //         let newName = pdfDetailsAI.partNumber + "_rev_" + paddedRevision + "_" + pdfDetailsAI.year + "." + 
        //         paddedMonth + "_" + sanitizedTitle;

        //         let newFile = form.uploadDir + "/" + newName + ".pdf";
        //         console.log(filepath + " should be renamed to " + newName);

        //         // fs.rename(filepath, newFile,() => {console.log("Success");}); //Now, when we call this, we want to also send something to the client to rename their file
        //         //We don't need to rename the file locally. We already did all the work in finding the new file name. Just delete the file now.
        //         fs.unlink(filepath, function (err) {
        //             if (err) throw err
        //             console.log("deleted: " + filepath);
        //         });

        //     res.writeHead(200, { 'Content-Type': 'application/json' });
        //     res.write(JSON.stringify({message: newName, file: files.uploadedFile}));
        //     res.end();
                
        //     }, () => {console.log("error reading file");}
        //     );
        // });
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
    }
}).listen(3000, function () {
    console.log("SERVER STARTED PORT: 3000");
});