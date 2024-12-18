const fs = require('fs/promises');

const removeStringInstances = require('./removeStringInstances'); 
const roundPricesUp = require('./roundPricesUp');
const removeDays = require('./removeDays');
const rewritejson = require('./rewritejson'); // this optional method writes the json data to another file

/**
 * modify json file based on criteria
 * @param {string} filePath 
 * @returns {Array<Object>} 
 */
async function updatejsonData(filePath) { // main method 
    if (typeof filePath !== 'string') { throw new Error('File path should be a string');}
    try {
        const rawData = await fs.readFile(filePath, 'utf8');
        let jsonData = JSON.parse(rawData);

        // uncomment the following to use the first item's field types as a standard which the other items should match and update this automatically should the first item's field types change
         // const fieldStandardTypes = useFirstItemFieldTypesAsDefault(jsonData);

        const fieldStandardTypes = {
            '@id': 'string',
            author: 'string',
            title: 'string',
            genre: 'string',
            price: 'number',
            publish_date: 'string',
            description: 'string',
            rating: 'string'
        };

        jsonData = await validateDataTypes(jsonData, fieldStandardTypes);

        jsonData = removeStringInstances(jsonData, "Peter", "author"); // remove instances of a substring in a field
        jsonData = roundPricesUp(jsonData, decimalPlaces=0); // round prices up to next integer
        jsonData = removeDays(jsonData, "saturday"); // remove books published on a saturday

        return jsonData;
    } catch (err) {
        console.error('Error updating JSON:', err);
        throw err;
    }
}

// uses the first item's field types as standard
function useFirstItemFieldTypesAsDefault(jsonData) {
    const fieldStandardTypes = {};
    const firstItem = jsonData[0];

    if (firstItem && typeof firstItem === 'object') {
        Object.keys(firstItem).forEach(field => {
            fieldStandardTypes[field] = typeof firstItem[field];
        });
    }
    return fieldStandardTypes;
}

/**
 * This removes any items for which its fields do not have the correct type or don't exist
 * @param {Array<Object>} jsonData 
 * @param {Object} fieldStandardTypes 
 * @returns {Array<Object>}
 */
async function validateDataTypes(jsonData, fieldStandardTypes) {
    const validItems = [];

    for (const [index, item] of jsonData.entries()) {
        let isValid = true;

        for (const field of Object.keys(item)) { // checks if any field is invalid and removes it if so
            if (typeof item[field] !== fieldStandardTypes[field]) {
                const removedMessage = `Type of ${field} in object at position ${index} is incorrect and should be '${fieldStandardTypes[field]}'. Received '${typeof item[field]}'`;
                console.warn(removedMessage);
                await logRemovedItems(removedMessage);
                isValid = false;
                break;
            }
        }

        if (isValid) {
            validItems.push(item);
        }
    }

    return validItems;
}

async function logRemovedItems(message) {
    try {
        await fs.writeFile('./log.txt', message);
    } catch (err) {
        console.error('Error writing log:', err);
        throw err;
    }
}

module.exports.updatejsonData = updatejsonData;
