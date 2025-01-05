// Specify the workerSrc to avoid the deprecated warning
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js';


const fileNameMap = new Map([]);
window["renameFile"] = renameFile;

// Select the component by its ID
const button = document.getElementById('directoryButton');

let table = document.getElementById("table");

let addButton = (button) => {
    // Check if a <tbody> exists
    let lastTRow = table.querySelector("tr:last-of-type");
    console.log(lastTRow);

    // If there's no <tbody> or the last one already has three rows, create a new <tbody>
    if (!lastTRow || lastTRow.childElementCount >= 3) {
        lastTRow = document.createElement("tr");
        table.appendChild(lastTRow);
    }

    // Create a new row and cell for the button
    let cell = lastTRow.insertCell();
    cell.appendChild(button);
}

// Add a click event listener to the button
button.addEventListener('click', () => {
    // Alert a message when the button is clicked
    console.log('Button was clicked!');
    selectFiles().then(processFiles);
});

async function selectFiles() {
    try {
        let filesHandle = await window.showOpenFilePicker({
            multiple: true, // Allows multiple file selection
            types: [
              {
                description: "Pdf Files",
                accept: {
                  "application/pdf": [".pdf"],
                },
              },
            ],
          });



        return filesHandle;
    } catch (err) {
      console.error('Directory selection cancelled or failed', err);
      throw 'Directory selection cancelled or failed' + err;
    }
}

async function processFiles(fileSystem)
{
    console.log(fileSystem);
    for await (let fileSystemFileHandle of fileSystem)
    {
        let file = await fileSystemFileHandle.getFile();
        try
        {
        let newName = await sendFile(file);
            //writableFileSteam = await fileSystemFileHandle.createWritable();
        //writableFileSteam.write();

        //The move function is dumb and this doesn't work, so I think I am going to need to make a button for each file. The
        //button then calls a function which is based off the new file name. The function then accesses an array to know which file to
        //rename, then attempts to rename. Should hopefully then consult the user and say "hey can I rename this"

        if (fileNameMap.has(newName + ".pdf"))
            {
                newName = newName + " copy";
            }
    
            let i = 2;
            const previousNewName = newName;
    
            while (fileNameMap.has(newName + ".pdf"))
            {
                newName = previousNewName + " " + i;
                i++;
            }
    
            newName = newName + ".pdf";
            
            let button = document.createElement("button");
    
            button.innerHTML = "Rename " + file.name + "<br>to<br>" + newName;
    
            button.setAttribute("onclick","renameFile.call(this, \"" + newName + "\")");
    
            button.setAttribute("renaming","true");
    
            fileNameMap.set(newName, fileSystemFileHandle);
    
            addButton(button);
        } catch (err) {
        console.log("error: ", err);
        }
    }
}

async function sendFile(file) {

    console.log("File: ", file);
    console.log("File: ", file.name);

    //file is now a Blob
    try {
    file = await trimPdf(file);
    } catch (err) {
    throw err;
    }

    console.log("File: ", file);
    console.log("File Name: ", file.name);

    const fileContents = await extractTextFromPdfBlob(file);
    console.log(fileContents);

    // const formData = new FormData();
    // formData.append('uploadedFileContents', fileContents); // Add the file to the form data

    try {
        const response = await fetch('/upload', {
            method: 'POST', // Send a POST request
            headers: {
              'Content-Type': 'application/json', // Specify the type of data we're sending
            },
            body: JSON.stringify({ text: fileContents }) // Send the string inside an object as JSON
          });

        if (response.ok) {
            console.log(`File ${file.name} uploaded successfully!`);
            let responseJSON = await response.json();
            console.log(responseJSON.message);
            return responseJSON.message;
        } else {
            console.error(`Failed to upload file ${file.name}:`, response.statusText);
        }
    } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
    }
}

// AND RETURN A BLOB
async function trimPdf(file) {
    const fileBuffer = await file.arrayBuffer();
    let pdfDoc;
    
    try
    {
    pdfDoc = await PDFLib.PDFDocument.load(fileBuffer); // Access PDFDocument via pdfLib
    } catch(err) {
    throw err;
    }

    let totalPages = pdfDoc.getPageCount();
    console.log("Total pages: ", totalPages);

    const originalTotal = totalPages;
    let pageNumber = 0;

    for(let pageCursor = 1; pageCursor <= totalPages; pageCursor++)
    {
        pageNumber++;
        if ((!(pageCursor <= 2)) && (!((totalPages - pageCursor) < 2)) && (pageNumber != Math.floor(originalTotal/2)) && (pageNumber != Math.floor(originalTotal/2) + 1))
        {
            console.log("page cursor:", pageCursor, " page number: ", pageNumber);
            pdfDoc.removePage(pageCursor);
            totalPages--;
            pageCursor--;
        }
        else {
            console.log("Skipped! page cursor: ", pageCursor, " page number: ", pageNumber);
        }
    }

    const trimmedPdfBytes = await pdfDoc.save();
    const blob = new Blob([trimmedPdfBytes], { type: 'application/pdf' });

    return blob;

    let newFile = new File([blob], file.name, { type: 'application/pdf' });

    console.log(newFile);
    console.log(pdfDoc.getPageCount());

    // Return a File object
    return newFile;
}

async function renameFile(newName)
{
    let fileSystemFileHandle = fileNameMap.get(newName);

    this.setAttribute("disabled", "disabled");

    let setAttributeTrue = () => {this.setAttribute("fileRenamed", "true");}
    let setAttributeFalse = () => {this.setAttribute("fileRenamed", "false");}  
    let setAttributeError = () => {this.setAttribute("fileRenamed", "error");}

    let userDesire = window.confirm("Rename " + fileSystemFileHandle.filename + " to " + newName);

    if (userDesire == true) {
    fileSystemFileHandle.requestPermission({mode: 'readwrite'}).then(function (value) {
        if (value === "granted")
        {
            fileSystemFileHandle.move(newName).then(setAttributeTrue, () => {
                console.log("error renaming file");
            });
        }
        else (value === "denied")
        {
            setAttributeFalse();
        }

    });
    } else {
        setAttributeFalse();
        console.log("cancelled");
    }
}





// Do this on client side
// Function to convert a Blob PDF to a string of text
async function extractTextFromPdfBlob(pdfBlob) {
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
  
    try {
      // Use pdf.js to load the PDF from the ArrayBuffer
      const pdfDoc = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
  
      let extractedText = '';
  
      // Loop through all pages of the PDF and extract text
      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' '); // Join the text items
        extractedText += pageText + '\n'; // Append the page text
      }
  
      return extractedText;
    } catch (error) {
      console.error("Error extracting text from PDF: ", error);
      return null;
    }
  }

  