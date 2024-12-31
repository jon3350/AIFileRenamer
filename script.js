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
        file = await x.getFile();
        console.log(file);
        await sendFile(file);
    }
}

async function sendFile(file) {
    const formData = new FormData();
    formData.append('uploadedFile', file); // Add the file to the form data

    try {
        const response = await fetch('http://localhost:3000/upload', {
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