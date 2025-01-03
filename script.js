const fileNameMap = new Map([]);
window["renameFile"] = renameFile;

// Select the component by its ID
const button = document.getElementById('directoryButton');

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

        fileNameMap.set(newName, fileSystemFileHandle);

        document.getElementById("myDIV").appendChild(button);

        let br = document.createElement("br");

        document.getElementById("myDIV").appendChild(br);
        document.getElementById("myDIV").appendChild(br);
    }
}

async function sendFile(file) {

    console.log("File: ", file);
    console.log("File: ", file.name);

    //file is now a Blob
    file = await trimPdf(file);

    console.log("File: ", file);
    console.log("File Name: ", file.name);

    const formData = new FormData();
    formData.append('uploadedFile', file); // Add the file to the form data

    try {
        const response = await fetch('./upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream', // Specify binary data
              },
            body: formData, // Send the form data
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
    const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer); // Access PDFDocument via pdfLib

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

function renameFile(newName)
{
    let fileSystemFileHandle = fileNameMap.get(newName);

    fileSystemFileHandle.requestPermission({mode: 'readwrite'}).then(function () {
        fileSystemFileHandle.move(newName);
    }
    );

    this.setAttribute("disabled", "disabled");
    if (fileSystemFileHandle.queryPermission() === "granted")
    {
        this.setAttribute("fileRenamed", "true");
    }
    else if (fileSystemFileHandle.queryPermission() === "denied")
    {
        this.setAttribute("fileRenamed", "false");
    }
    else (fileSystemFileHandle.queryPermission() === "denied")
    {
        this.setAttribute("fileRenamed", "error");
    }
}