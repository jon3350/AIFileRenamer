import { config } from "dotenv";
config();

import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import fs from 'fs';



// Initialize OpenAI with API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define the schema for the structured data
const InstructionManualExtraction = z.object({
  partNumber: z.string(),
  revisionCombo: z.string(),
  month: z.string(),
  year: z.string(),
  title: z.string()
});


// Main function to process the text content and interact with OpenAI
export async function processInstructionManual(textContent) {
  try {
    const userContent = textContent;
    // console.log("User Content:", userContent);

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: "You are an expert at structured data extraction. You will be given unstructured text from a instruction manual and should convert it into the given structure." },
        { role: "user", content: userContent }, // Use the file content as user input
      ],
      response_format: zodResponseFormat(InstructionManualExtraction, "instruction_manual_extraction"),
    });

    // something's weird when trying to save content in variable
    console.log(completion.choices[0].message.parsed)
    // const instructionManualJSON = completion.choices[0].message.parsed;
    // console.log("Extracted Instruction Manual Data:", instructionManualJSON);
    // return instructionManualJSON;
  } catch (error) {
    console.error("Error processing the Instruction Manual:", error);
  }
}

// To test if openAI can work, just put some text in hi.txt and run this function
async function miniTest() {
  try {
    const content = await fs.promises.readFile("hi.txt", 'utf-8');
    processInstructionManual(content)
    // console.log(processInstructionManual(content));
  }
  catch(err) {
    console.error("error: " + err)
  }
}
// miniTest()