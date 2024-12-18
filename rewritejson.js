const fs = require('fs/promises')

/**
 * rewrites the json as a new file in the specified location
 * @param {Array<Object>} updatedData 
 * @param {string} destinationFile 
 */
async function rewritejson(updatedData, destinationFile) { // if we want to create a new json file
    try {
        // Write the updated JSON back to the file
        await fs.writeFile(destinationFile, JSON.stringify(updatedData, null, 4), 'utf8'); // utf8 encoding with indents of size 4
        console.log('File updated successfully!');
    } catch (err) {
        console.error('Error writing JSON file:', err);
        throw err; // Propagate the error
    }
}

module.exports.rewritejson = rewritejson;