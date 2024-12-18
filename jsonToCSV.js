const fs = require('fs/promises');

/**
 * The function jsonToCSV() converts a given json file to CSV format and writes it to a file
 * @param {Array<Object>} jsonData - the PARSED json data (given in the form of an array of json objects) that you want to convert
 * @param {string} destinationFile - the path of the file you want to write CSV data to
 * @param {Array<string>|null} keys - optional list of keys; defaults to whatever was given in the first row
 */

async function jsonToCSV(jsonData, destinationFile, headers=null) {
    try {
        if (jsonData.length === 0) { throw new Error('JSON data is empty'); }
        jsonData = validateJSONData(jsonData);
        if (headers === null) {headers = Object.keys(jsonData[0]);} // if keys are not defined, use the first row of data as a basis

        let csvRows = [];
        csvRows.push(headers.join(',')) // add each field key separated by commas as a header

        // this block invokes the formatRow() method on each element in the json data and creates a comma-separated string out of them
        jsonData.forEach(row => { 
            // omits a row from the processed data if keys dont align with the headers we defined
            if (!validateHeaders(headers, row)) {
                console.warn('Skipping the current row! (invalid keys data)')
                return;
            }

            const formattedRow = headers.map(field => {
                return formatRow(row, field) // ensures proper formatting (e.g. special characters properly handled/escaped)
            }).join(',');
            csvRows.push(formattedRow);
        });

        csvRows = csvRows.join('\n')
        await writeCSVToFile(destinationFile, csvRows);

    } catch (err) {
        console.error('Error converting to CSV:', err);
        throw err;
    }
}

/**
 * validates that json data is in the correct form
 * @param {any} jsonData
 * @throws {Error} if json data is not an array of objects
 */
function validateJSONData(jsonData) {
    if (typeof jsonData === 'string') {return validateJSONData(JSON.parse(jsonData))} // if jsondata is errantly left unparsed, this line will automatically correct it.
    
    if (!Array.isArray(jsonData)) {throw new Error('Invalid type given for jsonData argument (not an array)')}

    if (!jsonData.every(item => { return typeof item === 'object' && item !== null })) {
        throw new Error('jsonData parameter was given an invalid arguemnt (jsonData should be an array of objects)');
    }

    return jsonData;
}

/**
 * this one checks that each field in the header is present as a key in a row
 * @param {Array<Objects>} headers - keys
 * @param {Object} row
 * @returns {boolean}
 */
function validateHeaders(headers, row) {
    const rowKeys = Object.keys(row);
    return (headers.every(header => {
        return rowKeys.includes(header);
    })) 
}

/**
 * This function formats each field value for use in CSV format, escaping special characters and wrapping in double quotes where necessary
 * @param {Object} row - JSON object you want to process (i.e. the element)
 * @param {string} field - the key name of the specific field we are formatting 
 * @returns {string} - the formatted data that will be returned and added to the CSV data
 */
function formatRow(row, field) {
    let value;

    // get the value of each key in rows, defaulting to an empty string if there is no value
    if (row[field] !== undefined) { 
        value = String(row[field]);
    } else {
        value = '';
    }

    // wrap output in double quotes and escape characters where necessary
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`; // double quotes + escape special chars
    } else {
        return value; // no special characters -> return as-is
    }
}

/**
 * Writes the CSV data given to the path given
 * @param {string} filePath - file destination you want to write to
 * @param {string} csvdata - processed csvdata
 */
async function writeCSVToFile(filePath, csvdata) {
    try {
        // check that data is correct type
        if (typeof csvdata !== 'string') {
            throw new Error('Invalid CSV data provided (expected a string)');
        }
        // write to specified path asynchronously
        await fs.writeFile(filePath, csvdata);
        console.log('File updated successfully!')
    } catch (err) {
        console.error('Error writing CSV:', err);
        throw err;
    }
}

module.exports = jsonToCSV;