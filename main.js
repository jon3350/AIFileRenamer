import { convertPdfToText, extractTextFromPdf } from './parser.js'
import { processInstructionManual} from './titleGenerator.js'
import fs from 'fs';


export async function generateTitleFromPdfText(pdfText) {
  try {
    const pdfDetailsAI = await processInstructionManual(pdfText);
    console.log("AI used")

    console.log("AI Generated file details:");
    console.log(pdfDetailsAI);

    return pdfDetailsAI;

    // create the title following certain rules
    const paddedRevision = pdfDetailsAI.revision.padStart(2, " ");
    const paddedMonth = pdfDetailsAI.monthAsNumber.padStart(2, "0");
    const sanitizedTitle = pdfDetailsAI.title.replace(/ /g, "_");

    const newName = pdfDetailsAI.partNumber + "_rev_" + paddedRevision + "_" + pdfDetailsAI.year + "." + 
    paddedMonth + "_" + sanitizedTitle;

    return newName;

  } catch (err) {
    console.error('Error processing the PDF:', err);
  }
}


// export async function generateTitleFromPdf(pdfPath) {

//     const beginningOfFileName = pdfPath.lastIndexOf("\\");
//     const fileExtension = pdfPath.lastIndexOf(".");
//     const outputName = pdfPath.slice(beginningOfFileName + 1, fileExtension);

//     const outputPath = "./textOutput/" + outputName + ".txt";

//     console.log(outputPath);
  
//     // Call the parser function
//     try {
//       await convertPdfToText(pdfPath, outputPath);

//       const content = await extractTextFromPdf(pdfPath);

//       console.log('PDF processed successfully!');
  
//       // Additional logic to generate a titleJSON from the output file
//       // const content = await fs.promises.readFile(outputPath, 'utf-8');
//       // console.log("Text File Read");

//       // fs.unlink(outputPath, (err) => {
//       //   if (err) {
//       //     console.error(`Error removing file: ${err}`);
//       //     return;
//       //   }});

//       // title generation logic from titleGenerator.js. It also prints it out for now
//       // THIS MAY RUN BEFORE THE OUTPUT FILE IS UPDATED...
//       let pdfDetailsAI = await processInstructionManual(content);
//       console.log("AI used")

//       return pdfDetailsAI;

//       // console.log(`File Content: ${content}`); 
//     } catch (err) {
//       console.error('Error processing the PDF:', err);
//     }
//   }
  
