import fs from "fs/promises";
import { PdfReader } from "pdfreader";

// Helper function to wrap PdfReader.parseBuffer in a Promise
function parsePdfBuffer(pdfBuffer) {
    return new Promise((resolve, reject) => {
        const extractedText = [];
        new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
            if (err) {
                return reject(err); // Reject the promise if an error occurs
            }
            if (!item) {
                // End of buffer
                return resolve(extractedText); // Resolve with the extracted text
            }
            if (item.text) {
                extractedText.push(item.text); // Collect text items
            }
        });
    });
}

export async function convertPdfToText(_pdfContent) {

    const pdfBuffer = Buffer.from(_pdfContent, 'binary');

    let pdfText = [""];

    try {
        // Parse the PDF buffer and extract text
        const extractedText = await parsePdfBuffer(pdfBuffer);
        console.log(extractedText);

        throw new Error("Me thinks U cool");

        console.log("Text extracted from PDF");

        for (const line of extractedText) {
            pdfText += line; //Add each line to the string
        }

        return  pdfText;
    } catch (err) {
        console.error("Error processing PDF buffer:", err);
    }
}