import { convertPdfToText } from './parser.js'
import { processInstructionManual} from './titleGenerator.js'
import fs from 'fs';


export async function generateTitleFromPdf(pdfContent) {

  
    // Call the parser function
    try {
      let pdfText = await convertPdfToText(pdfContent);
      console.log('PDF processed successfully!');

      throw new Error("fu bro");

      // title generation logic from titleGenerator.js. It also prints it out for now
      // THIS MAY RUN BEFORE THE OUTPUT FILE IS UPDATED...
      let pdfDetailsAI = await processInstructionManual(pdfText);
      console.log("AI used")

      return pdfDetailsAI;

      // console.log(`File Content: ${content}`); 
    } catch (err) {
      console.error('Error processing the PDF:', err);
    }
  }
  
