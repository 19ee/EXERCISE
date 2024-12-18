/**
 * rounds prices up
 * @param {Array<Object>} jsonData 
 * @param {number} decimalPlaces - the amount of places to round to (0 = whole number)
 * @returns {Array<Object>}
 */
function roundPricesUp(jsonData, decimalPlaces) {
    // Edit prices
    const powerTen = 10 ** decimalPlaces;
    return jsonData.map(item => {
        if (typeof item.price === "number") {
            const newPrice = Math.ceil(item.price * powerTen) / powerTen; // round price to desired number of dec places
            return { ...item, price: newPrice }; // Update the price
        }
        return item; // Reain the item as-is if wrong type or nonexistent
    });
}

module.exports = roundPricesUp;