const fileNameMap = new Map([]);
window["renameFile"] = renameFile;

// Select the component by its ID
const button = document.getElementById('directoryButton');

// button.addEventListener('click', () => {
//     fetchVariable();
// })

// Add a click event listener to the button
button.addEventListener('click', () => {
    // Alert a message when the button is clicked
    console.log('Button was clicked!');
    selectFiles().then(processFiles);
});

// async function fetchVariable() {
//     try {
//       console.log(`${window.location.href}lol`)
//     //   const response = await fetch(`${window.location.href}lol`); // Adjust the URL if necessary
//     const response = await fetch(`/lol`); // Adjust the URL if necessary
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json(); // Parse the JSON response
//       console.log('Fetched Variable:', data.variable); // Access the variable
//       return data.variable;
//     } catch (error) {
//       console.error('Error fetching variable:', error);
//       return null;
//     }
// }

async function fetchVariable() {
  try {
    const url = `${window.location.origin}/lol`; // Absolute URL for the POST request
    const requestData = {
      message: 'PLZZZWORK', // This is your data, send it as an object
    };

    const response = await fetch(url, {
      method: 'POST', // HTTP method
      headers: {
        'Content-Type': 'application/json', // Specify that we're sending JSON
      },
      body: JSON.stringify(requestData), // Convert JavaScript object to JSON string
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response
    console.log('Response:', data); // Log the response from the server
    return data; // Return the data received from the server
  } catch (error) {
    console.error('Error fetching variable:', error);
    return null;
  }
}

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
        let newName = await sendFile(file) + ".pdf";

        //writableFileSteam = await fileSystemFileHandle.createWritable();
        //writableFileSteam.write();

        //The move function is dumb and this doesn't work, so I think I am going to need to make a button for each file. The
        //button then calls a function which is based off the new file name. The function then accesses an array to know which file to
        //rename, then attempts to rename. Should hopefully then consult the user and say "hey can I rename this"

        let button = document.createElement("button");

        button.innerHTML = "Rename " + file.name + "<br>to<br>" + newName;

        button.setAttribute("onclick","renameFile(\"" + newName + "\")");

        fileNameMap.set(newName, fileSystemFileHandle);

        document.getElementById("myDIV").appendChild(button);

        let br = document.createElement("br");

        document.getElementById("myDIV").appendChild(br);
    }
}

async function sendFile(file) {

    console.log("File: ", file);
    console.log("File: ", file.name);

    file = await trimPdf(file);

    console.log("File: ", file.name);

    const formData = new FormData();
    formData.append('uploadedFile', file); // Add the file to the form data

    try {
        console.log(`${window.location.href}upload`)
        const response = await fetch(`${window.location.href}upload`, {
            method: 'POST',
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

async function trimPdf(file) {
    const fileBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFLib.PDFDocument.load(fileBuffer); // Access PDFDocument via pdfLib

    let totalPages = pdfDoc.getPageCount();
    console.log("Total pages: ", totalPages);

    for(let i = 1; i <= totalPages; i++)
    {
        if ((!(i <= 15)) && (!((totalPages - i) < 3)))
        {
            console.log("i:", i);
            pdfDoc.removePage(i);
            totalPages--;
            i--;
        }
    }

    const trimmedPdfBytes = await pdfDoc.save();
    const blob = new Blob([trimmedPdfBytes], { type: 'application/pdf' });

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
}