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

export async function convertPdfToText(_pdfPath, _outputPath) {

    const pdfBuffer = await fs.readFile(_pdfPath);

    await fs.writeFile(_outputPath, '');


    try {
        // Parse the PDF buffer and extract text
        const extractedText = await parsePdfBuffer(pdfBuffer);
        console.log("Text extracted from PDF:", extractedText);

        // Write the extracted text to the output file
        for (const line of extractedText) {
            await fs.appendFile(_outputPath, line + "\n"); // Append each line to the file
        }

        console.log('Extracted text has been written to', _outputPath);
    } catch (err) {
        console.error("Error processing PDF buffer:", err);
    }

    console.log("troll")
}