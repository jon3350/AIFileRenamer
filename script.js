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
    parserModule =  await import("./parser.js");
    console.log(directory.name);
    let directoryEntries = directory.values();
    console.log(directoryEntries);
    for await (let x of directoryEntries)
    {
        console.log(x);
        console.log(x.getFile());
        //x.getFile().then(parserModule.convertPdfToText);
    }
}