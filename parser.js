import fs from "fs/promises";
import { PdfReader } from "pdfreader";
import * as pdfjsLib from 'pdfjs-dist';


// Function to extract text from a PDF buffer
export async function extractTextFromPdf (pdfBuffer) {
  const pdfDoc = await pdfjsLib.getDocument(pdfBuffer).promise; // Load PDF document from buffer
  let extractedText = '';

  // Loop through all pages of the PDF
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Extract and concatenate text from each page
    const pageText = textContent.items.map(item => item.str).join(' ');
    extractedText += pageText + '\n';
  }

  return extractedText;
};

// export async function extractTextFromPDFBlob(blob) {
//     try {
//       // Convert the blob to an ArrayBuffer
//       const arrayBuffer = await blob.arrayBuffer();
  
//       // Load the PDF using PDF.js
//       const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
//       let extractedText = '';
  
//       // Iterate through each page and extract text
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const textContent = await page.getTextContent();
  
//         // Concatenate text items into a single string
//         const pageText = textContent.items.map(item => item.str).join(' ');
//         extractedText += pageText + '\n';
//       }
  
//       return extractedText;
//     } catch (error) {
//       console.error('Error extracting text from PDF:', error);
//       throw error;
//     }
//   }



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


export async function convertPdfToText(_pdfPath) {

    const pdfBuffer = await fs.readFile(_pdfPath);

    try {
        // Parse the PDF buffer and extract text
        const extractedTextArr = await parsePdfBuffer(pdfBuffer);
        console.log("Text extracted from PDF");

        // Concat extratedTextArr into a string
        const extractedString = extractedTextArr.join("\n");
        console.log("Extracted pdf string", extractedString);
        return extractedString;

    } catch (err) {
        console.error("Error processing PDF buffer:", err);
    }
}

// export async function convertPdfToText(_pdfPath, _outputPath) {

//     const pdfBuffer = await fs.readFile(_pdfPath);

//     await fs.writeFile(_outputPath, '');


//     try {
//         // Parse the PDF buffer and extract text
//         const extractedText = await parsePdfBuffer(pdfBuffer);
//         console.log("Text extracted from PDF");

//         // Write the extracted text to the output file
//         for (const line of extractedText) {
//             await fs.appendFile(_outputPath, line + "\n"); // Append each line to the file
//         }

//         console.log('Extracted text has been written to', _outputPath);
//     } catch (err) {
//         console.error("Error processing PDF buffer:", err);
//     }
// }