/**
 * removes an item from the data if it contains `substring` in `field`
 * @param {Array<Object>} jsonData 
 * @param {string} substring 
 * @param {string} field 
 * @returns {Array<Object>}
 */
function removeStringInstances(jsonData, substring, field) {
    const regex = new RegExp(substring, "i");
    return jsonData.filter(item => {
        if (typeof item[field] === 'undefined') {
            console.warn(`Warning: field "${field}" does not exist in item:`, item);
            return true; // we want to keep the item if the field is not found
        }
        return !regex.test(item[field]); // check if substring in field
    }); 
}

module.exports = removeStringInstances;