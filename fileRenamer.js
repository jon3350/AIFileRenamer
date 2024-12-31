import fs from 'fs';
import path from 'path';

export function renameFile(oldFilePath, newFileName) {

    // Check if the required arguments are provided
    if (!oldFilePath || !newFileName) {
        console.error("Usage: node renameFile.js <oldFilePath> <newFileName>");
        process.exit(1);
    }

    // Resolve the new file path
    const newFilePath = path.join(path.dirname(oldFilePath), newFileName); // Keep the same directory, change only the name

    // Rename the file
    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
            console.error("Error renaming the file:", err);
            return;
        }
        console.log(`File renamed from ${oldFilePath} to ${newFilePath}`);
    });
}

renameFile("ENTER FILE PATH HERE", "EssayTesterSample.pdf")