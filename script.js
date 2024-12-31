// Select the component by its ID
const button = document.getElementById('directoryButton');

// Add a click event listener to the button
button.addEventListener('click', () => {
    // Alert a message when the button is clicked
    console.log('Button was clicked!');
    let directoryHandle = selectDirectory();
    console.log(directoryHandle);
    directoryHandle.then(processDirectory);
});

async function selectDirectory() {
    try {
        let directoryHandle = await window.showDirectoryPicker();
        return directoryHandle;
    } catch (err) {
      console.error('Directory selection cancelled or failed', err);
      throw 'Directory selection cancelled or failed' + err;
    }
}

async function processDirectory(directory)
{
    console.log(directory.name);
    let directoryEntries = directory.values();
    console.log(directoryEntries);
    for await (let x of directoryEntries)
    {
        let file = await x.getFile();
        await sendFile(file);
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
        const response = await fetch('./upload', {
            method: 'POST',
            body: formData, // Send the form data
        });

        if (response.ok) {
            console.log(`File ${file.name} uploaded successfully!`);
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