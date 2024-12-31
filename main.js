import { convertPdfToText } from './parser.js'
import { processInstructionManual} from './titleGenerator.js'
import fs from 'fs';


export async function generateTitleFromPdf(pdfPath) {

    const beginningOfFileName = pdfPath.lastIndexOf("\\");
    const fileExtension = pdfPath.lastIndexOf(".");
    const outputName = pdfPath.slice(beginningOfFileName + 1, fileExtension);

    const outputPath = "./textOutput/" + outputName;

    console.log(outputPath);
  
    // Call the parser function
    try {
      await convertPdfToText(pdfPath, outputPath);
      console.log('PDF processed successfully!');
  
      // Additional logic to generate a titleJSON from the output file
      const content = await fs.promises.readFile(outputPath, 'utf-8');
      console.log("Text File Read")

      // title generation logic from titleGenerator.js. It also prints it out for now
      // THIS MAY RUN BEFORE THE OUTPUT FILE IS UPDATED...
      let pdfDetailsAI = await processInstructionManual(content);
      console.log("AI used")

      return pdfDetailsAI;

      // console.log(`File Content: ${content}`); 
    } catch (err) {
      console.error('Error processing the PDF:', err);
    }
  }
  
